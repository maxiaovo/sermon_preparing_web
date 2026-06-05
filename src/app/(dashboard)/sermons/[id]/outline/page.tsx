import { getSermon } from "@/app/_lib/data/sermons";
import { STAGES } from "@/app/_lib/coaching/stages";
import { redirect } from "next/navigation";
import { OutlineContent } from "@/app/_components/sermon/OutlineContent";

export default async function OutlinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sermon = await getSermon(id);

  if (!sermon) redirect("/dashboard");

  // Group user messages by stage
  const stageGroups = STAGES.map((stage) => {
    const userMessages = sermon.messages
      .filter(
        (m) => m.role === "USER" && m.stage === stage.value,
      )
      .map((m) => m.content);

    return {
      stage,
      messages: userMessages,
    };
  }).filter((g) => g.messages.length > 0);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <a
            href={`/sermons/${sermon.id}`}
            className="mb-2 inline-flex items-center gap-1 text-sm text-stone-400 hover:text-stone-600 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            返回工作区
          </a>
          <h1 className="font-serif text-2xl font-bold text-stone-800">
            {sermon.title}
          </h1>
          <p className="mt-1 text-sm text-amber-700/80">{sermon.passage}</p>
        </div>
      </div>

      {stageGroups.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
            <svg className="h-7 w-7 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h2 className="mt-4 font-serif font-semibold text-stone-500">
            还没有内容
          </h2>
          <p className="mt-2 text-sm text-stone-400">
            与 AI 教练对话后，你的反思会按阶段整理在这里
          </p>
        </div>
      ) : (
        <>
          <OutlineContent stageGroups={stageGroups} />
        </>
      )}
    </div>
  );
}
