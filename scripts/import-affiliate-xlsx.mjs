/**
 * Import products from Eco Modern Living - Affiliate.xlsx
 * Run: node scripts/import-affiliate-xlsx.mjs [path-to-xlsx]
 */
import fs from "fs";
import path from "path";
import XLSX from "xlsx";

const defaultPath =
  "C:/Users/segar/Downloads/Eco Modern Living - Affiliate.xlsx";

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

function extractAsin(url) {
  if (!url) return "";
  const str = String(url);
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/i,
    /\/gp\/product\/([A-Z0-9]{10})/i,
    /\/gp\/aw\/d\/([A-Z0-9]{10})/i,
  ];
  for (const pattern of patterns) {
    const match = str.match(pattern);
    if (match) return match[1].toUpperCase();
  }
  return "";
}

function cleanAffiliateUrl(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    // Keep direct product links; strip noisy search params but keep tag + linkCode
    const asin = extractAsin(parsed.href);
    if (!asin) return parsed.href;
    const clean = new URL(`https://www.amazon.com/dp/${asin}`);
    if (parsed.searchParams.get("tag")) {
      clean.searchParams.set("tag", parsed.searchParams.get("tag"));
    }
    if (parsed.searchParams.get("linkCode")) {
      clean.searchParams.set("linkCode", parsed.searchParams.get("linkCode"));
    }
    return clean.toString();
  } catch {
    return url;
  }
}

function escapeCsv(value = "") {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const xlsxPath = process.argv[2] || defaultPath;
if (!fs.existsSync(xlsxPath)) {
  console.error("File not found:", xlsxPath);
  process.exit(1);
}

const wb = XLSX.readFile(xlsxPath);
const sheetName = wb.SheetNames[0];
const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: "" });

const products = [];
const seen = new Map();

for (const row of rows) {
  const category = row.Category?.trim();
  const name = row["Product Title"]?.trim();
  const affiliateUrl =
    row["URL with Amazon Affilaite id"]?.trim() ||
    row["URL with Amazon Affiliate id"]?.trim() ||
    "";
  const searchUrl = row["Amazon URL"]?.trim() || "";

  if (!category || !name) continue;

  const key = `${category}::${name}`;
  const asin = extractAsin(affiliateUrl) || extractAsin(searchUrl);
  const slug = categoryToSlug[category] ?? "";
  const amazonUrl = cleanAffiliateUrl(affiliateUrl) || searchUrl;

  const candidate = {
    category,
    slug,
    name,
    asin,
    amazonUrl,
    searchUrl,
    hasAffiliate: Boolean(affiliateUrl),
  };

  const existing = seen.get(key);
  if (!existing || (candidate.hasAffiliate && !existing.hasAffiliate)) {
    seen.set(key, candidate);
  }
}

for (const p of seen.values()) {
  products.push(p);
}

// Write Google Sheets CSV
const csvHeaders = [
  "category",
  "slug",
  "product_name",
  "asin",
  "amazon_url",
  "description",
  "tag",
];
const csvLines = [csvHeaders.join(",")];
for (const p of products) {
  csvLines.push(
    [
      escapeCsv(p.category),
      escapeCsv(p.slug),
      escapeCsv(p.name),
      escapeCsv(p.asin),
      escapeCsv(p.amazonUrl),
      escapeCsv("Curated eco-friendly pick for sustainable modern homes."),
      escapeCsv(""),
    ].join(",")
  );
}

fs.mkdirSync("data", { recursive: true });
fs.writeFileSync("data/marketplace-products.csv", csvLines.join("\n"), "utf8");

// Regenerate marketplace-products.ts grouped by slug
const bySlug = {};
for (const p of products) {
  if (!p.slug) continue;
  if (!bySlug[p.slug]) bySlug[p.slug] = [];
  bySlug[p.slug].push(p);
}

let ts = `/**
 * Amazon marketplace product catalog — imported from affiliate spreadsheet.
 * Regenerate: node scripts/import-affiliate-xlsx.mjs
 *
 * Prefer editing data/marketplace-products.csv or Google Sheet (MARKETPLACE_SHEET_CSV_URL).
 */

import type { PageProduct } from "./page-content";

function product(
  name: string,
  amazonUrl: string,
  description = "Curated eco-friendly pick for sustainable modern homes.",
  tag?: string
): PageProduct {
  return { name, amazonUrl, description, tag: tag || undefined };
}

export const marketplaceProducts: Record<string, PageProduct[]> = {
`;

for (const slug of Object.keys(bySlug).sort()) {
  ts += `  "${slug}": [\n`;
  for (const p of bySlug[slug]) {
    const url = p.amazonUrl.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const name = p.name.replace(/"/g, '\\"');
    ts += `    product("${name}", "${url}"),\n`;
  }
  ts += `  ],\n`;
}
ts += `};\n`;

fs.writeFileSync("src/config/marketplace-products.ts", ts, "utf8");

const withAsin = products.filter((p) => p.asin).length;
console.log(`Imported ${products.length} products (${withAsin} with ASIN)`);
console.log("Updated data/marketplace-products.csv");
console.log("Updated src/config/marketplace-products.ts");
