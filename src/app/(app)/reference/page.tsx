import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isProUser } from "@/lib/subscription";
import { Badge } from "@/components/ui/badge";
import { referenceEntryCount } from "@/lib/reference";
import { ReferenceBrowser } from "./reference-browser";

/**
 * The reference sheet — every formula, theorem and identity worth knowing,
 * searchable.
 *
 * Pro, and redirected rather than teased: a cheat sheet half-shown is no use
 * to anybody, and a locked preview of the formula you actually need is a worse
 * experience than a clean "this is Pro". The `from` parameter lets /pricing
 * say which feature sent them.
 */
export default async function ReferencePage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!(await isProUser(user.id))) redirect("/pricing?from=reference");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Reference</h1>
        <Badge tone="brand">Pro</Badge>
      </div>
      <p className="mb-5 text-sm text-slate-600 dark:text-slate-300">
        {referenceEntryCount()} results worth knowing cold — formulas, theorems and identities,
        with the conditions they actually need. Search it mid-problem.
      </p>

      <ReferenceBrowser />

      <p className="mt-10 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
        Knowing a formula is not the same as knowing when it applies, which is why each entry says
        what it is for. If you find yourself looking one up repeatedly, that topic is worth a
        practice session rather than another glance at this page.
      </p>
    </div>
  );
}
