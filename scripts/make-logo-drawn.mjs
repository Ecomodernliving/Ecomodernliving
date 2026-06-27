import sharp from "sharp";
import path from "node:path";

// Hand-drawn, old-emblem style EcoModern Living logo.
// Single-ink green line art (modern shed-roof eco-home) inside a ring,
// with a filled leaf sweeping across the lower-right. Pure vector, so it
// stays crisp at every size.

const OUT = path.resolve("public/images/logo.png");
const ICON = path.resolve("src/app/icon.png");

const INK = "#15512b"; // dark forest outline ink
const GREEN = "#2f8f3e"; // leaf / ring fill

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="1024" height="1024">
  <g fill="none" stroke="${INK}" stroke-width="9"
     stroke-linecap="round" stroke-linejoin="round">

    <!-- outer ring -->
    <circle cx="128" cy="128" r="116" stroke="${GREEN}" stroke-width="11"/>

    <!-- ground line -->
    <path d="M52 176 H170" stroke-width="10"/>

    <!-- house silhouette: shed (mono-pitch) roof -->
    <path d="M60 124 L178 84" stroke-width="13"/>   <!-- roof -->
    <path d="M74 176 V120"/>                          <!-- left wall -->
    <path d="M162 176 V90"/>                          <!-- right wall -->

    <!-- big modern window (left bay) -->
    <rect x="84" y="112" width="42" height="40" rx="3" stroke-width="7"/>
    <path d="M105 112 V152 M84 132 H126" stroke-width="5"/>

    <!-- vertical wood-slat cladding (right bay) -->
    <path d="M138 104 V168 M148 100 V168 M157 96 V168" stroke-width="5"/>

    <!-- door -->
    <rect x="84" y="154" width="24" height="22" rx="2" stroke-width="6"/>
  </g>

  <!-- leaf, tucked into the lower-right corner -->
  <path d="M206 116 C214 160 190 202 132 214 C162 184 188 156 206 116 Z"
        fill="${GREEN}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M201 124 C180 158 160 186 138 210"
        fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
  <g fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round">
    <path d="M188 144 C183 152 177 157 170 161"/>
    <path d="M176 164 C171 172 165 177 159 181"/>
    <path d="M164 184 C160 191 155 196 150 199"/>
  </g>
</svg>
`;

const buf = Buffer.from(svg);

await sharp(buf, { density: 384 }).resize(1024, 1024).png({ compressionLevel: 9 }).toFile(OUT);
await sharp(buf, { density: 384 }).resize(256, 256).png({ compressionLevel: 9 }).toFile(ICON);

console.log(`Wrote ${OUT} and ${ICON}`);
