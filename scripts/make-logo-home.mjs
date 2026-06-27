// Composites a home photo into the existing logo's green ring + leaf.
// 1. Extract the green ring/leaf from the current logo (keep greenish pixels).
// 2. Crop the home photo to a circle sized to the ring's interior.
// 3. Stack: home disc (back) -> green ring/leaf (front), so the ring frames
//    the home and the leaf overlaps its lower-right.
import sharp from "sharp";
import path from "node:path";

const HOME =
  "C:/Users/segar/.cursor/projects/c-Users-segar-OneDrive-Desktop-EcoModernLiving/assets/c__Users_segar_AppData_Roaming_Cursor_User_workspaceStorage_7f708f0a521246d53ee9da8dddeca897_images_ModernHome-dd49aef0-c93a-4904-931b-5ef1ac9a9b14.png";

const LOGO = path.resolve("public/images/logo.png");
const OUT = path.resolve("public/images/logo.png");
const ICON = path.resolve("src/app/icon.png");

// --- 1. Green ring + leaf layer from the current logo -----------------------
const { data, info } = await sharp(LOGO)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width: W, height: H, channels } = info;

let minX = W;
let minY = H;
let maxX = 0;
let maxY = 0;

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * channels;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    const greenish = a > 40 && g >= r && g >= b && g - r > 12 && g > 40;
    if (greenish) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    } else {
      data[i + 3] = 0; // drop non-green (the old building)
    }
  }
}

const greenLayer = await sharp(data, { raw: { width: W, height: H, channels } })
  .png()
  .toBuffer();

// Ring geometry from the green bounding box.
const cx = Math.round((minX + maxX) / 2);
const cy = Math.round((minY + maxY) / 2);
const rOuter = Math.round(Math.max(maxX - minX, maxY - minY) / 2);
const rHome = Math.round(rOuter * 0.93); // tuck slightly under the ring

// --- 2. Home photo cropped to a circle --------------------------------------
const homeSquare = await sharp(HOME)
  .resize(W, H, { fit: "cover", position: sharp.strategy.attention })
  .toBuffer();

const circleMask = Buffer.from(
  `<svg width="${W}" height="${H}"><circle cx="${cx}" cy="${cy}" r="${rHome}" fill="#fff"/></svg>`
);

const homeDisc = await sharp(homeSquare)
  .ensureAlpha()
  .composite([{ input: circleMask, blend: "dest-in" }])
  .png()
  .toBuffer();

// --- 3. Compose: home disc behind, green ring/leaf in front ------------------
const composed = await sharp({
  create: {
    width: W,
    height: H,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([{ input: homeDisc }, { input: greenLayer }])
  .png()
  .toBuffer();

await sharp(composed).png({ compressionLevel: 9 }).toFile(OUT);
await sharp(composed).resize(256, 256).png().toFile(ICON);

console.log(
  `Wrote ${OUT} and ${ICON} — ring center (${cx},${cy}) rOuter ${rOuter} rHome ${rHome}`
);
