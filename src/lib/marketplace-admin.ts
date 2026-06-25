import fs from "fs/promises";
import path from "path";
import type { PageProduct } from "@/config/page-content";
import { productKey } from "@/lib/marketplace-product-utils";

export { productKey };

const ADMIN_CATALOG_PATH = path.join(
  process.cwd(),
  "data",
  "admin-catalog.json"
);

export type AdminCatalog = Record<string, PageProduct[]>;

export async function readAdminCatalog(): Promise<AdminCatalog> {
  try {
    const raw = await fs.readFile(ADMIN_CATALOG_PATH, "utf8");
    return JSON.parse(raw) as AdminCatalog;
  } catch {
    return {};
  }
}

export async function writeAdminCatalog(catalog: AdminCatalog): Promise<void> {
  await fs.mkdir(path.dirname(ADMIN_CATALOG_PATH), { recursive: true });
  await fs.writeFile(ADMIN_CATALOG_PATH, JSON.stringify(catalog, null, 2), "utf8");
}

export function mergeWithAdminProducts(
  base: PageProduct[],
  admin: PageProduct[]
): PageProduct[] {
  const map = new Map<string, PageProduct>();
  for (const p of base) map.set(productKey(p), p);
  for (const p of admin) map.set(productKey(p), p);
  return Array.from(map.values());
}

export async function upsertAdminProduct(
  slug: string,
  product: PageProduct,
  originalKey?: string
): Promise<PageProduct[]> {
  const catalog = await readAdminCatalog();
  const list = [...(catalog[slug] ?? [])];

  if (originalKey && originalKey !== productKey(product)) {
    const idx = list.findIndex((p) => productKey(p) === originalKey);
    if (idx >= 0) list.splice(idx, 1);
  }

  const key = productKey(product);
  const existingIdx = list.findIndex((p) => productKey(p) === key);
  if (existingIdx >= 0) list[existingIdx] = product;
  else list.push(product);

  catalog[slug] = list;
  await writeAdminCatalog(catalog);
  return list;
}

export async function removeAdminProduct(
  slug: string,
  key: string
): Promise<PageProduct[]> {
  const catalog = await readAdminCatalog();
  const list = (catalog[slug] ?? []).filter((p) => productKey(p) !== key);
  catalog[slug] = list;
  await writeAdminCatalog(catalog);
  return list;
}
