/**
 * Grants every existing account the launch offer: Pro, for life.
 *
 * New signups get this from `signupSubscription`. This is the other half —
 * the people who already had an account before the offer existed. The promise
 * as written is "every account that exists by Halloween", and an account
 * created in September plainly qualifies, so excluding them would be a
 * narrower offer than the one the signup form advertises.
 *
 * The grant is `status: PRO, plan: null, renewalDate: null`. A null
 * valid-through is how `grantsProAccess` recognises an open-ended comp, which
 * is the same shape the admin grant and the seed already use — no new concept,
 * and nothing for `getSubscription` to lapse.
 *
 * Deliberately NOT idempotent-by-overwrite: an account that already holds a
 * paid Stripe subscription is left exactly as it is. Overwriting a real
 * subscriber with a comp would detach them from their own billing record,
 * and "they got it for free anyway" is not worth corrupting a payment row.
 * There are none today; the guard is for the day there are.
 *
 *   npx tsx scripts/grant-launch-lifetime.ts [--write]
 */
import { PrismaClient } from "../src/generated/prisma";

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
          renewalDate: true,
          externalSubscriptionId: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const skippedPaying: string[] = [];
  const alreadyLifetime: string[] = [];
  const toGrant: typeof users = [];

  for (const u of users) {
    const sub = u.subscription;
    if (sub?.externalSubscriptionId) {
      skippedPaying.push(u.email);
      continue;
    }
    if (sub?.status === "PRO" && sub.renewalDate === null) {
      alreadyLifetime.push(u.email);
      continue;
    }
    toGrant.push(u);
  }

  console.log(`accounts:                  ${users.length}`);
  console.log(`already lifetime Pro:      ${alreadyLifetime.length}`);
  console.log(`skipped (real subscriber): ${skippedPaying.length}`);
  console.log(`to grant:                  ${toGrant.length}`);
  for (const u of toGrant.slice(0, 10)) {
    const s = u.subscription;
    console.log(
      `  ${u.email.padEnd(34)} ${String(s?.status ?? "none").padEnd(9)} -> PRO (no end date)`
    );
  }
  if (toGrant.length > 10) console.log(`  …and ${toGrant.length - 10} more.`);

  if (!write) {
    console.log("\nDry run. Re-run with --write to apply.");
    return;
  }

  const now = new Date();
  let done = 0;
  for (const u of toGrant) {
    await prisma.subscription.upsert({
      where: { userId: u.id },
      update: { status: "PRO", plan: null, startDate: now, renewalDate: null, canceledAt: null },
      create: { userId: u.id, status: "PRO", plan: null, startDate: now, renewalDate: null },
    });
    done++;
  }
  console.log(`\nGranted lifetime Pro to ${done} accounts.`);
}

main().finally(() => prisma.$disconnect());
