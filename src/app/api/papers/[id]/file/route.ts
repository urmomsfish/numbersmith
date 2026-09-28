import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Serves an uploaded paper's PDF to the account that uploaded it.
 *
 * A route handler rather than a `data:` URL in the page. Three reasons, in
 * order of how much they matter:
 *
 *   - Browsers block `data:` URLs in iframes, so a data-URL PDF viewer does not
 *     render at all in Chrome.
 *   - The base64 would otherwise be inlined into the HTML of every render of
 *     the sitting page — megabytes, re-sent on each navigation, uncacheable.
 *   - A URL can be authorised per request. An inlined payload has already been
 *     handed over by the time anyone thinks about it.
 *
 * This is the only endpoint in NumberSmith that returns a file a user
 * uploaded, so the ownership check is the whole security boundary for it. The
 * paper is matched by id *and* userId in one query: there is no window where
 * the row is in hand before the decision is made, and a valid id belonging to
 * another account is indistinguishable from one that does not exist.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return new Response("Not found", { status: 404 });

  const { id } = await params;
  const paper = await prisma.uploadedPaper.findFirst({
    where: { id, userId: user.id },
    select: { fileData: true, title: true },
  });
  // 404 rather than 403 — a 403 would confirm the paper exists.
  if (!paper) return new Response("Not found", { status: 404 });

  let bytes: Buffer;
  try {
    bytes = Buffer.from(paper.fileData, "base64");
  } catch {
    return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      // `inline` so it renders in the viewer beside the answer sheet rather
      // than downloading, which would defeat the point of sitting it on screen.
      "Content-Disposition": `inline; filename="${paper.title.replace(/[^\w .-]/g, "_")}.pdf"`,
      // Private: this is one user's file and must never sit in a shared cache.
      "Cache-Control": "private, max-age=3600",
      "Content-Security-Policy": "default-src 'none'; object-src 'none'",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
