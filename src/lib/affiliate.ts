import { siteConfig } from "@/config/site";

export function applyAffiliateTag(amazonUrl: string): string {
  const tag = siteConfig.amazonAffiliateTag;
  if (!tag) return amazonUrl;

  try {
    const url = new URL(amazonUrl);
    if (!url.hostname.includes("amazon.com")) return amazonUrl;

    url.searchParams.set("tag", tag);

    // Product detail pages — direct links keep your tag on this exact product
    if (
      url.pathname.includes("/dp/") ||
      url.pathname.includes("/gp/product/") ||
      url.pathname.includes("/gp/aw/d/")
    ) {
      url.searchParams.set("linkCode", "ogi");
    } else if (url.pathname === "/s" || url.pathname.startsWith("/s/")) {
      // Search fallback — tag applies to landing page only; product clicks may drop it
      url.searchParams.set("linkCode", "ll2");
    }

    return url.toString();
  } catch {
    return amazonUrl;
  }
}

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

export function resolveProductAffiliateUrl(product: {
  name: string;
  amazonUrl?: string;
  amazonQuery?: string;
  amazonAsin?: string;
}): string {
  if (product.amazonUrl) return applyAffiliateTag(product.amazonUrl);
  return amazonAffiliateUrl(product.amazonQuery ?? product.name, product.amazonAsin);
}

export const affiliateRel = "noopener noreferrer sponsored";
