import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <main className="flex max-w-2xl flex-col items-center gap-8 text-center">
        <div className="space-y-4">
          <p className="font-serif text-5xl font-bold tracking-tight text-stone-800 sm:text-6xl">
            小故事讲道预备
          </p>
          <p className="text-lg text-stone-500 leading-relaxed">
            通过智慧的提问引导你深入思考神的话语
            <br />
            不是替你预备讲道，而是陪你一起思想
          </p>
        </div>

        <div className="flex gap-4 mt-4">
          <Link
            href="/login"
            className="rounded-lg bg-stone-800 px-6 py-2.5 text-sm font-medium text-white hover:bg-stone-700 transition-colors"
          >
            登录
          </Link>
          <Link
            href="/register"
            className="rounded-lg border border-stone-300 px-6 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors"
          >
            注册
          </Link>
        </div>

        <p className="text-xs text-stone-400 mt-12">
          因为你们立志行事都是神在你们心里运行，为要成就他的美意。— 腓立比书 2:13
        </p>
      </main>
    </div>
  );
}
