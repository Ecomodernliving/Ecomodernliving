import type { NavIconName } from "@/config/navigation";
import { passiveHouseFaqs } from "@/config/passive-house-faq";
import {
  getAllNavLinks,
  getPageCategory,
  type PageCategory,
} from "@/lib/navigation-utils";
import { getMarketplaceCatalog } from "@/lib/marketplace-catalog";
import { groupProductsByName } from "@/lib/marketplace-product-utils";

export type SearchResultType = "page" | "product" | "faq";

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  href: string;
  external?: boolean;
  icon?: NavIconName;
  category?: string;
};

type IndexEntry = SearchResult & {
  /** Extra terms (slug, store, tag…) matched against but not displayed. */
  keywords: string;
};

const CATEGORY_LABELS: Record<PageCategory, string> = {
  marketplace: "Marketplace",
  ai: "AI Tools",
  guides: "Guides",
  "passive-house": "Passive House",
  services: "Services",
  community: "Community",
  utility: "Page",
};

const TYPE_WEIGHT: Record<SearchResultType, number> = {
  page: 2,
  product: 1.5,
  faq: 1,
};

function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

function titleCaseSlug(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

let indexPromise: Promise<IndexEntry[]> | null = null;

async function buildIndex(): Promise<IndexEntry[]> {
  const entries: IndexEntry[] = [];

  // Pages & sections (internal nav links only).
  for (const link of getAllNavLinks()) {
    const category = getPageCategory(link.href);
    entries.push({
      id: `page:${link.href}`,
      type: "page",
      title: link.label,
      subtitle: link.description ? truncate(link.description) : undefined,
      href: link.href,
      icon: link.icon,
      category: CATEGORY_LABELS[category],
      keywords: `${category} ${link.badge ?? ""}`,
    });
  }

  // Marketplace products (deduped across stores by name, per category).
  try {
    const catalog = await getMarketplaceCatalog();
    for (const [slug, products] of Object.entries(catalog)) {
      const label = titleCaseSlug(slug);
      for (const group of groupProductsByName(products)) {
        const stores = group.listings.map((l) => l.store);
        entries.push({
          id: `product:${slug}:${group.id}`,
          type: "product",
          title: group.name,
          subtitle: group.description ? truncate(group.description) : undefined,
          href: `/marketplace/${slug}`,
          category: label,
          keywords: `${slug} ${label} ${group.tag ?? ""} ${stores.join(" ")}`,
        });
      }
    }
  } catch {
    // Catalog is best-effort; pages/FAQ still searchable if it fails.
  }

  // Passive House FAQ entries.
  for (const faq of passiveHouseFaqs) {
    entries.push({
      id: `faq:${faq.id}`,
      type: "faq",
      title: faq.question,
      subtitle: truncate(faq.answer),
      href: "/passive-house-faq",
      category: faq.category,
      keywords: `faq ${faq.category}`,
    });
  }

  return entries;
}

function getIndex(): Promise<IndexEntry[]> {
  if (!indexPromise) {
    indexPromise = buildIndex().catch((err) => {
      indexPromise = null;
      throw err;
    });
  }
  return indexPromise;
}

function scoreEntry(entry: IndexEntry, tokens: string[], query: string): number {
  const title = entry.title.toLowerCase();
  const subtitle = (entry.subtitle ?? "").toLowerCase();
  const keywords = entry.keywords.toLowerCase();

  let score = 0;
  for (const token of tokens) {
    const inTitle = title.includes(token);
    const inSubtitle = subtitle.includes(token);
    const inKeywords = keywords.includes(token);
    if (!inTitle && !inSubtitle && !inKeywords) return -1; // require every token

    if (title.startsWith(token)) score += 6;
    else if (inTitle) score += 3;
    if (inSubtitle) score += 1;
    if (inKeywords) score += 1;
  }

  if (title === query) score += 12;
  else if (title.includes(query)) score += 4;

  return score + TYPE_WEIGHT[entry.type];
}

export async function searchSite(
  query: string,
  limit = 20
): Promise<SearchResult[]> {
  const normalized = query.trim().toLowerCase();
  if (normalized.length < 2) return [];
  const tokens = normalized.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const index = await getIndex();
  const scored: { entry: IndexEntry; score: number }[] = [];
  for (const entry of index) {
    const score = scoreEntry(entry, tokens, normalized);
    if (score > 0) scored.push({ entry, score });
  }

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ entry }) => {
    const { keywords: _keywords, ...result } = entry;
    void _keywords;
    return result;
  });
}
