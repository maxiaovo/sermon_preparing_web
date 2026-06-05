import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "./prompt";
import type { PrepStage } from "@/generated/prisma/client";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT_CACHE_KEY = "sermon_coach_system";

export async function callCoach(
  stage: PrepStage,
  sermonContext: { title: string; passage: string },
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  newMessage: string,
): Promise<ReadableStream<Uint8Array>> {
  const systemPrompt = buildSystemPrompt(stage);

  const sermonNote = `## 讲道信息\n标题：${sermonContext.title}\n经文：${sermonContext.passage}\n\n请基于以上信息继续引导牧者。记住：只提问，不解答。`;

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const fullMessages: Array<{ role: "user" | "assistant"; content: string }> = [
    ...messages,
    { role: "user", content: newMessage },
  ];

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    temperature: 0.7,
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      { role: "user", content: sermonNote },
      ...fullMessages,
    ],
    stream: true,
  });

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let fullText = "";
      try {
        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const text = event.delta.text;
            fullText += text;
            const chunk = encoder.encode(`data: ${JSON.stringify({ text })}\n\n`);
            controller.enqueue(chunk);
          }
        }
        const done = encoder.encode(
          `data: ${JSON.stringify({ done: true, fullText })}\n\n`,
        );
        controller.enqueue(done);
        controller.close();
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "未知错误";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: errMsg })}\n\n`),
        );
        controller.close();
      }
    },
  });
}

export { SYSTEM_PROMPT_CACHE_KEY };
