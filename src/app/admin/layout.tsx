import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { logoutAction } from "@/lib/actions/auth-actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo href="/admin" />
            <Badge tone="danger">Admin</Badge>
          </div>
          <nav className="flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link href="/admin" className="hover:text-slate-900 dark:hover:text-slate-100">
              Overview
            </Link>
            <Link href="/admin/problems" className="hover:text-slate-900 dark:hover:text-slate-100">
              Problems
            </Link>
            <Link href="/admin/users" className="hover:text-slate-900 dark:hover:text-slate-100">
              Users
            </Link>
            <Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-100">
              Student view
            </Link>
            <ThemeToggle />
            <form action={logoutAction}>
              <button type="submit" className="text-danger-600 hover:text-danger-500 dark:text-red-400 dark:hover:text-red-300">
                Log out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
