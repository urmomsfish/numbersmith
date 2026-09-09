import { Button } from "@/components/ui/button";
import type { Topic, Competition, Problem } from "@/generated/prisma";
import { parseChoices, parseHints, parseTags } from "@/lib/engine/scoring";

export function ProblemForm({
  action,
  problem,
  topics,
  competitions,
  error,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  problem?: Problem;
  topics: Topic[];
  competitions: Competition[];
  error?: string;
  submitLabel: string;
}) {
  const choices = problem ? parseChoices(problem.choices).join("\n") : "";
  const hints = problem ? parseHints(problem.hints).join("\n") : "";
  const tags = problem ? parseTags(problem.tags).join("\n") : "";

  const domains = topics.filter((t) => !t.parentId);

  return (
    <form action={action} className="space-y-5">
      {problem && <input type="hidden" name="id" value={problem.id} />}

      {error && <p className="rounded-lg bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-danger-600 dark:text-red-400">{error}</p>}

      <Field label="Slug" hint="Lowercase letters, numbers, and dashes.">
        <input
          name="slug"
          required
          defaultValue={problem?.slug ?? ""}
          placeholder="alg-linear-05"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Question">
        <textarea
          name="question"
          required
          rows={3}
          defaultValue={problem?.question ?? ""}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Format">
          <select
            name="format"
            defaultValue={problem?.format ?? "MULTIPLE_CHOICE"}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
          >
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="SHORT_ANSWER">Short Answer</option>
            <option value="INTEGER">Integer</option>
          </select>
        </Field>

        <Field label="Answer" hint="Letter (A-E) for multiple choice, otherwise the exact answer.">
          <input
            name="answer"
            required
            defaultValue={problem?.answer ?? ""}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
          />
        </Field>
      </div>

      <Field label="Answer choices" hint="One per line. Only used for multiple choice.">
        <textarea
          name="choices"
          rows={5}
          defaultValue={choices}
          placeholder={"12\n15\n18\n21\n24"}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 font-mono text-sm"
        />
      </Field>

      <Field label="Solution">
        <textarea
          name="solution"
          required
          rows={4}
          defaultValue={problem?.solution ?? ""}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Hints" hint="One per line, ordered from gentlest to most direct.">
        <textarea
          name="hints"
          rows={3}
          defaultValue={hints}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Difficulty (1-10)">
          <input
            type="number"
            name="difficulty"
            min={1}
            max={10}
            required
            defaultValue={problem?.difficulty ?? 3}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Grade min">
          <input
            type="number"
            name="gradeMin"
            min={0}
            max={12}
            required
            defaultValue={problem?.gradeMin ?? 5}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Grade max">
          <input
            type="number"
            name="gradeMax"
            min={0}
            max={12}
            required
            defaultValue={problem?.gradeMax ?? 9}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Est. time (seconds)">
          <input
            type="number"
            name="estimatedTimeSeconds"
            min={15}
            max={1800}
            required
            defaultValue={problem?.estimatedTimeSeconds ?? 120}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Topic">
          <select
            name="topicSlug"
            required
            defaultValue={topics.find((t) => t.id === problem?.topicId)?.slug ?? ""}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
          >
            <option value="">Select a topic</option>
            {domains.map((d) => (
              <optgroup key={d.id} label={d.name}>
                <option value={d.slug}>{d.name} (general)</option>
                {topics
                  .filter((t) => t.parentId === d.id)
                  .map((t) => (
                    <option key={t.id} value={t.slug}>
                      {t.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </Field>

        <Field label="Competition" hint="Optional — tags this problem to a competition track.">
          <select
            name="competitionSlug"
            defaultValue={competitions.find((c) => c.id === problem?.competitionId)?.slug ?? ""}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
          >
            <option value="">None</option>
            {competitions.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.shortName}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Tags" hint="One per line.">
        <textarea
          name="tags"
          rows={2}
          defaultValue={tags}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
        />
      </Field>

      <fieldset className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <legend className="px-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Source & Licensing
        </legend>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Source">
            <input
              name="source"
              required
              defaultValue={problem?.source ?? "NumberSmith Original"}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
            />
          </Field>
          <Field label="License">
            <input
              name="license"
              required
              defaultValue={problem?.license ?? "NumberSmith Original"}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Year">
            <input
              type="number"
              name="year"
              min={1900}
              max={2200}
              defaultValue={problem?.year ?? ""}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Author">
            <input
              name="author"
              required
              defaultValue={problem?.author ?? "NumberSmith Team"}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
            />
          </Field>
        </div>
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          Only add problems that are original, public domain, properly licensed, or used with
          permission. Never transcribe copyrighted competition archives.
        </p>
      </fieldset>

      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={problem?.isPublished ?? true}
            className="h-4 w-4"
          />
          Published (visible to students)
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            name="isPlacement"
            defaultChecked={problem?.isPlacement ?? true}
            className="h-4 w-4"
          />
          Eligible for the placement test
        </label>
      </div>

      <Button type="submit" size="lg">
        {submitLabel}
      </Button>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-slate-400 dark:text-slate-500">{hint}</span>}
    </label>
  );
}
