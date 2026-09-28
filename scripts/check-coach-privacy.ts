/**
 * Asserts that coach mode never exposes a student's personal data.
 *
 *   npm run verify:coach-privacy
 *
 * Coach mode is the only place in NumberSmith where one account reads another
 * account's rows, and the accounts being read mostly belong to children. The
 * thing a coach is entitled to see is progress. Everything else on the User
 * record — email address, password hash, Google subject id — is not theirs.
 *
 * The failure this guards against is not a bug anyone would write on purpose.
 * It is `include: { user: true }`, which is the obvious way to write a roster
 * query, reads naturally in review, type-checks, and hands every student's email
 * and bcrypt hash to whoever holds the class. One word, no error, no symptom.
 *
 * So the rule is inverted: instead of listing what must not leak, the User
 * model's own columns are read out of the schema, the handful a coach may see
 * are subtracted, and the remainder must not appear anywhere in coach source.
 * A PII column added to User in a year's time is therefore covered on the day
 * it is added, without anyone remembering to update this file.
 *
 * Static, and honest about it: this reads source, so it proves the queries do
 * not *ask* for the fields. It cannot prove a page does not render something
 * fetched elsewhere.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { canCreateClasses } from "../src/lib/types";

const ROOT = path.join(__dirname, "..");

/** Files that make up the coach surface — engine, actions, and pages. */
const COACH_FILES = [
  "src/lib/engine/coach.ts",
  "src/lib/actions/coach-actions.ts",
  "src/app/(app)/classes/page.tsx",
  "src/app/(app)/classes/[id]/page.tsx",
  "src/app/(app)/classes/[id]/coach-panels.tsx",
  "src/app/(app)/classes/student-panels.tsx",
];

/**
 * What a coach is allowed to know about a student.
 *
 * `id` so the roster can link rows together, `name` because a roster of
 * anonymous accounts would be useless to the coach and the student chose that
 * display name. Nothing else.
 */
const COACH_MAY_SEE = new Set(["id", "name"]);

/** The scalar columns of the User model, read from the schema so this list can
 * never fall behind it. */
function userModelFields(): string[] {
  const schema = fs.readFileSync(path.join(ROOT, "prisma", "schema.prisma"), "utf8");
  const match = schema.match(/\nmodel User \{([\s\S]*?)\n\}/);
  if (!match) throw new Error("could not find the User model in prisma/schema.prisma");

  const fields: string[] = [];
  for (const raw of match[1].split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("//") || line.startsWith("///") || line.startsWith("@@")) continue;
    const m = line.match(/^(\w+)\s+(\w+)/);
    if (!m) continue;
    const [, name, type] = m;
    // Relations are other models; they carry no PII of their own and are
    // guarded by their own queries.
    if (/^[A-Z]/.test(type) && type !== "String" && type !== "Int" && type !== "Boolean") continue;
    if (type === "DateTime" || type === "String" || type === "Int" || type === "Boolean") {
      fields.push(name);
    }
  }
  return fields;
}

function main() {
  const all = userModelFields();
  const forbidden = all.filter((f) => !COACH_MAY_SEE.has(f));
  console.log(`User has ${all.length} scalar columns; a coach may see ${[...COACH_MAY_SEE].join(", ")}.`);
  console.log(`  must not appear in coach source: ${forbidden.join(", ")}`);

  const problems: string[] = [];
  let scanned = 0;

  for (const rel of COACH_FILES) {
    const file = path.join(ROOT, rel);
    if (!fs.existsSync(file)) {
      problems.push(`${rel}: listed in COACH_FILES but missing — update the list or the route`);
      continue;
    }
    scanned++;
    const text = fs.readFileSync(file, "utf8");
    const lines = text.split("\n");

    lines.forEach((line, i) => {
      const at = `${rel}:${i + 1}`;
      // Strip comments: this file's own prose names the fields it forbids, and
      // so does the engine's documentation.
      let code = line.replace(/\/\/.*$/, "").replace(/\/\*.*?\*\//g, "");
      if (!code.trim() || code.trim().startsWith("*")) return;

      // Reads off the bare `user` identifier are the *caller's own* record —
      // `const user = await requireUser()` — and coach privacy is about other
      // people's data, not the signed-in account's own. Without this, adding a
      // legitimate `canCreateClasses(user.role)` gate tripped the check twice.
      // Only the bare identifier is exempt: `m.user.email` on a roster row is
      // still caught, because the `.` before `user` excludes it here.
      code = code.replace(/(^|[^.\w])user\.(\w+)/g, "$1session_$2");

      for (const field of forbidden) {
        // Matched only where the name is actually reading or selecting a
        // column, not merely appearing as a word.
        //
        // A bare `\bfield\b` was the first attempt and produced three false
        // failures out of four reports: `role="img"` and `role="status"` are
        // ARIA attributes, and the sentence telling students "they can't see
        // your email" contains the word it forbids. A check that cries wolf on
        // its own documentation is a check people switch off, so the patterns
        // below require a position that means field access:
        //
        //   `email: true`   an object key        → caught
        //   `user.email`    property access      → caught
        //   `{ email }`     shorthand in select  → caught
        //   `role="img"`    JSX attribute        → ignored
        //   "…your email,"  prose                → ignored
        const patterns = [
          new RegExp(`\\b${field}\\s*:`),
          new RegExp(`\\.${field}\\b`),
          new RegExp(`\\{[^}]*\\b${field}\\b\\s*[,}]`),
        ];
        if (patterns.some((p) => p.test(code))) {
          problems.push(`${at}: reads User.${field} — a coach may not see it\n      ${line.trim()}`);
        }
      }

      // The bulk read that would defeat the field list entirely.
      if (/\buser:\s*true\b/.test(code) || /\bteacher:\s*true\b/.test(code)) {
        problems.push(`${at}: selects a whole User row — name the fields instead\n      ${line.trim()}`);
      }
      if (/include:\s*\{[^}]*\buser\b[^}]*\}/.test(code) && !/select/.test(code)) {
        problems.push(`${at}: includes the user relation without a select\n      ${line.trim()}`);
      }
    });
  }

  // The allowlist itself must match what the engine actually declares, or the
  // constant and this check could drift apart while both look right.
  const engine = fs.readFileSync(path.join(ROOT, "src/lib/engine/coach.ts"), "utf8");
  const decl = engine.match(/ROSTER_SELECT = \{([^}]*)\}/);
  if (!decl) {
    problems.push("src/lib/engine/coach.ts: ROSTER_SELECT not found");
  } else {
    const declared = new Set(
      [...decl[1].matchAll(/(\w+):\s*true/g)].map((m) => m[1])
    );
    for (const f of declared) {
      if (!COACH_MAY_SEE.has(f)) {
        problems.push(`ROSTER_SELECT declares "${f}", which this check does not allow`);
      }
    }
    for (const f of COACH_MAY_SEE) {
      if (!declared.has(f)) {
        problems.push(`this check allows "${f}" but ROSTER_SELECT does not select it`);
      }
    }
  }

  // ---- who may start a class ----------------------------------------------
  // Creating a class is the step that lets one account see other people's
  // progress, so it is restricted to teachers and admins. Checked here because
  // the failure is silent in both directions: a gate that is too loose lets any
  // student mint join codes, and one that is too tight makes the whole feature
  // unreachable with no error anywhere.
  for (const [role, allowed] of [
    ["TEACHER", true],
    ["ADMIN", true],
    ["STUDENT", false],
    ["PARENT", false],
    ["", false],
    ["teacher", false], // case matters; the column stores upper case
  ] as const) {
    if (canCreateClasses(role) !== allowed) {
      problems.push(`canCreateClasses("${role}") should be ${allowed}`);
    }
  }

  // The gate must live in the action, not only in the page. A Server Action is
  // a public endpoint, so a hidden button is decoration.
  const actions = fs.readFileSync(path.join(ROOT, "src/lib/actions/coach-actions.ts"), "utf8");
  const create = actions.slice(actions.indexOf("export async function createClassAction"));
  const body = create.slice(0, create.indexOf("\n}"));
  if (!/canCreateClasses\(\s*user\.role\s*\)/.test(body)) {
    problems.push("createClassAction does not check canCreateClasses(user.role)");
  }

  console.log(`\nScanned ${scanned} coach-surface files.`);
  if (problems.length === 0) {
    console.log("✓ coach mode reads nothing about a student beyond id and name,");
    console.log("  and only teachers and admins can start a class");
    return;
  }
  console.log(`✗ ${problems.length} privacy problem(s):\n`);
  for (const p of problems) console.log(`    ${p}`);
  process.exitCode = 1;
}

main();
