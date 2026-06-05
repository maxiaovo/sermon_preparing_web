import { auth } from "@/app/_lib/auth";
import { logoutUser } from "@/app/_lib/actions/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r border-stone-200 bg-white">
        <div className="flex h-14 items-center border-b border-stone-100 px-5">
          <Link href="/dashboard" className="font-serif text-lg font-bold text-stone-800">
            SermonPrep
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            我的讲道
          </Link>
        </nav>

        <div className="border-t border-stone-100 p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800">
              {session.user.name?.charAt(0) ?? session.user.email?.charAt(0) ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-stone-700">
                {session.user.name ?? "用户"}
              </p>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await logoutUser();
              redirect("/login");
            }}
          >
            <button className="mt-1 w-full rounded-lg px-3 py-1.5 text-left text-xs text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors">
              退出登录
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-stone-50">{children}</main>
    </div>
  );
}
