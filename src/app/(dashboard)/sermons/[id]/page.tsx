import { getSermon } from "@/app/_lib/data/sermons";
import { STAGES } from "@/app/_lib/coaching/stages";
import { ChatArea } from "@/app/_components/sermon/ChatArea";
import { redirect } from "next/navigation";

export default async function SermonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sermon = await getSermon(id);

  if (!sermon) redirect("/dashboard");

  const currentStageIdx = STAGES.findIndex(
    (s) => s.value === sermon.currentStage,
  );

  return (
    <div className="flex h-[calc(100vh-0px)]">
      {/* Stage Sidebar */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-stone-200 bg-white">
        <div className="flex h-14 items-center border-b border-stone-100 px-5">
          <a
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-stone-400 hover:text-stone-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            返回
          </a>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="mb-4 font-serif text-sm font-semibold text-stone-800">
            {sermon.title}
          </h2>
          <p className="mb-4 text-xs text-amber-700/80">{sermon.passage}</p>

          <div className="space-y-3">
            {STAGES.map((stage, idx) => {
              const isCurrent = idx === currentStageIdx;
              const isPast = idx < currentStageIdx;
              const isFuture = idx > currentStageIdx;

              return (
                <div
                  key={stage.value}
                  className={`relative flex items-start gap-3 rounded-lg p-2.5 text-xs transition-all ${
                    isCurrent
                      ? "bg-amber-50 ring-1 ring-amber-200"
                      : isPast
                        ? "text-stone-400"
                        : "text-stone-300"
                  }`}
                >
                  {/* Stage Number */}
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      isPast
                        ? "bg-emerald-100 text-emerald-700"
                        : isCurrent
                          ? "bg-amber-200 text-amber-800"
                          : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    {isPast ? "✓" : idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium ${
                        isCurrent
                          ? "text-stone-800"
                          : isPast
                            ? "text-stone-500"
                            : "text-stone-300"
                      }`}
                    >
                      {stage.label}
                    </p>
                    <p
                      className={`mt-0.5 leading-relaxed ${
                        isCurrent ? "text-stone-500" : ""
                      }`}
                    >
                      {stage.focus}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Chat Main Area */}
      <main className="flex flex-1 flex-col bg-stone-50">
        <ChatArea
          sermonId={sermon.id}
          initialMessages={sermon.messages.map((m) => ({
            id: m.id,
            role: (m.role === "ASSISTANT" ? "assistant" : "user") as
              | "user"
              | "assistant",
            content: m.content,
            createdAt: m.createdAt.toISOString(),
          }))}
          currentStage={sermon.currentStage}
        />
      </main>
    </div>
  );
}
