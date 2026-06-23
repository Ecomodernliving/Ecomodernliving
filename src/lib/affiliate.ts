import { siteConfig } from "@/config/site";

export function amazonAffiliateUrl(searchQuery: string, asin?: string): string {
  const tag = siteConfig.amazonAffiliateTag;

  if (asin) {
    const base = `https://www.amazon.com/dp/${asin}`;
    return tag ? `${base}?tag=${tag}` : base;
  }

  const q = encodeURIComponent(searchQuery);
  const base = `https://www.amazon.com/s?k=${q}`;
  return tag ? `${base}&tag=${tag}` : base;
}

export const affiliateRel = "noopener noreferrer sponsored";
