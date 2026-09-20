// Regenerates every raster icon from src/app/icon.svg.
//
// The PNGs and the .ico are build artifacts of that one SVG, but they are
// committed (Next serves them straight out of public/, and favicon.ico has to
// exist as a real file). So they can — and did — drift: when the brand moved
// off indigo, the SVG was the only icon anyone remembered to update. Run this
// whenever icon.svg changes:
//
//   npm run icons
//
// Sizes: 192/512 are the web-manifest icons, 180 is apple-touch-icon (iOS
// ignores the manifest), and 16/32/48 go inside favicon.ico.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(root, "src/app/icon.svg"));

const render = (size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();

/** Packs PNGs into an .ico. Since Vista, ICO directory entries may hold a whole
 * PNG rather than a raw BMP, so each image goes in verbatim — no bitmap
 * encoding, no AND mask. */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = [];
  for (const { size, png } of images) {
    const e = Buffer.alloc(16);
    // 256px is stored as 0 in a single byte; nothing here is that large, but
    // the encoding is the reason these are bytes rather than shorts.
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2); // palette size (0 = truecolour)
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.png)]);
}

const outputs = [
  ["public/icon-192.png", 192],
  ["public/icon-512.png", 512],
  ["public/apple-touch-icon.png", 180],
];

for (const [path, size] of outputs) {
  writeFileSync(join(root, path), await render(size));
  console.log(`✓ ${path} (${size}×${size})`);
}

const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(icoSizes.map(async (size) => ({ size, png: await render(size) })));
writeFileSync(join(root, "src/app/favicon.ico"), ico(icoImages));
console.log(`✓ src/app/favicon.ico (${icoSizes.join(", ")})`);
