/**
 * Checks the "free until 2027" offer.
 *
 * Two things are worth proving rather than eyeballing.
 *
 * The deadline is a *Pacific* midnight, computed through the same
 * `streakDayStart` the streak and the daily challenge use. A date constant
 * written by hand in UTC would be eight hours out, which is invisible in
 * testing and very visible to whoever loses access early on New Year's Eve.
 *
 * And `decideFreeAccess` must never shorten anyone's access. The destructive
 * version of this script — write `renewalDate: FREE_UNTIL` to every row — is
 * one line shorter and would silently put an expiry on the lifetime grants
 * promised at Halloween. Every case is enumerated here.
 *
 *   npm run verify:free-access
 */
import {
  FREE_ACCESS_GRANT,
  FREE_UNTIL,
  FREE_UNTIL_EXACT,
  FREE_UNTIL_LABEL,
  decideFreeAccess,
  freeAccessDaysLeft,
  freeAccessIsOpen,
  signupSubscription,
} from "../src/lib/free-access";
import { grantsProAccess, type EntitlementFacts } from "../src/lib/subscription-rules";
import { streakDayStart } from "../src/lib/streak";

let failures = 0;
let checks = 0;

function ok(label: string, condition: boolean, detail?: string) {
  checks++;
  if (!condition) {
    failures++;
    console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
  }
}
function eq(label: string, actual: unknown, expected: unknown) {
  ok(label, actual === expected, `got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`);
}

console.log("Free until 2027\n");

// ---------------------------------------------------------------------------
// The deadline
// ---------------------------------------------------------------------------

{
  // Midnight Pacific on 1 January 2027 is 08:00 UTC — PST, eight hours behind,
  // with no DST transition anywhere near New Year.
  eq("the deadline is 2027-01-01T08:00:00Z", FREE_UNTIL.toISOString(), "2027-01-01T08:00:00.000Z");
  ok("it is not a UTC midnight", FREE_UNTIL.getTime() !== Date.UTC(2027, 0, 1));
  eq(
    "it agrees with streakDayStart for that day",
    FREE_UNTIL.getTime(),
    streakDayStart(new Date(Date.UTC(2027, 0, 1, 12))).getTime(),
  );

  // The boundary itself: open one millisecond before, shut on the instant.
  const just = new Date(FREE_UNTIL.getTime() - 1);
  eq("open a millisecond before the deadline", freeAccessIsOpen(just), true);
  eq("shut on the deadline", freeAccessIsOpen(FREE_UNTIL), false);
  eq("shut after it", freeAccessIsOpen(new Date(FREE_UNTIL.getTime() + 1)), false);

  // Last Pacific evening of 2026 — the hours most likely to be got wrong.
  eq(
    "23:59 Pacific on 31 December is still open",
    freeAccessIsOpen(new Date(Date.UTC(2027, 0, 1, 7, 59))),
    true,
  );
  eq(
    "00:01 Pacific on 1 January is closed",
    freeAccessIsOpen(new Date(Date.UTC(2027, 0, 1, 8, 1))),
    false,
  );

  // The countdown.
  eq("no days left once it has passed", freeAccessDaysLeft(FREE_UNTIL), 0);
  eq("never negative", freeAccessDaysLeft(new Date(Date.UTC(2030, 0, 1))), 0);
  eq(
    "one day left on the final day",
    freeAccessDaysLeft(new Date(FREE_UNTIL.getTime() - 60 * 60 * 1000)),
    1,
  );
  ok(
    "the offer is open today",
    freeAccessIsOpen(),
    "if this fails the date has passed and the copy is lying",
  );
}

// ---------------------------------------------------------------------------
// What a new signup gets
// ---------------------------------------------------------------------------

{
  const during = signupSubscription(new Date(Date.UTC(2026, 11, 1)));
  eq("a signup during the offer gets Pro", during.status, "PRO");
  eq("with no plan label", during.plan, null);
  eq("valid through the deadline", during.renewalDate?.getTime(), FREE_UNTIL.getTime());
  ok("and a start date", during.startDate instanceof Date);

  const after = signupSubscription(new Date(Date.UTC(2027, 5, 1)));
  eq("a signup after it gets Free", after.status, "FREE");
  eq("with nothing else attached", after.renewalDate, undefined);

  // The grant must actually read as Pro through the subscription layer, and
  // must stop on its own afterwards — that is the whole mechanism.
  const row = (over: Partial<EntitlementFacts> = {}): EntitlementFacts => ({
    status: "PRO",
    renewalDate: FREE_UNTIL,
    trialEndsAt: null,
    canceledAt: null,
    ...over,
  });

  eq("the granted row grants Pro today", grantsProAccess(row()), true);
  eq(
    "it stops granting Pro once the date passes",
    grantsProAccess(row({ renewalDate: new Date(Date.now() - 1000) })),
    false,
  );
  eq(
    "it stops granting Pro the instant the deadline arrives",
    grantsProAccess(row(), FREE_UNTIL),
    false,
  );
  eq(
    "it still grants Pro a millisecond before",
    grantsProAccess(row(), new Date(FREE_UNTIL.getTime() - 1)),
    true,
  );
  eq("FREE_ACCESS_GRANT is PRO", FREE_ACCESS_GRANT.status, "PRO");
  eq("FREE_ACCESS_GRANT carries the deadline", FREE_ACCESS_GRANT.renewalDate, FREE_UNTIL);
  eq("FREE_ACCESS_GRANT has no plan", FREE_ACCESS_GRANT.plan, null);
}

// ---------------------------------------------------------------------------
// Granting it to accounts that already exist
// ---------------------------------------------------------------------------

{
  const before = new Date(FREE_UNTIL.getTime() - 86400000);
  const after = new Date(FREE_UNTIL.getTime() + 86400000);

  eq("no subscription row at all", decideFreeAccess(null), "grant");
  eq(
    "a Free row",
    decideFreeAccess({ status: "FREE", renewalDate: null }),
    "grant",
  );
  eq(
    "a Pro row that lapses before the date",
    decideFreeAccess({ status: "PRO", renewalDate: before }),
    "grant",
  );
  eq(
    "a cancelled row",
    decideFreeAccess({ status: "CANCELED", renewalDate: before }),
    "grant",
  );

  // The three refusals.
  eq(
    "a real Stripe subscriber is never touched",
    decideFreeAccess({ status: "PRO", renewalDate: before, externalSubscriptionId: "sub_123" }),
    "paying",
  );
  eq(
    "a Halloween lifetime grant keeps its open end",
    decideFreeAccess({ status: "PRO", renewalDate: null }),
    "lifetime",
  );
  eq(
    "an account paid up past the date is left alone",
    decideFreeAccess({ status: "PRO", renewalDate: after }),
    "longer",
  );
  eq(
    "a row already granted by this script is not rewritten",
    decideFreeAccess({ status: "PRO", renewalDate: FREE_UNTIL }),
    "longer",
  );

  // Paying outranks everything, including a lifetime-looking row.
  eq(
    "paying outranks lifetime",
    decideFreeAccess({ status: "PRO", renewalDate: null, externalSubscriptionId: "sub_9" }),
    "paying",
  );

  // Rows the other statuses govern through a different column. These are the
  // cases a renewalDate-only check gets wrong, so they are named explicitly
  // rather than left to the sweep below.
  eq(
    "a cancelled account paid up past the date keeps its period",
    decideFreeAccess({ status: "CANCELED", renewalDate: after }),
    "longer",
  );
  eq(
    "a cancelled account with no period left is granted",
    decideFreeAccess({ status: "CANCELED", renewalDate: null, canceledAt: before }),
    "grant",
  );
  eq(
    "a legacy trial running past the date is left alone",
    decideFreeAccess({ status: "TRIAL", renewalDate: null, trialEndsAt: after }),
    "longer",
  );
  eq(
    "an expired legacy trial is granted",
    decideFreeAccess({ status: "TRIAL", renewalDate: null, trialEndsAt: before }),
    "grant",
  );

  // THE INVARIANT: applying the decision must never reduce anyone's access.
  //
  // Swept over every shape a stored row can take, against a reach model
  // written out by hand here rather than imported — the point is to disagree
  // with the implementation if the implementation is wrong, which it cannot
  // do if it calls the same function.
  const statuses = ["FREE", "PRO", "CANCELED", "TRIAL"];
  const dates: (Date | null)[] = [null, before, FREE_UNTIL, after, new Date(0)];
  const stripes: (string | null)[] = [null, "sub_abc"];
  const INF = Number.POSITIVE_INFINITY;

  let shortened = 0;
  let cases = 0;
  for (const status of statuses) {
    for (const renewalDate of dates) {
      for (const trialEndsAt of dates) {
        for (const canceledAt of dates) {
          for (const externalSubscriptionId of stripes) {
            cases++;
            const sub = { status, renewalDate, trialEndsAt, canceledAt, externalSubscriptionId };
            if (decideFreeAccess(sub) !== "grant") continue;

            // How far the old row reached, per status. Null means forever.
            const reach =
              status === "FREE"
                ? 0
                : status === "PRO"
                  ? (renewalDate?.getTime() ?? INF)
                  : status === "TRIAL"
                    ? (trialEndsAt?.getTime() ?? INF)
                    : (renewalDate?.getTime() ?? canceledAt?.getTime() ?? INF);

            // Granting replaces the row with PRO-until-FREE_UNTIL, which is
            // only allowed when the old row did not already reach further.
            if (reach > FREE_UNTIL.getTime()) shortened++;
          }
        }
      }
    }
  }
  eq("granting never shortens an existing entitlement", shortened, 0);
  eq("every row shape was considered", cases, 4 * 5 * 5 * 5 * 2);
}

// ---------------------------------------------------------------------------
// Copy
// ---------------------------------------------------------------------------

{
  // The strings are rendered on the signup form and the pricing page, so a
  // mismatch between them and the actual date is a promise the code breaks.
  eq("the exact label names the deadline", FREE_UNTIL_EXACT, "1 January 2027");
  eq("the short label is the year", FREE_UNTIL_LABEL, "2027");
  ok(
    "the exact label matches the computed date",
    FREE_UNTIL.toISOString().startsWith("2027-01-01"),
  );
}

console.log("");
if (failures > 0) {
  console.error(`${failures} of ${checks} checks failed.`);
  process.exit(1);
}
console.log(`All ${checks} checks passed.`);
