/**
 * Gives every existing account free Pro until 2027.
 *
 * New signups get this from `signupSubscription`. This is the other half — the
 * people who already have an account, including everyone who joined after the
 * Halloween offer closed on 1 November and has been sitting on a Free row
 * since. "NumberSmith is free until 2027" is said on the signup form and the
 * pricing page without qualification, so it has to be true of them too.
 *
 * Nobody loses anything. `decideFreeAccess` refuses three kinds of row:
 *
 *   paying   — attached to a real Stripe subscription. Overwriting it with a
 *              comp would detach the user from their own billing record, and
 *              "they get it free anyway" is not worth corrupting a payment
 *              row. There are none today; the guard is for the day there are.
 *   lifetime — open-ended Pro, which is the Halloween launch grant and the
 *              admin comp. Stamping 1 January 2027 onto those would quietly
 *              revoke a promise made in the words "for life".
 *   longer   — already paid up past 1 January 2027.
 *
 * Re-running is safe: a row granted by a previous run comes back as "longer"
 * (its renewalDate already equals the cutoff), so nothing is rewritten.
 *
 *   npx tsx scripts/grant-free-access.ts [--write]
 */
import { PrismaClient } from "../src/generated/prisma";
import { FREE_UNTIL, FREE_UNTIL_EXACT, decideFreeAccess } from "../src/lib/free-access";

const prisma = new PrismaClient();

async function main() {
  const write = process.argv.includes("--write");

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      createdAt: true,
      subscription: {
        select: {
          status: true,
          plan: true,
          // renewalDate alone is not enough: a CANCELED row can be governed
          // by canceledAt and a legacy TRIAL row by trialEndsAt. See
          // accessValidThrough.
          renewalDate: true,
          trialEndsAt: true,
          canceledAt: true,
          externalSubscriptionId: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const buckets = { grant: [], paying: [], lifetime: [], longer: [] } as Record<
    string,
    typeof users
  >;
  for (const u of users) buckets[decideFreeAccess(u.subscription)].push(u);

  console.log(`Free access through ${FREE_UNTIL_EXACT} (${FREE_UNTIL.toISOString()})\n`);
  console.log(`accounts:                      ${users.length}`);
  console.log(`already lifetime Pro (kept):   ${buckets.lifetime.length}`);
  console.log(`already valid past the date:   ${buckets.longer.length}`);
  console.log(`skipped (real subscriber):     ${buckets.paying.length}`);
  console.log(`to grant:                      ${buckets.grant.length}`);

  for (const u of buckets.grant.slice(0, 10)) {
    const s = u.subscription;
    console.log(
      `  ${u.email.padEnd(34)} ${String(s?.status ?? "none").padEnd(9)} -> PRO until ${FREE_UNTIL_EXACT}`,
    );
  }
  if (buckets.grant.length > 10) console.log(`  …and ${buckets.grant.length - 10} more.`);

  if (!write) {
    console.log("\nDry run. Re-run with --write to apply.");
    return;
  }

  const now = new Date();
  let done = 0;
  for (const u of buckets.grant) {
    await prisma.subscription.upsert({
      where: { userId: u.id },
      update: {
        status: "PRO",
        plan: null,
        startDate: now,
        renewalDate: FREE_UNTIL,
        canceledAt: null,
      },
      create: {
        userId: u.id,
        status: "PRO",
        plan: null,
        startDate: now,
        renewalDate: FREE_UNTIL,
      },
    });
    done++;
  }
  console.log(`\nGranted free Pro until ${FREE_UNTIL_EXACT} to ${done} accounts.`);
}

main().finally(() => prisma.$disconnect());
