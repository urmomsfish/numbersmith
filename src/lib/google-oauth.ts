import "server-only";
import { appBaseUrl } from "@/lib/stripe";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

export function isGoogleOAuthConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function googleRedirectUri(): string {
  return `${appBaseUrl()}/api/auth/google/callback`;
}

export function googleAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? "",
    redirect_uri: googleRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    state,
    // Consent screens are re-shown by default only on scope changes; asking
    // for account selection every time avoids silently reusing whichever
    // Google account happened to be last signed in on a shared device.
    prompt: "select_account",
  });
  return `${AUTH_URL}?${params.toString()}`;
}

type GoogleTokenResponse = { access_token: string };

export async function exchangeGoogleCode(code: string): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      code,
      grant_type: "authorization_code",
      redirect_uri: googleRedirectUri(),
    }),
  });
  if (!res.ok) throw new Error("Google token exchange failed");
  const data = (await res.json()) as GoogleTokenResponse;
  return data.access_token;
}

export type GoogleProfile = {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
};

export async function fetchGoogleProfile(accessToken: string): Promise<GoogleProfile> {
  const res = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Google userinfo request failed");
  return res.json();
}
