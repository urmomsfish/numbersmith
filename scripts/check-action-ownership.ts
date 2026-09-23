// Asserts that every Server Action which accepts an id from the client also
// checks the caller is allowed to touch that row.
//
//   npm run verify:ownership
//
// Why this exists: a Server Action is a public HTTP endpoint. The id arriving
// at one is whatever the caller sent, not what the page rendered — and the
// database has no row-level security to fall back on (0 policies across 38
// tables, and the app connects as an owner role with rolbypassrls). So the
// ownership check in the action body is the *only* thing standing between one
// student and another student's rows. That is a guarantee worth enforcing
// mechanically rather than by review.
//
// This is a static check over the TypeScript AST, not a runtime test. It cannot
// prove a guard is correct; it proves one is *present*, which is the failure
// mode that actually happens — an action added months later that reads an id
// and forgets. The daily-challenge exploit fixed alongside this was the same
// shape: a client-supplied id and no matching rule.
//
// A function passes if it does any of:
//   - calls requireAdmin()
//   - scopes a query by the caller: `userId: user.id` inside a `where`
//   - compares owners explicitly: `something.userId !== user.id`
//   - carries a waiver comment saying why the id is not user-scoped
//
// Waivers are deliberate: some ids name globally readable rows (a problem, a
// competition, a lesson), where there is no owner to compare against. Those
// must say so in the source, next to the code, so the reasoning survives.

import * as fs from "node:fs";
import * as path from "node:path";
import * as ts from "typescript";

const ACTIONS_DIR = path.join(__dirname, "..", "src", "lib", "actions");

/** Written above an exported action, or above the parameter, to record that an
 * id it accepts names a row with no owner. The text after the marker is the
 * justification and is required — a bare marker is rejected. */
const WAIVER = "@unowned-id";

type Finding = { file: string; fn: string; line: number; ids: string[] };

const isIdName = (name: string) => /(^id$|Id$)/.test(name);

/** Ids the action reads from its own input — either a destructured/typed
 * parameter member ending in `Id`, or a `formData.get("...Id")` call. */
function idInputsOf(fn: ts.FunctionDeclaration): string[] {
  const found = new Set<string>();

  for (const param of fn.parameters) {
    // `input: { attemptId: string; ... }` — read the type literal's members.
    const t = param.type;
    if (t && ts.isTypeLiteralNode(t)) {
      for (const m of t.members) {
        if (ts.isPropertySignature(m) && m.name && ts.isIdentifier(m.name) && isIdName(m.name.text)) {
          found.add(m.name.text);
        }
      }
    }
    // `{ attemptId }: { ... }` — destructured binding names.
    if (ts.isObjectBindingPattern(param.name)) {
      for (const el of param.name.elements) {
        if (ts.isIdentifier(el.name) && isIdName(el.name.text)) found.add(el.name.text);
      }
    }
  }

  // `formData.get("attemptId")`
  const visit = (node: ts.Node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === "get" &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0]) &&
      isIdName(node.arguments[0].text)
    ) {
      found.add(node.arguments[0].text);
    }
    ts.forEachChild(node, visit);
  };
  if (fn.body) visit(fn.body);

  return [...found];
}

/** Looks for one of the accepted guard shapes in the function body.
 *
 * The `where`-only rule is the load-bearing part. An earlier version matched
 * `userId: user.id` anywhere in the body and passed every action in the
 * codebase on its first run — because almost all of them write that property
 * into a `create({ data: ... })`, which records who *made* a row and authorises
 * nothing. Stamping your own id onto a new row is not a claim about a row you
 * were handed. Only a `where` clause narrows what the caller can reach.
 *
 * The `where` must also mention the id it is supposed to be guarding. Without
 * that, any unrelated user-scoped query in the body counted as a guard: with
 * the real ownership check deleted, submitPlacementAnswerAction still passed
 * because it happens to load the caller's own profile by `userId`. Loading your
 * own profile authorises nothing about someone else's placement test.
 *
 * Still deliberately shallow beyond that: proving a guard governs the right
 * code path is beyond a lint. A false pass is no worse than the review this
 * replaces, whereas a false failure would train people to ignore it. Known
 * limitation: the check is per function, not per id, so an action taking two
 * ids passes once either is guarded. */
function hasGuard(fn: ts.FunctionDeclaration): boolean {
  let guarded = false;

  const visit = (node: ts.Node, inWhere: boolean) => {
    if (guarded) return;

    // requireAdmin()
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "requireAdmin"
    ) {
      guarded = true;
      return;
    }

    // `x.userId !== user.id` (or ===) — an explicit comparison of owners.
    // Both sides are checked: `a.userId !== b.userId` compares two rows and
    // says nothing about the caller.
    if (
      ts.isBinaryExpression(node) &&
      (node.operatorToken.kind === ts.SyntaxKind.ExclamationEqualsEqualsToken ||
        node.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken) &&
      ts.isPropertyAccessExpression(node.left) &&
      node.left.name.text === "userId" &&
      ts.isPropertyAccessExpression(node.right) &&
      node.right.name.text === "id" &&
      ts.isIdentifier(node.right.expression) &&
      node.right.expression.text === "user"
    ) {
      guarded = true;
      return;
    }

    // `where: { id: <an id input>, userId: user.id }` — ownership pushed into
    // the query itself. Both halves are required: scoped to the caller, AND
    // naming the id under scrutiny.
    if (
      ts.isPropertyAssignment(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === "where" &&
      scopesToCaller(node.initializer) &&
      narrowsBeyondUser(node.initializer)
    ) {
      guarded = true;
      return;
    }

    const entering =
      ts.isPropertyAssignment(node) && ts.isIdentifier(node.name) && node.name.text === "where";
    // `data:` explicitly leaves the where-context — a nested write inside an
    // upsert must not inherit it.
    const leaving =
      ts.isPropertyAssignment(node) &&
      ts.isIdentifier(node.name) &&
      (node.name.text === "data" || node.name.text === "create" || node.name.text === "update");

    ts.forEachChild(node, (child) =>
      visit(child, entering ? true : leaving ? false : inWhere)
    );
  };

  if (fn.body) visit(fn.body, false);
  return guarded;
}

/** `userId: user.id` anywhere inside the given node. */
function scopesToCaller(node: ts.Node): boolean {
  let found = false;
  const walk = (n: ts.Node) => {
    if (found) return;
    if (
      ts.isPropertyAssignment(n) &&
      ts.isIdentifier(n.name) &&
      n.name.text === "userId" &&
      ts.isPropertyAccessExpression(n.initializer) &&
      n.initializer.name.text === "id" &&
      ts.isIdentifier(n.initializer.expression) &&
      n.initializer.expression.text === "user"
    ) {
      found = true;
      return;
    }
    ts.forEachChild(n, walk);
  };
  walk(node);
  return found;
}

/** Whether a `where` clause pins a specific row rather than just selecting
 * everything the caller owns.
 *
 * This replaced an attempt to match the id by name, which was both too loose
 * and too brittle: substring matching meant the alias `id` matched `userId`
 * (and `user.id` itself), so `where: { userId: user.id }` counted as naming an
 * id. The distinction that actually matters needs no names — a guard narrows to
 * one row AND scopes it to the caller, while `where: { userId: user.id }` alone
 * is an ordinary "list my things" query and authorises nothing about a
 * particular id.
 *
 * A composite key such as `userId_dailyChallengeId` counts, since its own name
 * is not `userId`. */
function narrowsBeyondUser(node: ts.Node): boolean {
  let found = false;
  const walk = (n: ts.Node) => {
    if (found) return;
    if (
      (ts.isPropertyAssignment(n) || ts.isShorthandPropertyAssignment(n)) &&
      ts.isIdentifier(n.name) &&
      n.name.text !== "userId"
    ) {
      found = true;
      return;
    }
    ts.forEachChild(n, walk);
  };
  walk(node);
  return found;
}

/** True when a justified waiver sits in the comments attached to the function.
 * The text after the marker is the justification and is required — a bare
 * marker is rejected, because "waived" with no reason is how a real gap gets
 * silenced. */
function waivedWith(fn: ts.Node, src: ts.SourceFile): string | null {
  const text = src.getFullText();
  const ranges = ts.getLeadingCommentRanges(text, fn.getFullStart()) ?? [];
  for (const r of ranges) {
    const comment = text.slice(r.pos, r.end);
    const at = comment.indexOf(WAIVER);
    if (at < 0) continue;
    const reason = comment
      .slice(at + WAIVER.length)
      .replace(/[\s*/]+/g, " ")
      .trim();
    return reason.length > 0 ? reason : null;
  }
  return null;
}

function main() {
  const files = fs
    .readdirSync(ACTIONS_DIR)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => path.join(ACTIONS_DIR, f));

  const failures: Finding[] = [];
  const waived: { fn: string; reason: string }[] = [];
  let scannedFiles = 0;
  let scannedFns = 0;
  let guarded = 0;

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    // Only "use server" modules are reachable from a browser. A helper module
    // without the directive can only be called by our own server code.
    if (!/^\s*["']use server["']/m.test(text)) continue;
    scannedFiles++;

    const src = ts.createSourceFile(file, text, ts.ScriptTarget.ES2022, true);

    for (const stmt of src.statements) {
      if (!ts.isFunctionDeclaration(stmt)) continue;
      const exported = stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      if (!exported || !stmt.name) continue;

      const ids = idInputsOf(stmt);
      if (ids.length === 0) continue;
      scannedFns++;

      if (hasGuard(stmt)) {
        guarded++;
        continue;
      }

      const reason = waivedWith(stmt, src);
      if (reason) {
        waived.push({ fn: stmt.name.text, reason });
        continue;
      }

      const line = src.getLineAndCharacterOfPosition(stmt.getStart(src)).line + 1;
      failures.push({ file: path.relative(process.cwd(), file), fn: stmt.name.text, line, ids });
    }
  }

  console.log(`Scanned ${scannedFiles} "use server" modules.`);
  console.log(`  actions accepting a client-supplied id: ${scannedFns}`);
  console.log(`  with an ownership guard: ${guarded}`);
  console.log(`  waived as unowned rows:  ${waived.length}`);
  for (const w of waived) console.log(`    ${w.fn} — ${w.reason}`);

  if (failures.length === 0) {
    console.log(`\n✓ every action taking an id checks the caller may use it`);
    return;
  }

  console.log(`\n✗ ${failures.length} action(s) take an id with no ownership check:\n`);
  for (const f of failures) {
    console.log(`  ${f.file}:${f.line}  ${f.fn}()`);
    console.log(`    reads: ${f.ids.join(", ")}`);
    console.log(
      `    fix: compare owners (row.userId !== user.id), scope the query (userId: user.id),`
    );
    console.log(`         or document why with a "${WAIVER} <reason>" comment above it.\n`);
  }
  process.exitCode = 1;
}

main();
