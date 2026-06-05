"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSermon } from "@/app/_lib/actions/sermons";

export function CreateSermonButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await createSermon(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success && result.id) {
      router.push(`/sermons/${result.id}`);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        新建讲道
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/30 p-4">
          <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white p-6 shadow-xl">
            <h2 className="mb-4 font-serif text-lg font-bold text-stone-800">
              新建讲道
            </h2>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form action={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-stone-700">
                  讲道标题
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
                  placeholder="如：在基督里的新生命"
                />
              </div>

              <div>
                <label htmlFor="passage" className="block text-sm font-medium text-stone-700">
                  经文
                </label>
                <input
                  id="passage"
                  name="passage"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
                  placeholder="如：罗马书 8:1-11"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-stone-700">
                  备注（可选）
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={2}
                  className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
                  placeholder="讲道目标或想法…"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "创建中…" : "开始预备"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
