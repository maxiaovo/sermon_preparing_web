import { NextRequest } from "next/server";
import { auth } from "@/app/_lib/auth";
import { prisma } from "@/app/_lib/prisma";
import { callCoach } from "@/app/_lib/coaching/claude";
import { getNextStage } from "@/app/_lib/coaching/stages";
import { checkRateLimit } from "@/app/_lib/rate-limit";
import type { PrepStage, MessageRole } from "@/generated/prisma/client";

const STAGE_COMPLETE_MARKER = "[STAGE_COMPLETE]";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "请先登录" }, { status: 401 });
  }

  const { id } = await params;

  if (!checkRateLimit(session.user.id)) {
    return Response.json(
      { error: "消息发送过于频繁，请稍后再试" },
      { status: 429 },
    );
  }

  const sermon = await prisma.sermon.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!sermon || sermon.userId !== session.user.id) {
    return Response.json({ error: "讲道不存在" }, { status: 404 });
  }

  let body: { message?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "无效请求" }, { status: 400 });
  }

  const { message } = body;
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return Response.json({ error: "消息不能为空" }, { status: 400 });
  }

  const recentMessages = sermon.messages.slice(-12).map((m) => ({
    role: (m.role === "ASSISTANT" ? "assistant" : "user") as
      | "user"
      | "assistant",
    content: m.content,
  }));

  try {
    const stream = await callCoach(
      sermon.currentStage as PrepStage,
      { title: sermon.title, passage: sermon.passage },
      recentMessages,
      message.trim(),
    );

    // Save user message immediately
    const userMessage = await prisma.conversationMessage.create({
      data: {
        role: "USER" as MessageRole,
        content: message.trim(),
        stage: sermon.currentStage as PrepStage,
        sermonId: sermon.id,
      },
    });

    // We need to read the stream to get full text for saving
    const reader = stream.getReader();
    let fullResponse = "";

    // Create a transform stream that captures full text while forwarding
    const responseStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);

            // Accumulate full text from SSE chunks
            const text = new TextDecoder().decode(value);
            const lines = text.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.text) fullResponse += data.text;
                  if (data.fullText) fullResponse = data.fullText;
                } catch { /* skip parse errors */ }
              }
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    // After stream finishes, save assistant message and check stage transition
    const saveResponse = new TransformStream<Uint8Array, Uint8Array>();
    const writer = saveResponse.writable.getWriter();
    const responseReader = responseStream.getReader();

    // Process and save after streaming
    const processStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await responseReader.read();
            if (done) {
              // Now save the assistant response
              let cleanText = fullResponse.replace(STAGE_COMPLETE_MARKER, "").trim();
              const stageCompleted = fullResponse.includes(STAGE_COMPLETE_MARKER);

              await prisma.conversationMessage.create({
                data: {
                  role: "ASSISTANT" as MessageRole,
                  content: cleanText || fullResponse,
                  stage: sermon.currentStage as PrepStage,
                  sermonId: sermon.id,
                },
              });

              if (stageCompleted) {
                const nextStage = getNextStage(sermon.currentStage);
                if (nextStage) {
                  await prisma.sermon.update({
                    where: { id },
                    data: { currentStage: nextStage as PrepStage },
                  });
                }
              }

              const doneMsg = new TextEncoder().encode(
                `data: ${JSON.stringify({
                  done: true,
                  stageChanged: stageCompleted,
                })}\n\n`,
              );
              controller.enqueue(doneMsg);
              controller.close();
              break;
            }
            controller.enqueue(value);
          }
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(processStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("AI coaching error:", error);
    return Response.json(
      { error: "AI 服务暂时不可用，请稍后再试" },
      { status: 500 },
    );
  }
}
