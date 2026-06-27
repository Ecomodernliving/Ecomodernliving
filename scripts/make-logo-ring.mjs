// Final logo build from the provided artwork:
//  1. Recolor the leaf to forest-600 (#2d6f4e — matches the Sign up button).
//  2. Erase the original perfect green ring (paint it back to the cream bg).
//  3. Composite a lighter-green, free-style hand-drawn ring on top.
import sharp from "sharp";
import path from "node:path";

const SRC = path.resolve("scripts/logo-source-new.png");
const OUT = path.resolve("public/images/logo.png");
const ICON = path.resolve("src/app/icon.png");

const LEAF = { r: 0x2d, g: 0x6f, b: 0x4e }; // forest-600
const REF_G = 150;

// Lighter, hand-drawn ring colour (clearly lighter than the dark original).
const RING = "#67bd5f";

const CREAM = { r: 243, g: 244, b: 238 };

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const cx = width / 2;
const cy = height / 2;

for (let p = 0; p < data.length; p += channels) {
  const r = data[p];
  const g = data[p + 1];
  const b = data[p + 2];

  // --- recolor the leaf (yellow-green: green dominant, red noticeably > blue)
  if (g > r && g > b && r - b >= 12 && g >= 70) {
    const scale = Math.max(0.45, Math.min(1.5, g / REF_G));
    data[p] = Math.min(255, Math.round(LEAF.r * scale));
    data[p + 1] = Math.min(255, Math.round(LEAF.g * scale));
    data[p + 2] = Math.min(255, Math.round(LEAF.b * scale));
    continue;
  }

  // --- erase the original ring + its anti-aliased halo in the outer band.
  // Inside the ring the bg is white, outside it is cream; the seam sits near
  // r≈489. We only touch balanced-green pixels (the old ring) so the leaf
  // (blue-green) and house are preserved.
  const px = (p / channels) % width;
  const py = Math.floor(p / channels / width);
  const dist = Math.hypot(px - cx, py - cy);
  if (dist > 448) {
    // Protect the leaf's sector (lower-right → bottom-left) so its edge and
    // dark outline survive; clean the rest of the band aggressively.
    const ang = Math.atan2(py - cy, px - cx); // 0=right, +down
    const inLeafSector = ang > 0.12 && ang < 2.35;

    const balancedGreen = g > r + 6 && Math.abs(r - b) < 18 && g >= 55 && g < 238;
    const neutralGray =
      Math.abs(r - g) < 16 && Math.abs(g - b) < 16 && Math.abs(r - b) < 16 &&
      Math.max(r, g, b) < 232; // ring's anti-aliased dark outline

    if (balancedGreen || (neutralGray && !inLeafSector)) {
      const fill = dist < 489 ? { r: 252, g: 252, b: 250 } : CREAM;
      data[p] = fill.r;
      data[p + 1] = fill.g;
      data[p + 2] = fill.b;
      data[p + 3] = 255;
    }
  }
}

const base = await sharp(data, { raw: { width, height, channels } })
  .png()
  .toBuffer();

// --- build the wobbly, hand-drawn ring path -------------------------------
const R = 482;
const start = -0.26;
const end = Math.PI * 2 + 0.22; // overshoot so the stroke ends cross (free-hand)
const steps = 420;
let d = "";
for (let i = 0; i <= steps; i++) {
  const t = start + ((end - start) * i) / steps;
  const wob =
    10 * Math.sin(t * 3 + 0.7) +
    6 * Math.sin(t * 5 + 2.1) +
    4 * Math.sin(t * 2 - 1.0) +
    3 * Math.sin(t * 7 + 0.4);
  const rr = R + wob;
  const x = cx + rr * Math.cos(t);
  const y = cy + rr * Math.sin(t);
  d += i === 0 ? `M${x.toFixed(1)} ${y.toFixed(1)}` : ` L${x.toFixed(1)} ${y.toFixed(1)}`;
}

const ringSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
     <path d="${d}" fill="none" stroke="${RING}" stroke-width="21"
           stroke-linecap="round" stroke-linejoin="round"/>
   </svg>`
);

const composed = await sharp(base)
  .composite([{ input: ringSvg }])
  .png({ compressionLevel: 9 })
  .toBuffer();

await sharp(composed).toFile(OUT);
await sharp(composed).resize(256, 256).png().toFile(ICON);

console.log(`Wrote ${OUT} and ${ICON} — hand-drawn ring ${RING}, leaf #2d6f4e`);
