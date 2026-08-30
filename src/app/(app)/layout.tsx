import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { isProUser } from "@/lib/subscription";
import { paymentsAreLive } from "@/lib/stripe";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN" && user.onboardingStep !== "DONE") redirect("/onboarding");

  const [stats, rating, isPro] = await Promise.all([
    prisma.userStats.findUnique({ where: { userId: user.id } }),
    prisma.rating.findUnique({ where: { userId_category: { userId: user.id, category: "OVERALL" } } }),
    isProUser(user.id),
  ]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isAdmin={user.role === "ADMIN"} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          name={user.name}
          email={user.email}
          streak={stats?.currentStreak ?? 0}
          xp={stats?.totalXp ?? 0}
          rating={rating?.value ?? 1000}
          isPro={isPro}
          canBuy={paymentsAreLive()}
        />
        <div className="flex-1 overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
}
