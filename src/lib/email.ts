import "server-only";
import { Resend } from "resend";
import { LEGAL } from "@/lib/legal";

/** Resend is optional so the app still runs before a key exists — mirrors how
 * `src/lib/stripe.ts` treats STRIPE_SECRET_KEY. Every call site must handle
 * the unconfigured case rather than assume delivery happened. */
export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export function isEmailConfigured(): boolean {
  return resend !== null;
}

const FROM = process.env.EMAIL_FROM || "NumberSmith <onboarding@resend.dev>";

/** Returns whether the email was actually sent. When no provider is
 * configured, the code is logged server-side instead — visible to whoever
 * runs the server, never to the person who requested the reset — so nothing
 * in the UI can claim an email went out when it didn't. */
export async function sendPasswordResetCodeEmail(to: string, code: string): Promise<boolean> {
  if (!resend) {
    console.log(`[email not configured — RESEND_API_KEY unset] Password reset code for ${to}: ${code}`);
    return false;
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: `${code} is your NumberSmith password reset code`,
    html: `
      <p>Someone (hopefully you) asked to reset the password for your NumberSmith account.</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:4px;margin:20px 0;">${code}</p>
      <p>Enter this code on the reset page to choose a new password. It expires in 15 minutes.</p>
      <p>If you didn't request this, you can ignore this email — your password will not change.</p>
      <p style="color:#94a3b8;font-size:12px;margin-top:24px;">
        Questions? Reply to this email or write to ${LEGAL.contactEmail}.
      </p>
    `,
  });

  if (error) {
    console.error("Resend failed to send password reset code email:", error);
    return false;
  }
  return true;
}
