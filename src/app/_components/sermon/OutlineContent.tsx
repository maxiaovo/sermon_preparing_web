"use client";

import { useState } from "react";

interface StageGroup {
  stage: {
    value: string;
    label: string;
    focus: string;
  };
  messages: string[];
}

interface OutlineContentProps {
  stageGroups: StageGroup[];
}

export function OutlineContent({ stageGroups }: OutlineContentProps) {
  const [copied, setCopied] = useState(false);

  function buildOutlineText(): string {
    return stageGroups
      .map((g) => {
        const header = `## ${g.stage.label}（${g.stage.focus}）`;
        const body = g.messages
          .map((m, i) => `${i + 1}. ${m}`)
          .join("\n\n");
        return `${header}\n\n${body}`;
      })
      .join("\n\n---\n\n");
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(buildOutlineText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = buildOutlineText();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-stone-500">
          你的讲道预备笔记，按阶段整理
        </p>
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50 transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
          {copied ? "已复制 ✓" : "复制全文"}
        </button>
      </div>

      <div className="space-y-6">
        {stageGroups.map((group) => (
          <div
            key={group.stage.value}
            className="rounded-xl border border-stone-200 bg-white p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
                {stageGroups.indexOf(group) + 1}
              </span>
              <div>
                <h2 className="font-serif font-semibold text-stone-800">
                  {group.stage.label}
                </h2>
                <p className="text-xs text-stone-400">{group.stage.focus}</p>
              </div>
            </div>

            <div className="space-y-3">
              {group.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-stone-50 px-4 py-3 text-sm leading-relaxed text-stone-700"
                >
                  <span className="mr-2 text-xs font-medium text-stone-400">
                    {idx + 1}.
                  </span>
                  {msg}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
