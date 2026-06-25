import type { PageProduct } from "@/config/page-content";
import {
  AFFILIATE_STORES,
  getProductStore,
  isPlaceholderImage,
  resolveCatalogProductUrl,
  type AffiliateStore,
} from "@/lib/affiliate-stores";

export const STORE_DISPLAY_ORDER: AffiliateStore[] = [...AFFILIATE_STORES];

export function productKey(product: PageProduct): string {
  return `${product.store ?? "Amazon"}::${product.name}`;
}

export function normalizeProductName(name: string): string {
  return name.trim().toLowerCase();
}

export type StoreListing = {
  store: AffiliateStore;
  url: string;
  product: PageProduct;
};

export type GroupedProduct = {
  id: string;
  name: string;
  description: string;
  tag?: string;
  priceRange?: string;
  imageProduct: PageProduct;
  primaryProduct: PageProduct;
  listings: StoreListing[];
};

function pickBestImageProduct(products: PageProduct[]): PageProduct {
  const withImage = products.find(
    (p) => p.imageUrl && !isPlaceholderImage(p.imageUrl)
  );
  if (withImage) return withImage;
  const amazon = products.find((p) => getProductStore(p) === "Amazon");
  if (amazon) return amazon;
  return products[0];
}

function pickPrimaryProduct(products: PageProduct[]): PageProduct {
  return (
    products.find((p) => getProductStore(p) === "Amazon") ??
    products[0]
  );
}

export function groupProductsByName(products: PageProduct[]): GroupedProduct[] {
  const map = new Map<string, PageProduct[]>();

  for (const product of products) {
    const key = normalizeProductName(product.name);
    const list = map.get(key) ?? [];
    list.push(product);
    map.set(key, list);
  }

  const grouped: GroupedProduct[] = [];

  for (const [, variants] of map) {
    const name = variants[0].name;
    const listings: StoreListing[] = [];

    for (const store of STORE_DISPLAY_ORDER) {
      const match = variants.find((p) => getProductStore(p) === store);
      if (match) {
        listings.push({
          store,
          url: resolveCatalogProductUrl(match),
          product: match,
        });
      }
    }

    for (const product of variants) {
      const store = getProductStore(product);
      if (!listings.some((l) => l.store === store)) {
        listings.push({
          store,
          url: resolveCatalogProductUrl(product),
          product,
        });
      }
    }

    grouped.push({
      id: normalizeProductName(name),
      name,
      description:
        variants.find((p) => p.description)?.description ??
        variants[0].description,
      tag: variants.find((p) => p.tag)?.tag,
      priceRange: variants.find((p) => p.priceRange)?.priceRange,
      imageProduct: pickBestImageProduct(variants),
      primaryProduct: pickPrimaryProduct(variants),
      listings,
    });
  }

  return grouped.sort((a, b) => a.name.localeCompare(b.name));
}

export function countUniqueProducts(products: PageProduct[]): number {
  return groupProductsByName(products).length;
}
