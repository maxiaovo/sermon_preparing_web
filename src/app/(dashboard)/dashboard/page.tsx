import { getUserSermons } from "@/app/_lib/data/sermons";
import { CreateSermonButton } from "@/app/_components/sermon/CreateSermonButton";
import Link from "next/link";

export default async function DashboardPage() {
  const sermons = await getUserSermons();

  const stageLabels: Record<string, string> = {
    PREPARATION: "预备心",
    EXEGESIS: "释经",
    THEOLOGICAL: "神学反思",
    APPLICATION: "应用",
    STRUCTURE: "结构",
    DELIVERY: "讲道呈现",
  };

  const statusLabels: Record<string, string> = {
    DRAFT: "草稿",
    IN_PROGRESS: "进行中",
    COMPLETED: "已完成",
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-800">
            我的讲道
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            管理你的讲道预备项目
          </p>
        </div>
        <CreateSermonButton />
      </div>

      {sermons.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
            <svg className="h-8 w-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h2 className="mt-4 font-serif text-lg font-semibold text-stone-600">
            还没有讲道项目
          </h2>
          <p className="mt-2 max-w-sm text-center text-sm text-stone-400">
            创建你的第一篇讲道，开始与 AI 教练对话
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sermons.map((sermon) => (
            <Link key={sermon.id} href={`/sermons/${sermon.id}`}>
              <div className="group rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-all hover:border-amber-300 hover:shadow-md">
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="font-serif font-semibold text-stone-800 group-hover:text-stone-900">
                    {sermon.title}
                  </h3>
                  {sermon.status === "COMPLETED" && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      ✓
                    </span>
                  )}
                </div>

                <p className="mb-3 text-sm text-amber-700/80 font-medium">
                  {sermon.passage}
                </p>

                {sermon.description && (
                  <p className="mb-3 line-clamp-2 text-xs text-stone-400">
                    {sermon.description}
                  </p>
                )}

                <div className="flex items-center gap-3 border-t border-stone-50 pt-3 text-xs text-stone-400">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    {stageLabels[sermon.currentStage] ?? sermon.currentStage}
                  </span>
                  <span>{statusLabels[sermon.status] ?? sermon.status}</span>
                  <span className="ml-auto">
                    {sermon._count.messages} 条消息
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
