/**
 * Build multi-store marketplace catalog (200+ products).
 * Run: node scripts/build-product-catalog.mjs
 */
import fs from "fs";
import path from "path";

const STORES = ["Amazon", "Home Depot", "Lowe's", "Wayfair", "Target"];

const categoryToSlug = {
  "Smart Thermostats": "smart-thermostats",
  "Smart Power Management": "smart-home",
  "HVAC & Heat Pumps": "heat-pumps",
  "Energy Efficient Appliances": "smart-home",
  "Water Conservation": "water-fixtures",
  "Sustainable Bathroom": "water-fixtures",
  "Healthy Home": "air-purifiers",
  "Non-Toxic Home": "furniture",
  "Sustainable Kitchen": "composting",
  "Solar & Backup Power": "solar",
  "Smart Home Automation": "smart-home",
  "Smart Garden": "indoor-gardening",
  "Electric Yard Equipment": "smart-home",
  "Home Wellness": "air-purifiers",
  "Eco-Friendly Office": "furniture",
  "EV Chargers": "ev-chargers",
  "Air Purifiers": "air-purifiers",
  "Water Saving Fixtures": "water-fixtures",
  "Indoor Gardening Systems": "indoor-gardening",
  "Composting Systems": "composting",
  "Solar Products": "solar",
  "Eco Paints": "eco-paints",
};

const envelopeProducts = {
  windows: [
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
  ],
  insulation: [
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
  ],
  "passive-house-materials": [
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
  ],
  "green-roofing": [
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
  ],
  flooring: [
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
  ],
};

function extractAsin(value = "") {
  const patterns = [/\/dp\/([A-Z0-9]{10})/i, /\/gp\/product\/([A-Z0-9]{10})/i];
  for (const p of patterns) {
    const m = String(value).match(p);
    if (m) return m[1].toUpperCase();
  }
  if (/^[A-Z0-9]{10}$/i.test(value.trim())) return value.trim().toUpperCase();
  return "";
}

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
    } else current += char;
  }
  cells.push(current.trim());
  return cells;
}

function storeUrl(store, name, asin, amazonUrl) {
  const q = encodeURIComponent(name);
  if (store === "Amazon") {
    if (asin) return `https://www.amazon.com/dp/${asin}`;
    if (amazonUrl?.startsWith("http")) return amazonUrl;
    return `https://www.amazon.com/s?k=${q}`;
  }
  if (store === "Home Depot") return `https://www.homedepot.com/s/${q}`;
  if (store === "Lowe's") return `https://www.lowes.com/search?searchTerm=${q}`;
  if (store === "Wayfair") return `https://www.wayfair.com/keyword.php?keyword=${q}`;
  if (store === "Target") return `https://www.target.com/s?searchTerm=${q}`;
  return `https://www.amazon.com/s?k=${q}`;
}

function loadAsinCache() {
  const cachePath = path.join("data", "product-asin-cache.json");
  if (!fs.existsSync(cachePath)) return {};
  try {
    return JSON.parse(fs.readFileSync(cachePath, "utf8"));
  } catch {
    return {};
  }
}

const CATEGORY_IMAGES = {
  windows:
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=400&fit=crop&q=80",
  insulation:
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop&q=80",
  "passive-house-materials":
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop&q=80",
  "green-roofing":
    "https://images.unsplash.com/photo-1513467535657-dde9c9efeb96?w=400&h=400&fit=crop&q=80",
  flooring:
    "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400&h=400&fit=crop&q=80",
};

function amazonImage(asin) {
  return `https://m.media-amazon.com/images/P/${asin}.01._SL400_.jpg`;
}

function imageFor(asin, slug) {
  if (asin) return amazonImage(asin);
  return CATEGORY_IMAGES[slug] || "/images/product-placeholder.svg";
}

function resolveNameAsin(name, asinCache) {
  const cached = asinCache[name]?.asin;
  if (cached) return cached;
  return "";
}

function propagateImages(catalog) {
  for (const [slug, products] of Object.entries(catalog)) {
    const byName = new Map();
    for (const p of products) {
      const asin = p.amazonAsin || extractAsin(p.affiliateUrl || "");
      const img =
        p.imageUrl && !p.imageUrl.includes("product-placeholder")
          ? p.imageUrl
          : asin
            ? amazonImage(asin)
            : null;
      if (!byName.has(p.name)) byName.set(p.name, { asin, imageUrl: img });
      else {
        const existing = byName.get(p.name);
        if (!existing.asin && asin) existing.asin = asin;
        if (!existing.imageUrl && img) existing.imageUrl = img;
      }
    }

    for (const p of products) {
      const best = byName.get(p.name);
      if (best?.asin && !p.amazonAsin) p.amazonAsin = best.asin;
      const needsImage =
        !p.imageUrl || p.imageUrl.includes("product-placeholder");
      if (needsImage && best?.imageUrl) p.imageUrl = best.imageUrl;
      else if (needsImage && best?.asin) p.imageUrl = amazonImage(best.asin);
      else if (needsImage && CATEGORY_IMAGES[slug]) p.imageUrl = CATEGORY_IMAGES[slug];
    }
  }
}

function pickStores(name, slug, primary = "Amazon") {
  const building = ["windows", "insulation", "passive-house-materials", "green-roofing", "flooring", "eco-paints", "heat-pumps", "water-fixtures"];
  if (building.includes(slug)) {
    return [primary, "Home Depot", "Lowe's"];
  }
  if (slug === "furniture" || slug === "composting") {
    return [primary, "Amazon", "Wayfair", "Target"];
  }
  return [primary];
}

function addProduct(catalog, slug, entry) {
  if (!catalog[slug]) catalog[slug] = [];
  const key = `${entry.store}::${entry.name}`;
  if (catalog[slug].some((p) => `${p.store}::${p.name}` === key)) return;
  catalog[slug].push(entry);
}

// Parse CSV
const csvPath = path.join("data", "marketplace-products.csv");
const csv = fs.readFileSync(csvPath, "utf8");
const lines = csv.replace(/^\uFEFF/, "").trim().split(/\r?\n/);
const headers = parseCsvLine(lines[0]).map((h) =>
  h.toLowerCase().replace(/\s+/g, "_")
);

const catalog = {};
const asinCache = loadAsinCache();

for (const line of lines.slice(1)) {
  if (!line.trim()) continue;
  const cells = parseCsvLine(line);
  const row = {};
  headers.forEach((h, i) => {
    row[h] = cells[i] ?? "";
  });

  const slug = row.slug || categoryToSlug[row.category] || "";
  const name = row.product_name || "";
  if (!slug || !name) continue;

  const asin = extractAsin(row.asin) || extractAsin(row.amazon_url);
  const stores = pickStores(name, slug, "Amazon");

  for (const store of stores) {
    addProduct(catalog, slug, {
      name,
      description: row.description || "Curated eco-friendly pick for sustainable modern homes.",
      tag: row.tag || undefined,
      store,
      imageUrl: imageFor(asin, slug),
      affiliateUrl: storeUrl(store, name, asin, row.amazon_url),
      amazonAsin: asin || undefined,
    });
  }
}

// Envelope & missing category products across stores
for (const [slug, names] of Object.entries(envelopeProducts)) {
  for (const name of names) {
    const storeRotation =
      slug === "windows" || slug === "insulation"
        ? ["Amazon", "Home Depot", "Lowe's", "Wayfair"]
        : ["Amazon", "Home Depot", "Lowe's"];

    for (const store of storeRotation) {
      const asin = resolveNameAsin(name, asinCache);
      addProduct(catalog, slug, {
        name,
        description: `High-performance ${slug.replace(/-/g, " ")} product — verify specs for your climate zone and project.`,
        store,
        imageUrl: imageFor(asin, slug),
        affiliateUrl: storeUrl(store, name, asin, ""),
        amazonAsin: asin || undefined,
      });
    }
  }
}

// Cross-list popular products to related slugs
const crossList = {
  windows: ["heat-pumps", "passive-house-materials"],
  insulation: ["passive-house-materials", "windows"],
  "passive-house-materials": ["insulation", "windows", "heat-pumps"],
  "heat-pumps": ["passive-house-materials", "smart-home"],
  solar: ["smart-home", "ev-chargers"],
};

for (const [source, targets] of Object.entries(crossList)) {
  const sourceProducts = catalog[source] ?? [];
  for (const target of targets) {
    for (const p of sourceProducts.slice(0, 8)) {
      addProduct(catalog, target, { ...p });
    }
  }
}

propagateImages(catalog);

const total = Object.values(catalog).reduce((n, arr) => n + arr.length, 0);
const withAmazonImg = Object.values(catalog)
  .flat()
  .filter((p) => p.imageUrl?.includes("media-amazon") || p.imageUrl?.includes("ssl-images-amazon")).length;
const withCategoryImg = Object.values(catalog)
  .flat()
  .filter((p) => p.imageUrl?.includes("unsplash")).length;
const withPlaceholder = Object.values(catalog)
  .flat()
  .filter((p) => p.imageUrl?.includes("product-placeholder")).length;
const outPath = path.join("src", "data", "marketplace-catalog.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2));

console.log(`Built catalog: ${Object.keys(catalog).length} categories, ${total} product listings`);
console.log(`  Images: ${withAmazonImg} Amazon, ${withCategoryImg} category, ${withPlaceholder} placeholder`);
for (const slug of ["windows", "insulation", "passive-house-materials"]) {
  console.log(`  ${slug}: ${(catalog[slug] ?? []).length} products`);
}
