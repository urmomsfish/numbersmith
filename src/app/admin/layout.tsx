import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { logoutAction } from "@/lib/actions/auth-actions";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");

  const openDisputeCount = await prisma.problemDispute.count({ where: { status: "OPEN" } });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo href="/admin" />
            <Badge tone="danger">Admin</Badge>
          </div>
          <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
            <Link href="/admin" className="hover:text-slate-900">
              Overview
            </Link>
            <Link href="/admin/problems" className="hover:text-slate-900">
              Problems
            </Link>
            <Link href="/admin/users" className="hover:text-slate-900">
              Users
            </Link>
            <Link href="/admin/disputes" className="flex items-center gap-1.5 hover:text-slate-900">
              Disputes
              {openDisputeCount > 0 && <Badge tone="warning">{openDisputeCount}</Badge>}
            </Link>
            <Link href="/dashboard" className="hover:text-slate-900">
              Student view
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="text-danger-600 hover:text-danger-500">
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
