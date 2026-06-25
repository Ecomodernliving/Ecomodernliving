import { applyAffiliateTag, amazonAffiliateUrl } from "@/lib/affiliate";
import type { PageProduct } from "@/config/page-content";

export type AffiliateStore =
  | "Amazon"
  | "Home Depot"
  | "Lowe's"
  | "Wayfair"
  | "Target";

export const AFFILIATE_STORES: AffiliateStore[] = [
  "Amazon",
  "Home Depot",
  "Lowe's",
  "Wayfair",
  "Target",
];

export const storeStyles: Record<
  AffiliateStore,
  { badge: string; button: string; ring: string; dot: string }
> = {
  Amazon: {
    badge: "bg-[#FF9900] text-black",
    button: "bg-[#FF9900] hover:bg-[#e88b00] text-black",
    ring: "ring-[#FF9900]/30",
    dot: "bg-[#FF9900]",
  },
  "Home Depot": {
    badge: "bg-[#F96302] text-white",
    button: "bg-[#F96302] hover:bg-[#d95502] text-white",
    ring: "ring-[#F96302]/30",
    dot: "bg-[#F96302]",
  },
  "Lowe's": {
    badge: "bg-[#004990] text-white",
    button: "bg-[#004990] hover:bg-[#003a75] text-white",
    ring: "ring-[#004990]/30",
    dot: "bg-[#004990]",
  },
  Wayfair: {
    badge: "bg-[#7B189F] text-white",
    button: "bg-[#7B189F] hover:bg-[#651580] text-white",
    ring: "ring-[#7B189F]/30",
    dot: "bg-[#7B189F]",
  },
  Target: {
    badge: "bg-[#CC0000] text-white",
    button: "bg-[#CC0000] hover:bg-[#a80000] text-white",
    ring: "ring-[#CC0000]/30",
    dot: "bg-[#CC0000]",
  },
};

export function amazonImageFromAsin(asin: string): string {
  return `https://m.media-amazon.com/images/P/${asin}.01._SL400_.jpg`;
}

export const PLACEHOLDER_IMAGE = "/images/product-placeholder.svg";

const CATEGORY_IMAGES: Record<string, string> = {
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
  "eco-paints":
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=400&fit=crop&q=80",
  "heat-pumps":
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=400&fit=crop&q=80",
  "water-fixtures":
    "https://images.unsplash.com/photo-1585705276555-3273c2933b8e?w=400&h=400&fit=crop&q=80",
};

export function isPlaceholderImage(url?: string): boolean {
  if (!url) return true;
  return url === PLACEHOLDER_IMAGE || url.endsWith("/product-placeholder.svg");
}

export function categoryImageForSlug(slug?: string): string {
  if (slug && CATEGORY_IMAGES[slug]) return CATEGORY_IMAGES[slug];
  return PLACEHOLDER_IMAGE;
}

export function buildStoreSearchUrl(store: AffiliateStore, query: string): string {
  const q = encodeURIComponent(query);
  switch (store) {
    case "Amazon":
      return amazonAffiliateUrl(query);
    case "Home Depot":
      return `https://www.homedepot.com/s/${q}?NCNI-5`;
    case "Lowe's":
      return `https://www.lowes.com/search?searchTerm=${q}`;
    case "Wayfair":
      return `https://www.wayfair.com/keyword.php?keyword=${q}`;
    case "Target":
      return `https://www.target.com/s?searchTerm=${q}`;
    default:
      return amazonAffiliateUrl(query);
  }
}

export function resolveCatalogProductUrl(product: PageProduct): string {
  if (product.affiliateUrl) {
    if (product.store === "Amazon" || product.affiliateUrl.includes("amazon.com")) {
      return applyAffiliateTag(product.affiliateUrl);
    }
    return product.affiliateUrl;
  }
  if (product.amazonUrl) return applyAffiliateTag(product.amazonUrl);
  if (product.store && product.store !== "Amazon") {
    return buildStoreSearchUrl(product.store, product.amazonQuery ?? product.name);
  }
  return amazonAffiliateUrl(product.amazonQuery ?? product.name, product.amazonAsin);
}

export function getProductImage(product: PageProduct, slug?: string): string {
  if (product.imageUrl && !isPlaceholderImage(product.imageUrl)) {
    return product.imageUrl;
  }
  if (product.amazonAsin) return amazonImageFromAsin(product.amazonAsin);
  return categoryImageForSlug(slug);
}

export function getProductStore(product: PageProduct): AffiliateStore {
  return product.store ?? "Amazon";
}
