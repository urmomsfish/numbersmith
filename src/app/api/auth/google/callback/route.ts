import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { LEGAL } from "@/lib/legal";
import { exchangeGoogleCode, fetchGoogleProfile } from "@/lib/google-oauth";
import { STATE_COOKIE } from "@/app/api/auth/google/route";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const store = await cookies();
  const expectedState = store.get(STATE_COOKIE)?.value;
  store.delete(STATE_COOKIE);

  // Google appends this when the user cancels on its consent screen — not an
  // error worth logging, just send them back to try again.
  if (params.get("error")) {
    redirect("/login?error=google-cancelled");
  }

  const code = params.get("code");
  const state = params.get("state");
  if (!code || !state || !expectedState || state !== expectedState) {
    redirect("/login?error=google-failed");
  }

  // redirect() throws internally to unwind the response, so it must never be
  // called inside this try block — the catch below would treat that throw as
  // a real failure and send the user to the wrong error page.
  let profile;
  try {
    const accessToken = await exchangeGoogleCode(code);
    profile = await fetchGoogleProfile(accessToken);
  } catch (err) {
    console.error("[google-oauth]", err);
    redirect("/login?error=google-failed");
  }

  if (!profile.email_verified) {
    redirect("/login?error=google-unverified");
  }
  const email = profile.email.toLowerCase();

  let user = await prisma.user.findUnique({ where: { googleId: profile.sub } });

  if (!user) {
    const existingByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingByEmail) {
      // Same verified email as an account that signed up with a password —
      // link rather than create a duplicate, matching how every major app
      // treats "sign in with X" against a known address.
      user = await prisma.user.update({
        where: { id: existingByEmail.id },
        data: { googleId: profile.sub },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name: profile.name || email,
          email,
          googleId: profile.sub,
          role: "STUDENT",
          termsAcceptedAt: new Date(),
          termsAcceptedVersion: LEGAL.lastUpdated,
          stats: { create: {} },
          subscription: { create: { status: "FREE" } },
          ratings: { create: { category: "OVERALL", value: 1000 } },
        },
      });
    }
  }

  await createSession(user.id);

  const userProfile = await prisma.profile.findUnique({ where: { userId: user.id } });
  if (user.role === "ADMIN") redirect("/admin");
  if (!userProfile?.onboardingCompletedAt) redirect("/onboarding");
  redirect("/dashboard");
}
