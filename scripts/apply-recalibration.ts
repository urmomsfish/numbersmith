/**
 * Writes the recalibrated difficulties into the seed data.
 *
 * The seed files are the source of truth, not the database: `db:sync-problems`
 * rewrites every row from them, so updating Postgres alone would hold until
 * the next sync and then silently revert. This edits the files; the sync is a
 * separate, ordinary step afterwards.
 *
 * Editing TypeScript literals with a regex is usually a bad idea. It is
 * defensible here because the shape is extremely regular — each problem is an
 * object literal with a unique `slug` and exactly one `difficulty` — and
 * because the alternative, a full TS codemod, would be far more machinery than
 * a one-off relabelling deserves. The guards below exist so that any entry
 * that does not fit that shape is reported and skipped rather than mangled:
 *
 *   - the difficulty must be found before the next `slug:` in the file, so a
 *     match can never leak into the following problem
 *   - a slug appearing in more than one file, or more than once in a file, is
 *     an error rather than a coin flip
 *   - every slug in the report must be accounted for at the end
 *
 *   npx tsx scripts/apply-recalibration.ts [--write]
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SEED_DIR = "prisma/seed-data";
const REPORT = "scratch/recalibration.json";

type Verdict = {
  slug: string;
  currentDifficulty: number;
  calibratedDifficulty: number;
  action: string;
};

function main() {
  const write = process.argv.includes("--write");

  const raw = JSON.parse(readFileSync(REPORT, "utf8")) as Record<string, Verdict | unknown>;
  delete (raw as Record<string, unknown>).__meta__;
  const verdicts = Object.values(raw) as Verdict[];
  const wanted = new Map(verdicts.map((v) => [v.slug, v]));

  const files = readdirSync(SEED_DIR).filter((f) => f.startsWith("problems") && f.endsWith(".ts"));

  const seen = new Map<string, string>(); // slug -> file it was found in
  let changed = 0;
  let alreadyRight = 0;
  const malformed: string[] = [];

  for (const file of files) {
    const path = join(SEED_DIR, file);
    let src = readFileSync(path, "utf8");
    let fileChanged = 0;

    for (const [slug, v] of wanted) {
      const slugRe = new RegExp(`slug:\\s*"${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`, "g");
      const hits = [...src.matchAll(slugRe)];
      if (hits.length === 0) continue;
      if (hits.length > 1) {
        malformed.push(`${slug}: appears ${hits.length}× in ${file}`);
        continue;
      }
      if (seen.has(slug)) {
        malformed.push(`${slug}: also in ${seen.get(slug)}, now ${file}`);
        continue;
      }
      seen.set(slug, file);

      const start = hits[0].index!;
      // The entry ends where the next one begins; everything searched for
      // below must lie inside that window.
      const nextSlug = src.indexOf('slug: "', start + 1);
      const end = nextSlug === -1 ? src.length : nextSlug;
      const block = src.slice(start, end);

      const diffRe = /(\n\s*difficulty:\s*)(\d+)/;
      const m = diffRe.exec(block);
      if (!m) {
        malformed.push(`${slug}: no difficulty field inside its entry`);
        continue;
      }
      const current = Number(m[2]);
      if (current !== v.currentDifficulty) {
        // The file has moved since the report was produced. Re-score rather
        // than overwrite a value this run cannot vouch for.
        malformed.push(
          `${slug}: file says ${current}, report scored ${v.currentDifficulty} — stale, skipped`
        );
        continue;
      }
      if (current === v.calibratedDifficulty) {
        alreadyRight++;
        continue;
      }

      const patched = block.replace(diffRe, `$1${v.calibratedDifficulty}`);
      src = src.slice(0, start) + patched + src.slice(end);
      changed++;
      fileChanged++;
    }

    if (fileChanged && write) writeFileSync(path, src);
    if (fileChanged) console.log(`  ${file.padEnd(32)} ${fileChanged} relabelled`);
  }

  const missing = [...wanted.keys()].filter((s) => !seen.has(s));

  console.log(`\nscored in report:      ${wanted.size}`);
  console.log(`found in seed files:   ${seen.size}`);
  console.log(`relabelled:            ${changed}`);
  console.log(`already correct:       ${alreadyRight}`);
  console.log(`not found in any file: ${missing.length}`);
  if (missing.length) {
    console.log(`  (generated problems have no literal to edit: ${missing.slice(0, 8).join(", ")}…)`);
  }
  if (malformed.length) {
    console.log(`\nskipped — needs a human (${malformed.length}):`);
    for (const m of malformed.slice(0, 20)) console.log(`  ${m}`);
  }
  console.log(write ? "\nFiles written." : "\nDry run. Re-run with --write to apply.");
}

main();
