/** Client-side prep for Smith AI attachments — screenshots and PDFs.
 *
 * Images: a raw screenshot off a Retina display is routinely 4–8 MB and 3000px
 * wide, which is both too big to post to a Server Action and bigger than the
 * vision API can use: it downscales anything over 1568px on the long edge
 * before the model ever sees it. Sending the original spends upload time and
 * storage on detail that is discarded server-side, so the resize happens here.
 *
 * Quality is stepped down rather than fixed, because "how many bytes does this
 * become" depends entirely on the picture — a screenshot of a text worksheet
 * compresses far smaller than a photo of a page under a desk lamp. A fixed
 * quality either bloats the first or needlessly softens the second.
 *
 * PDFs: nothing equivalent is possible here. Re-encoding a PDF in the browser
 * would mean shipping a PDF toolkit to every student for the rare oversized
 * file, and rasterising one to images would throw away the selectable text the
 * API reads. So a PDF passes through untouched and is simply refused when it's
 * too big, with a message that says what to do about it. */

/** Longest edge, in pixels. Matches the size above which the vision API
 * resizes anyway, so nothing legible is lost by doing it here first. */
const MAX_EDGE = 1568;

/** Target encoded size for images. Comfortably under the action's cap once
 * base64 inflates it by ~33%, with room for the rest of the request. */
const TARGET_BYTES = 1_200_000;

const QUALITY_STEPS = [0.85, 0.7, 0.55, 0.4];

/** Biggest PDF accepted, before base64. Kept in step with MAX_ATTACHMENT_BASE64
 * in ai-actions.ts: 3 MB of file becomes ~4 MB of base64, which is that cap.
 * Rejecting here rather than after a slow upload is the whole point. */
const MAX_PDF_BYTES = 3 * 1024 * 1024;

export const PDF_TYPE = "application/pdf";

export type PreparedAttachment = {
  /** Base64 payload with no `data:` prefix — what the API wants. */
  data: string;
  /** "image/jpeg" for anything image-shaped, or "application/pdf". */
  type: string;
  /** What the composer shows: a thumbnail for images, a filename for PDFs. */
  kind: "image" | "pdf";
  /** Object URL for the image thumbnail. Null for PDFs. Caller revokes it. */
  previewUrl: string | null;
  /** Original filename, shown for PDFs where there's no visual preview. */
  name: string;
};

export const ACCEPTED_UPLOAD_TYPES = "image/png,image/jpeg,image/gif,image/webp,application/pdf";

export function isImageFile(file: File | null | undefined): boolean {
  return Boolean(file && file.type.startsWith("image/"));
}

export function isPdfFile(file: File | null | undefined): boolean {
  return file?.type === PDF_TYPE;
}

/** Anything the composer will take. Used by the paste and drop handlers, which
 * see arbitrary files and must ignore the ones we can't do anything with. */
export function isAttachableFile(file: File | null | undefined): boolean {
  return isImageFile(file) || isPdfFile(file);
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // readAsDataURL then split, rather than reading an ArrayBuffer and
    // base64-ing it by hand: String.fromCharCode over a multi-megabyte byte
    // array blows the argument limit, and chunking around that is more code
    // than it's worth when the platform already does it correctly.
    reader.onload = () => {
      const result = String(reader.result);
      const comma = result.indexOf(",");
      if (comma === -1) reject(new Error("Couldn't read that file."));
      else resolve(result.slice(comma + 1));
    };
    reader.onerror = () => reject(new Error("Couldn't read that file."));
    reader.readAsDataURL(blob);
  });
}

function encode(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

function megabytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function prepareImage(file: File): Promise<PreparedAttachment> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    // A corrupt file, or a format the browser itself can't decode (HEIC on
    // some desktop browsers is the common one).
    throw new Error("That image couldn't be opened — try a PNG or JPEG.");
  }

  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Couldn't process that image.");
    // JPEG has no alpha, so a transparent PNG — which is what a cropped
    // screenshot often is — would composite onto black and turn dark-mode
    // screenshots into unreadable mush. White first.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    let blob: Blob | null = null;
    for (const quality of QUALITY_STEPS) {
      blob = await encode(canvas, quality);
      if (blob && blob.size <= TARGET_BYTES) break;
    }
    if (!blob) throw new Error("Couldn't process that image.");

    return {
      data: await blobToBase64(blob),
      type: "image/jpeg",
      kind: "image",
      previewUrl: URL.createObjectURL(blob),
      name: file.name || "screenshot.jpg",
    };
  } finally {
    bitmap.close();
  }
}

async function preparePdf(file: File): Promise<PreparedAttachment> {
  if (file.size > MAX_PDF_BYTES) {
    throw new Error(
      `That PDF is ${megabytes(file.size)} — the limit is ${megabytes(MAX_PDF_BYTES)}. ` +
        `Try attaching just the pages you need, or screenshot the problem instead.`
    );
  }
  if (file.size === 0) throw new Error("That PDF is empty.");

  return {
    data: await blobToBase64(file),
    type: PDF_TYPE,
    kind: "pdf",
    // No thumbnail: rendering page one would mean a PDF library in the bundle
    // for a decoration. The filename is what identifies a paper anyway.
    previewUrl: null,
    name: file.name || "document.pdf",
  };
}

/** Resizes or size-checks, then base64s. Throws a message fit to show the
 * student directly. */
export async function prepareAttachment(file: File): Promise<PreparedAttachment> {
  if (isImageFile(file)) return prepareImage(file);
  if (isPdfFile(file)) return preparePdf(file);
  throw new Error("You can attach an image or a PDF.");
}
