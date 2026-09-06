function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.07-1.48-.22-2.14H12v3.88h6.61c-.13 1.09-.86 2.74-2.47 3.84l-.02.15 3.59 2.78.25.03c2.28-2.1 3.56-5.2 3.56-8.54"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.78-2.93c-1.01.7-2.37 1.19-4.15 1.19-3.18 0-5.88-2.1-6.84-4.99l-.14.01-3.72 2.88-.05.13C3.23 21.3 7.28 24 12 24"
      />
      <path
        fill="#FBBC05"
        d="M5.16 14.37A7.4 7.4 0 0 1 4.75 12c0-.82.15-1.62.4-2.37l-.01-.16-3.77-2.93-.12.06A11.97 11.97 0 0 0 0 12c0 1.93.47 3.76 1.25 5.4l3.91-3.03"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c2.25 0 3.77.97 4.64 1.78l3.39-3.31C17.94 1.19 15.24 0 12 0 7.28 0 3.23 2.7 1.25 6.6l3.9 3.03c.97-2.89 3.67-4.99 6.85-4.99"
      />
    </svg>
  );
}

export function GoogleButton() {
  return (
    <a
      href="/api/auth/google"
      className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
    >
      <GoogleIcon />
      Continue with Google
    </a>
  );
}

const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  "google-cancelled": "Google sign-in was cancelled.",
  "google-failed": "Google sign-in failed. Please try again.",
  "google-unverified": "That Google account's email isn't verified.",
  "google-not-configured": "Google sign-in isn't set up yet.",
};

export function googleErrorMessage(error: string | null): string | null {
  if (!error) return null;
  return GOOGLE_ERROR_MESSAGES[error] ?? null;
}
