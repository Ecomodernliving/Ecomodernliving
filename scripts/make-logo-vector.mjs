// Crisp vector recreation of the inked eco-home emblem (black line-art modern
// house with wood-slat cladding, inside a green ring with a leaf). Rendering
// from vector means no smudge and razor-sharp output at any size.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.resolve("public/images");
const OUT = path.join(OUT_DIR, "logo.png");
const ICON = path.resolve("src/app/icon.png");

const INK = "#1b1b1d";
const WOOD = "#b07a43";
const WOODLINE = "#7c5226";
const RING = "#4a8f3e";
const LEAF = "#3f9b41";
const VEIN = "#1f6b2a";

// Build evenly spaced vertical wood slats across a horizontal span.
function slats(x0, x1, step) {
  let d = "";
  for (let x = x0; x <= x1; x += step) d += `M${x} 0 V256 `;
  return d.trim();
}

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="1024" height="1024">
  <defs>
    <clipPath id="rightWall">
      <path d="M120 44 L196 78 L196 150 L120 150 Z"/>
    </clipPath>
    <clipPath id="leftBase">
      <path d="M62 128 L120 128 L120 150 L62 150 Z"/>
    </clipPath>
  </defs>

  <!-- ring -->
  <circle cx="128" cy="128" r="116" fill="none" stroke="${RING}" stroke-width="6"/>

  <!-- wood-slat cladding: right tall wall -->
  <g clip-path="url(#rightWall)">
    <rect x="118" y="40" width="82" height="114" fill="${WOOD}"/>
    <path d="${slats(124, 194, 9)}" stroke="${WOODLINE}" stroke-width="3.2"/>
  </g>

  <!-- wood-slat cladding: lower-left base -->
  <g clip-path="url(#leftBase)">
    <rect x="60" y="126" width="62" height="26" fill="${WOOD}"/>
    <path d="${slats(66, 118, 8)}" stroke="${WOODLINE}" stroke-width="2.8"/>
  </g>

  <!-- house structure, inked outlines -->
  <g fill="none" stroke="${INK}" stroke-width="6"
     stroke-linecap="round" stroke-linejoin="round">
    <!-- roof / ridge -->
    <path d="M60 96 L120 44 L196 78"/>
    <!-- right wall outline -->
    <path d="M120 44 L120 150 M196 78 L196 150"/>
    <!-- left wall + base -->
    <path d="M60 96 L60 150 M60 150 L196 150"/>
    <!-- balcony beam -->
    <path d="M60 124 L120 124" stroke-width="7"/>
    <!-- window frame (upper-left) -->
    <rect x="70" y="80" width="40" height="34" rx="2" stroke-width="5" fill="#ffffff"/>
    <path d="M90 80 V114 M70 97 H110" stroke-width="3.5"/>
  </g>

  <!-- leaf, lower-right -->
  <path d="M210 110 C226 156 198 204 118 214 C148 196 150 150 210 110 Z"
        fill="${LEAF}" stroke="${VEIN}" stroke-width="3"/>
  <path d="M205 118 C182 152 158 184 128 208"
        fill="none" stroke="${VEIN}" stroke-width="4" stroke-linecap="round"/>
  <g fill="none" stroke="${VEIN}" stroke-width="2.6" stroke-linecap="round">
    <path d="M192 138 C186 147 179 153 171 158"/>
    <path d="M180 158 C174 167 167 173 160 178"/>
    <path d="M168 178 C163 186 157 192 150 196"/>
  </g>
</svg>
`;

await mkdir(OUT_DIR, { recursive: true });
const buf = Buffer.from(svg);
await sharp(buf, { density: 384 }).resize(1024, 1024).png({ compressionLevel: 9 }).toFile(OUT);
await sharp(buf, { density: 384 }).resize(256, 256).png({ compressionLevel: 9 }).toFile(ICON);
console.log(`Wrote ${OUT} and ${ICON}`);
