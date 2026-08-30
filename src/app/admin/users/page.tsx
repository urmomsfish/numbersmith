import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateUserAction } from "@/lib/actions/admin-actions";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  const users = await prisma.user.findMany({
    include: {
      subscription: true,
      stats: true,
      profile: true,
      ratings: { where: { category: "OVERALL" } },
      _count: { select: { attempts: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
      <p className="mt-1 text-sm text-slate-500">{users.length} accounts.</p>

      {params.error === "cannot-demote-self" && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-danger-600">
          You cannot remove your own admin role.
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-4 py-2.5">User</th>
              <th className="px-3 py-2.5">Grade</th>
              <th className="px-3 py-2.5">Rating</th>
              <th className="px-3 py-2.5">Attempts</th>
              <th className="px-3 py-2.5">Streak</th>
              <th className="px-3 py-2.5">Plan</th>
              <th className="px-3 py-2.5">Manage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-2.5">
                  <p className="font-medium text-slate-800">{u.name}</p>
                  <p className="text-[11px] text-slate-400">{u.email}</p>
                </td>
                <td className="px-3 py-2.5 text-slate-600">{u.profile?.grade ?? "—"}</td>
                <td className="px-3 py-2.5 text-slate-600">{u.ratings[0]?.value ?? "—"}</td>
                <td className="px-3 py-2.5 text-slate-600">{u._count.attempts}</td>
                <td className="px-3 py-2.5 text-slate-600">{u.stats?.currentStreak ?? 0}d</td>
                <td className="px-3 py-2.5">
                  <Badge
                    tone={
                      u.subscription?.status === "PRO" || u.subscription?.status === "TRIAL"
                        ? "brand"
                        : "slate"
                    }
                  >
                    {u.subscription?.status ?? "FREE"}
                  </Badge>
                </td>
                <td className="px-3 py-2.5">
                  <form action={updateUserAction} className="flex items-center gap-1.5">
                    <input type="hidden" name="userId" value={u.id} />
                    <select
                      name="role"
                      defaultValue={u.role}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs"
                    >
                      {["STUDENT", "PARENT", "TEACHER", "ADMIN"].map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <select
                      name="subscriptionStatus"
                      defaultValue={u.subscription?.status ?? "FREE"}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs"
                    >
                      {["FREE", "PRO", "TRIAL", "CANCELED"].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <Button type="submit" size="sm" variant="outline">
                      Save
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
