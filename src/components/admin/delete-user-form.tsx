"use client";

import { deleteUserAction } from "@/lib/actions/admin-actions";

export function DeleteUserForm({
  userId,
  name,
  email,
  attemptCount,
}: {
  userId: string;
  name: string;
  email: string;
  attemptCount: number;
}) {
  return (
    <form
      action={deleteUserAction}
      onSubmit={(e) => {
        const confirmed = window.confirm(
          `Delete ${name}'s account (${email})?\n\nThis permanently removes their profile, ${attemptCount} attempt${attemptCount === 1 ? "" : "s"}, and all other data. This cannot be undone.`
        );
        if (!confirmed) e.preventDefault();
      }}
    >
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        className="text-xs font-semibold text-danger-600 dark:text-red-400 hover:text-danger-500 dark:hover:text-red-300"
      >
        Delete
      </button>
    </form>
  );
}
