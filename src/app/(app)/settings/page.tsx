import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { getSubscription, grantsProAccess, isCancelPending } from "@/lib/subscription";
import { cancelSubscriptionAction, startProTrialAction } from "@/lib/actions/subscription-actions";
import { updateProfileAction } from "@/lib/actions/settings-actions";
import { AccentPicker } from "@/components/accent-picker";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [profile, subscription, userCompetitions] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: user.id } }),
    getSubscription(user.id),
    prisma.userCompetition.findMany({
      where: { userId: user.id },
      include: { competition: true },
      orderBy: { isPrimary: "desc" },
    }),
  ]);

  // getSubscription has already lapsed anything expired, so a surviving
  // CANCELED row is still inside its paid period and keeps Pro.
  const isPro = grantsProAccess(subscription);
  const cancelPending = isCancelPending(subscription);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Settings</h1>

      <Card className="mt-6">
        <CardBody>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Account</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Name</dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">{user.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Email</dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Role</dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">{user.role}</dd>
            </div>
          </dl>
        </CardBody>
      </Card>

      <Card className="mt-5">
        <CardBody>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Appearance
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Pick an accent colour. It themes buttons, links, and highlights, and gently tints the
            background — in both light and dark mode. Saved on this device.
          </p>
          <AccentPicker className="mt-4" />
          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
            Use the sun/moon button in the top bar to switch between light and dark.
          </p>
        </CardBody>
      </Card>

      <Card className="mt-5">
        <CardBody>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Subscription</h2>
            <Badge tone={cancelPending ? "warning" : isPro ? "brand" : "slate"}>
              {cancelPending
                ? "⭐ Pro — ending"
                : subscription.status === "TRIAL"
                  ? "⭐ Pro Trial"
                  : isPro
                    ? "⭐ NumberSmith Pro"
                    : "🆓 NumberSmith Free"}
            </Badge>
          </div>

          {subscription.status === "TRIAL" && subscription.trialEndsAt && (
            <p className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-950 px-3 py-2 text-sm text-amber-800 dark:text-amber-400">
              Your free Pro trial ends on {subscription.trialEndsAt.toLocaleDateString()}. You will not
              be charged — the account simply returns to the Free plan unless you choose to subscribe.
            </p>
          )}

          {cancelPending && subscription.renewalDate && (
            <p className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-950 px-3 py-2 text-sm text-amber-800 dark:text-amber-400">
              Your subscription is cancelled and will not renew. You keep full Pro access until{" "}
              {subscription.renewalDate.toLocaleDateString()}, the end of the period you already
              paid for.
            </p>
          )}

          {(subscription.status === "PRO" || cancelPending) && (
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Plan</dt>
                <dd className="font-medium text-slate-800 dark:text-slate-100">{subscription.plan ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">{cancelPending ? "Access ends" : "Renews"}</dt>
                <dd className="font-medium text-slate-800 dark:text-slate-100">
                  {subscription.renewalDate?.toLocaleDateString() ?? "—"}
                </dd>
              </div>
            </dl>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {!isPro && (
              <>
                <LinkButton href="/pricing">Upgrade to Pro</LinkButton>
                {subscription.status === "FREE" && !subscription.trialEndsAt && (
                  <form action={startProTrialAction}>
                    <Button type="submit" variant="outline">
                      Start 7-Day Free Trial
                    </Button>
                  </form>
                )}
              </>
            )}
            {cancelPending && <LinkButton href="/pricing">Resubscribe</LinkButton>}
            {isPro && !cancelPending && (
              <form action={cancelSubscriptionAction}>
                <Button type="submit" variant="outline">
                  Cancel Subscription
                </Button>
              </form>
            )}
          </div>
        </CardBody>
      </Card>

      <Card className="mt-5">
        <CardBody>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              My Competitions
            </h2>
            <Link
              href="/settings/competitions"
              className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
            >
              Edit →
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {userCompetitions.length === 0 && (
              <p className="text-sm text-slate-400 dark:text-slate-500">No competitions selected yet.</p>
            )}
            {userCompetitions.map((uc) => (
              <Badge key={uc.id} tone={uc.isPrimary ? "brand" : "slate"}>
                {uc.competition.shortName}
                {uc.isPrimary && " · Primary"}
              </Badge>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card className="mt-5">
        <CardBody>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Training Preferences
          </h2>
          <form action={updateProfileAction} className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Grade</span>
              <select
                name="grade"
                defaultValue={String(profile?.grade ?? 7)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
              >
                <option value="0">Kindergarten</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Practice per day
              </span>
              <select
                name="dailyPracticeMinutes"
                defaultValue={String(profile?.dailyPracticeMinutes ?? 30)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
              >
                {[15, 20, 30, 45, 60].map((m) => (
                  <option key={m} value={m}>
                    {m} minutes
                  </option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Target score</span>
              <input
                type="text"
                name="targetScore"
                defaultValue={profile?.targetScore ?? ""}
                placeholder="e.g. Qualify for AIME"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
              />
            </label>
            <div className="sm:col-span-2">
              <Button type="submit">Save Preferences</Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card className="mt-5">
        <CardBody>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Placement Test
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Retaking the placement test recalibrates your rating, skill breakdown, and training plan.
            The placement test is always free.
          </p>
          <LinkButton href="/placement-test" variant="outline" className="mt-4">
            Retake Placement Test
          </LinkButton>
        </CardBody>
      </Card>
    </div>
  );
}
