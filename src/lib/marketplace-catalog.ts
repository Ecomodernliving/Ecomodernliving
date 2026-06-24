import type { PageProduct } from "@/config/page-content";
import { marketplaceProducts as staticProducts } from "@/config/marketplace-products";

const ASIN_PATTERN = /^[A-Z0-9]{10}$/i;

/** Map spreadsheet "Category" labels → marketplace page slug */
export const categoryToSlug: Record<string, string> = {
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

function extractAsin(value: string): string | null {
  const trimmed = value.trim();
  if (ASIN_PATTERN.test(trimmed)) return trimmed.toUpperCase();

  const patterns = [
    /\/dp\/([A-Z0-9]{10})/i,
    /\/gp\/product\/([A-Z0-9]{10})/i,
    /\/gp\/aw\/d\/([A-Z0-9]{10})/i,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1].toUpperCase();
  }

  return null;
}

function toAmazonUrl(asin?: string, amazonUrl?: string): string | undefined {
  if (asin) return `https://www.amazon.com/dp/${asin}`;
  if (amazonUrl?.startsWith("http")) return amazonUrl;
  return undefined;
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
}

function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function rowToProduct(row: Record<string, string>): PageProduct | null {
  const name =
    row.product_name ||
    row.product_title ||
    row.name ||
    row.title ||
    "";
  if (!name) return null;

  const asin =
    extractAsin(row.asin || "") ||
    extractAsin(row.amazon_asin || "") ||
    extractAsin(row.amazon_url || "") ||
    extractAsin(row.url || "");

  const amazonUrl = toAmazonUrl(
    asin ?? undefined,
    row.amazon_url || row.url
  );

  if (!amazonUrl && row.amazon_url) {
    // Search URL fallback
    const url = row.amazon_url || row.url;
    if (url?.startsWith("http")) {
      return {
        name,
        amazonUrl: url,
        description:
          row.description ||
          "Curated eco-friendly pick for sustainable modern homes.",
        tag: row.tag || row.badge || undefined,
      };
    }
  }

  if (!amazonUrl) return null;

  return {
    name,
    amazonUrl,
    description:
      row.description ||
      "Curated eco-friendly pick for sustainable modern homes.",
    tag: row.tag || row.badge || undefined,
  };
}

function resolveSlug(row: Record<string, string>): string | null {
  const direct =
    row.slug ||
    row.page_slug ||
    row.marketplace_slug ||
    "";
  if (direct) return direct.trim();

  const category = row.category || row.category_name || "";
  return categoryToSlug[category.trim()] ?? null;
}

export function parseMarketplaceCsv(csv: string): Record<string, PageProduct[]> {
  const text = csv.replace(/^\uFEFF/, "").trim();
  if (!text) return {};

  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return {};

  const headers = parseCsvLine(lines[0]).map(normalizeHeader);
  const catalog: Record<string, PageProduct[]> = {};

  for (const line of lines.slice(1)) {
    const cells = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((header, i) => {
      row[header] = cells[i] ?? "";
    });

    const slug = resolveSlug(row);
    const product = rowToProduct(row);
    if (!slug || !product) continue;

    if (!catalog[slug]) catalog[slug] = [];
    if (!catalog[slug].some((p) => p.name === product.name)) {
      catalog[slug].push(product);
    }
  }

  return catalog;
}

async function fetchSheetCatalog(): Promise<Record<string, PageProduct[]> | null> {
  const sheetUrl = process.env.MARKETPLACE_SHEET_CSV_URL;
  if (!sheetUrl) return null;

  try {
    const response = await fetch(sheetUrl, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const csv = await response.text();
    const parsed = parseMarketplaceCsv(csv);
    return Object.keys(parsed).length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

let catalogCache: Promise<Record<string, PageProduct[]>> | null = null;

export function getMarketplaceCatalog(): Promise<Record<string, PageProduct[]>> {
  if (!catalogCache) {
    catalogCache = (async () => {
      const fromSheet = await fetchSheetCatalog();
      if (fromSheet) return fromSheet;
      return staticProducts;
    })();
  }
  return catalogCache;
}

export async function getProductsForSlug(slug: string): Promise<PageProduct[]> {
  const catalog = await getMarketplaceCatalog();
  return catalog[slug] ?? [];
}
