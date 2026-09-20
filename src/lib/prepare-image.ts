/** Client-side image prep for Smith AI attachments.
 *
 * A raw screenshot off a Retina display is routinely 4–8 MB and 3000px wide,
 * which is both too big to post to a Server Action and bigger than the vision
 * API can use: it downscales anything over 1568px on the long edge before the
 * model ever sees it. Sending the original spends upload time and storage on
 * detail that is discarded server-side, so the resize happens here instead.
 *
 * Quality is stepped down rather than fixed, because "how many bytes does this
 * become" depends entirely on the picture — a screenshot of a text worksheet
 * compresses far smaller than a photo of a page under a desk lamp. A fixed
 * quality either bloats the first or needlessly softens the second. */

/** Longest edge, in pixels. Matches the size above which the vision API
 * resizes anyway, so nothing legible is lost by doing it here first. */
const MAX_EDGE = 1568;

/** Target encoded size. Comfortably under the action's 4 MB base64 cap once
 * base64 inflates it by ~33%, with room for the rest of the request. */
const TARGET_BYTES = 1_200_000;

const QUALITY_STEPS = [0.85, 0.7, 0.55, 0.4];

export type PreparedImage = {
  /** Base64 payload with no `data:` prefix — what the API wants. */
  data: string;
  type: "image/jpeg";
  /** Object URL for the composer thumbnail. Caller revokes it. */
  previewUrl: string;
};

export const ACCEPTED_UPLOAD_TYPES = "image/png,image/jpeg,image/gif,image/webp";

export function isImageFile(file: File | null | undefined): boolean {
  return Boolean(file && file.type.startsWith("image/"));
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
      if (comma === -1) reject(new Error("Couldn't read that image."));
      else resolve(result.slice(comma + 1));
    };
    reader.onerror = () => reject(new Error("Couldn't read that image."));
    reader.readAsDataURL(blob);
  });
}

function encode(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

/** Resizes, re-encodes as JPEG, and base64s. Throws a message fit to show the
 * student directly. */
export async function prepareImage(file: File): Promise<PreparedImage> {
  if (!isImageFile(file)) throw new Error("That file isn't an image.");

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
      previewUrl: URL.createObjectURL(blob),
    };
  } finally {
    bitmap.close();
  }
}
