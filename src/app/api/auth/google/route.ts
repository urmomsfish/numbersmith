import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { googleAuthUrl, isGoogleOAuthConfigured } from "@/lib/google-oauth";

export const STATE_COOKIE = "google_oauth_state";

// Google returns whatever `state` it was given verbatim, so a random value
// stored in a short-lived cookie and compared on callback is enough to prove
// the callback request actually followed from a redirect we issued — without
// it, an attacker could send a victim a crafted callback URL carrying an
// authorization code for the attacker's own Google account, logging the
// victim into it (a login CSRF).
export async function GET() {
  if (!isGoogleOAuthConfigured()) {
    redirect("/login?error=google-not-configured");
  }

  const state = randomBytes(24).toString("hex");
  const store = await cookies();
  store.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  redirect(googleAuthUrl(state));
}
