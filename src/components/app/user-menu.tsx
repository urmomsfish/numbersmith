"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth-actions";
import { cn } from "@/lib/cn";

export function UserMenu({ name, email }: { name: string; email: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white"
      >
        {initials}
      </button>
      {open && (
        <div
          className={cn(
            "absolute right-0 z-50 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-800"
          )}
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{name}</p>
            <p className="truncate text-xs text-slate-400 dark:text-slate-500">{email}</p>
          </div>
          <div className="my-1 h-px bg-slate-100 dark:bg-slate-700" />
          <Link
            href="/settings"
            className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Settings
          </Link>
          <Link
            href="/pricing"
            className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            NumberSmith Pro
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-danger-600 hover:bg-red-50 dark:hover:bg-red-950"
            >
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
