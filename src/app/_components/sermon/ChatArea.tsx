"use client";

import { useState, useRef, useEffect } from "react";
import { getStageInfo } from "@/app/_lib/coaching/stages";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface ChatAreaProps {
  sermonId: string;
  initialMessages: Message[];
  currentStage: string;
}

export function ChatArea({
  sermonId,
  initialMessages,
  currentStage,
}: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState("");
  const [error, setError] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const stageInfo = getStageInfo(currentStage);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setError("");

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setStreaming("");

    try {
      const res = await fetch(`/api/sermons/${sermonId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "请求失败");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("无法读取响应");

      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                fullText += data.text;
                setStreaming(fullText);
              }
              if (data.done) {
                const finalText = data.fullText ?? fullText;
                const finalTextClean = finalText.replace(
                  /\[STAGE_COMPLETE\]/g,
                  "",
                ).trim();

                setMessages((prev) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: finalTextClean || finalText,
                    createdAt: new Date().toISOString(),
                  },
                ]);
                setStreaming("");

                if (data.stageChanged) {
                  window.location.reload();
                  return;
                }
              }
              if (data.error) {
                throw new Error(data.error);
              }
            } catch {}
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "发送失败");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-stone-200 bg-white px-6">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
          {STAGE_INDEX(stageInfo.value) + 1}
        </span>
        <div>
          <h1 className="text-sm font-semibold text-stone-800">
            {stageInfo.label}
          </h1>
          <p className="text-xs text-stone-400">{stageInfo.focus}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
              <svg className="h-7 w-7 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <h2 className="mt-4 font-serif font-semibold text-stone-500">
              开始你的讲道预备
            </h2>
            <p className="mt-2 max-w-md text-sm text-stone-400">
              AI 教练将通过智慧的提问引导你预备讲道。在下方输入你的想法，开始对话。
            </p>
          </div>
        )}

        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-stone-800 text-white"
                    : "border border-stone-200 bg-white text-stone-700"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}

          {streaming && (
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm leading-relaxed text-stone-700 animate-pulse">
                {streaming}
                <span className="ml-0.5 inline-block h-4 w-0.5 bg-amber-400" />
              </div>
            </div>
          )}
        </div>

        <div ref={chatEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="mx-6 mb-2 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-stone-200 bg-white p-4">
        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你的反思…"
            rows={2}
            disabled={loading}
            className="flex-1 resize-none rounded-xl border border-stone-300 px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="shrink-0 self-end rounded-xl bg-stone-800 p-2.5 text-white hover:bg-stone-700 transition-colors disabled:opacity-40"
          >
            {loading ? (
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function STAGE_INDEX(stage: string): number {
  const stages = [
    "PREPARATION",
    "EXEGESIS",
    "THEOLOGICAL",
    "APPLICATION",
    "STRUCTURE",
    "DELIVERY",
  ];
  return stages.indexOf(stage);
}
