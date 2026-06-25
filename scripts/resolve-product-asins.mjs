/**
 * Resolve Amazon ASINs for product names (cached in data/product-asin-cache.json).
 * Run: node scripts/resolve-product-asins.mjs
 */
import fs from "fs";
import path from "path";

const CACHE_PATH = path.join("data", "product-asin-cache.json");
const DELAY_MS = 600;

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

async function searchAmazonAsin(query) {
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();
  const match = html.match(/\/dp\/([A-Z0-9]{10})/i);
  return match ? match[1].toUpperCase() : null;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Product names from envelope catalog + any missing from CSV
const namesToResolve = [
  "Andersen 400 Series Double-Hung Window",
  "Pella 250 Series Vinyl Window",
  "Marvin Essential Casement Window",
  "Velux Fixed Skylight",
  "Milgard Tuscany Vinyl Window",
  "Jeld-Wen V-4500 Vinyl Window",
  "Andersen A-Series Triple-Pane Window",
  "Pella Impervia Fiberglass Window",
  "Kolbe Ultra Triple-Glazed Window",
  "Alpen High Performance Fiberglass Window",
  "Wasco Tubular Skylight Kit",
  "VELUX Solar Powered Skylight",
  "Therma-Tru Fiberglass Entry Door",
  "Andersen E-Series Aluminum-Clad Window",
  "Marvin Ultimate Double-Hung Window",
  "Rockwool ComfortBatt Mineral Wool Insulation",
  "Owens Corning R-30 Fiberglass Batts",
  "Johns Manville Formaldehyde-Free Batts",
  "CertainTeed Sustainable Insulation",
  "ROCKWOOL Safe'n'Sound Soundproofing",
  "Applegate Cellulose Insulation",
  "Greenfiber Cellulose Blow-In Insulation",
  "Kingspan Kooltherm Rigid Foam Board",
  "Hunter XCI Polyiso Insulation Board",
  "ZIP System R-Sheathing Panel",
  "Huber ZIP System Tape",
  "3M All Weather Flashing Tape",
  "Tyvek HomeWrap Weather Barrier",
  "Henry Blueskin VP100 Air Barrier",
  "Pro Clima INTELLO Plus Vapor Control",
  "Pro Clima TESCON VANA Airtight Tape",
  "SIGA Fentrim Airtight Window Tape",
  "475 High Performance Building Supply Membrane",
  "Zehnder ComfoAir ERV System",
  "Broan HRV Heat Recovery Ventilator",
  "Fantech HRV with Heat Recovery",
  "Aldes ERV Ventilation Unit",
  "Lunos E2 Through-Wall Ventilator",
  "Renson Healthbox 3 Smart Ventilation",
  "AeroBarrier Airtightness Sealing System",
  "Blower Door Test Kit",
  "Red Energy Thermal Imaging Camera",
  "Flir Thermal Camera for Building Envelope",
  "SIGA Majvest Windtight Membrane",
  "Pro Clima SOLITEX Mento Plus WRB",
  "GAF Timberline HDZ Cool Roof Shingles",
  "Owens Corning Duration Cool Shingles",
  "CertainTeed Landmark ClimateFlex Shingles",
  "Metal Sales Standing Seam Roofing Panel",
  "EPDM Rubber Roofing Membrane",
  "TPO White Reflective Roofing Membrane",
  "Green Roof Sedum Tray System",
  "LiveRoof Modular Green Roof System",
  "Solar Roof Flashing Kit",
  "Ridge Vent with External Baffle",
  "Marmoleum Click Linoleum Flooring",
  "Cali Bamboo Fossilized Bamboo Flooring",
  "Torlys Cork Flooring Planks",
  "Kahrs Engineered Wood Flooring",
  "COREtec Plus Luxury Vinyl Plank",
  "Forbo Marmoleum Sheet Flooring",
  "Green Building Supply Cork Tiles",
  "Reclaimed Wood Flooring Planks",
  "Wool Carpet Natural Fiber",
  "Interface Carbon Neutral Carpet Tile",
];

const cache = loadCache();
let resolved = 0;
let skipped = 0;
let failed = 0;

for (const name of namesToResolve) {
  if (cache[name]?.asin) {
    skipped++;
    continue;
  }

  process.stdout.write(`Resolving: ${name.slice(0, 50)}... `);
  try {
    const asin = await searchAmazonAsin(name);
    if (asin) {
      cache[name] = { asin, resolvedAt: new Date().toISOString() };
      resolved++;
      console.log(asin);
    } else {
      cache[name] = { asin: null, resolvedAt: new Date().toISOString() };
      failed++;
      console.log("not found");
    }
  } catch (err) {
    failed++;
    console.log(`error: ${err.message}`);
  }

  saveCache(cache);
  await sleep(DELAY_MS);
}

console.log(`\nDone: ${resolved} resolved, ${skipped} cached, ${failed} failed/missing`);
console.log(`Cache: ${CACHE_PATH}`);
