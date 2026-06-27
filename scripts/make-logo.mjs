// Builds a transparent, high-resolution logo from the brand artwork.
// The source (scripts/logo-source.webp) is the inked hand-drawn eco-home
// emblem with an already-transparent background. We trim the empty margin
// and upscale with denoise + sharpen to get the cleanest possible result
// out of the small source.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const INPUT = path.resolve("scripts/logo-source.webp");

const OUT_DIR = path.resolve("public/images");
const OUT = path.join(OUT_DIR, "logo.png");
const ICON = path.resolve("src/app/icon.png");

await mkdir(OUT_DIR, { recursive: true });

// Trim the transparent margin so the emblem fills the frame, then upscale.
const trimmed = await sharp(INPUT)
  .ensureAlpha()
  .trim()
  .png()
  .toBuffer();

const OUT_SIZE = 1024;
await sharp(trimmed)
  .resize(OUT_SIZE, OUT_SIZE, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
    kernel: "lanczos3",
  })
  .median(2)
  .sharpen({ sigma: 1 })
  .png({ compressionLevel: 9 })
  .toFile(OUT);

await sharp(trimmed)
  .resize(256, 256, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
    kernel: "lanczos3",
  })
  .sharpen({ sigma: 0.6 })
  .png()
  .toFile(ICON);

const meta = await sharp(INPUT).metadata();
console.log(
  `Wrote ${OUT} (${OUT_SIZE}x${OUT_SIZE}) and ${ICON} (256x256) — source ${meta.width}x${meta.height} ${meta.format}`
);
