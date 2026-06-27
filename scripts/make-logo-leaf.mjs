// Recolors the leaf in the provided logo artwork to match the "Sign up"
// button background (forest-600 = #2d6f4e), leaving the ring, house, wood
// and background untouched.
//
// The leaf is a yellow-green (red noticeably higher than blue) while the
// ring is a balanced green (red ≈ blue), so we only retint pixels where
// green dominates AND (R - B) is clearly positive. Brightness is preserved
// per-pixel so the leaf keeps its veins and shading in the new hue.
import sharp from "sharp";
import path from "node:path";

const SRC = path.resolve("scripts/logo-source-new.png");
const OUT = path.resolve("public/images/logo.png");
const ICON = path.resolve("src/app/icon.png");

// forest-600
const TARGET = { r: 0x2d, g: 0x6f, b: 0x4e }; // 45,111,78
const REF_G = 150; // reference leaf brightness for scaling

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { channels } = info;

for (let i = 0; i < data.length; i += channels) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];

  const greenDominant = g > r && g > b;
  const yellowGreen = r - b >= 12; // leaf, not the balanced-green ring

  if (greenDominant && yellowGreen && g >= 70) {
    const scale = Math.max(0.45, Math.min(1.5, g / REF_G));
    data[i] = Math.min(255, Math.round(TARGET.r * scale));
    data[i + 1] = Math.min(255, Math.round(TARGET.g * scale));
    data[i + 2] = Math.min(255, Math.round(TARGET.b * scale));
  }
}

const recolored = await sharp(data, {
  raw: { width: info.width, height: info.height, channels },
})
  .png()
  .toBuffer();

await sharp(recolored).png({ compressionLevel: 9 }).toFile(OUT);
await sharp(recolored).resize(256, 256).png().toFile(ICON);

console.log(`Wrote ${OUT} and ${ICON} — leaf recolored to #2d6f4e (forest-600)`);
