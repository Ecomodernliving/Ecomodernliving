import fs from "fs/promises";
import path from "path";
import type { PageProduct } from "@/config/page-content";
import { productKey } from "@/lib/marketplace-product-utils";
import { ensureSchema, getSql, isDbConfigured } from "@/lib/db";

export { productKey };

const ADMIN_CATALOG_PATH = path.join(
  process.cwd(),
  "data",
  "admin-catalog.json"
);

export type AdminCatalog = Record<string, PageProduct[]>;

/** Internal shape used by the filesystem fallback; `__hidden` marks a tombstone. */
type StoredAdminProduct = PageProduct & { __hidden?: boolean };

/** Rebuild a minimal product from a "Store::Name" key (for tombstones). */
function productFromKey(key: string): StoredAdminProduct {
  const sep = key.indexOf("::");
  const store = sep >= 0 ? key.slice(0, sep) : "Amazon";
  const name = sep >= 0 ? key.slice(sep + 2) : key;
  return {
    name,
    description: "",
    store: store as PageProduct["store"],
    __hidden: true,
  };
}

// ---------------------------------------------------------------------------
// Filesystem store (local dev fallback when no database is configured)
// ---------------------------------------------------------------------------
async function fsReadCatalog(): Promise<AdminCatalog> {
  try {
    const raw = await fs.readFile(ADMIN_CATALOG_PATH, "utf8");
    return JSON.parse(raw) as AdminCatalog;
  } catch {
    return {};
  }
}

async function fsWriteCatalog(catalog: AdminCatalog): Promise<void> {
  await fs.mkdir(path.dirname(ADMIN_CATALOG_PATH), { recursive: true });
  await fs.writeFile(
    ADMIN_CATALOG_PATH,
    JSON.stringify(catalog, null, 2),
    "utf8"
  );
}

// ---------------------------------------------------------------------------
// Shared merge helper
// ---------------------------------------------------------------------------
export function mergeWithAdminProducts(
  base: PageProduct[],
  admin: PageProduct[]
): PageProduct[] {
  const map = new Map<string, PageProduct>();
  for (const p of base) map.set(productKey(p), p);
  for (const p of admin) map.set(productKey(p), p);
  return Array.from(map.values());
}

// ---------------------------------------------------------------------------
// Public API — uses Postgres when configured, else filesystem
// ---------------------------------------------------------------------------
type AdminProductRow = { slug: string; data: PageProduct };

export async function readAdminCatalog(): Promise<AdminCatalog> {
  if (isDbConfigured()) {
    await ensureSchema();
    const sql = getSql();
    const rows = (await sql`
      SELECT slug, data FROM admin_products WHERE hidden = false ORDER BY slug, position
    `) as AdminProductRow[];
    const catalog: AdminCatalog = {};
    for (const row of rows) {
      (catalog[row.slug] ??= []).push(row.data);
    }
    return catalog;
  }
  const catalog = await fsReadCatalog();
  const visible: AdminCatalog = {};
  for (const [slug, list] of Object.entries(catalog)) {
    visible[slug] = (list as StoredAdminProduct[]).filter((p) => !p.__hidden);
  }
  return visible;
}

export async function readAdminProductsForSlug(
  slug: string
): Promise<PageProduct[]> {
  if (isDbConfigured()) {
    await ensureSchema();
    const sql = getSql();
    const rows = (await sql`
      SELECT slug, data FROM admin_products WHERE slug = ${slug} AND hidden = false ORDER BY position
    `) as AdminProductRow[];
    return rows.map((r) => r.data);
  }
  const catalog = await fsReadCatalog();
  return (catalog[slug] ?? []).filter(
    (p) => !(p as StoredAdminProduct).__hidden
  );
}

/** Keys of products explicitly removed for a category (built-in or admin). */
export async function readHiddenKeysForSlug(
  slug: string
): Promise<Set<string>> {
  if (isDbConfigured()) {
    await ensureSchema();
    const sql = getSql();
    const rows = (await sql`
      SELECT product_key FROM admin_products WHERE slug = ${slug} AND hidden = true
    `) as { product_key: string }[];
    return new Set(rows.map((r) => r.product_key));
  }
  const catalog = await fsReadCatalog();
  const hidden = (catalog[slug] ?? [])
    .filter((p) => (p as StoredAdminProduct).__hidden)
    .map((p) => productKey(p));
  return new Set(hidden);
}

export async function upsertAdminProduct(
  slug: string,
  product: PageProduct,
  originalKey?: string
): Promise<PageProduct[]> {
  const key = productKey(product);

  if (isDbConfigured()) {
    await ensureSchema();
    const sql = getSql();
    if (originalKey && originalKey !== key) {
      await sql`
        DELETE FROM admin_products WHERE slug = ${slug} AND product_key = ${originalKey}
      `;
    }
    await sql`
      INSERT INTO admin_products (slug, product_key, data, hidden, updated_at)
      VALUES (${slug}, ${key}, ${JSON.stringify(product)}::jsonb, false, now())
      ON CONFLICT (slug, product_key)
      DO UPDATE SET data = EXCLUDED.data, hidden = false, updated_at = now()
    `;
    return readAdminProductsForSlug(slug);
  }

  const catalog = await fsReadCatalog();
  const list = [...(catalog[slug] ?? [])];
  if (originalKey && originalKey !== key) {
    const idx = list.findIndex((p) => productKey(p) === originalKey);
    if (idx >= 0) list.splice(idx, 1);
  }
  const existingIdx = list.findIndex((p) => productKey(p) === key);
  if (existingIdx >= 0) list[existingIdx] = product;
  else list.push(product);
  catalog[slug] = list;
  await fsWriteCatalog(catalog);
  return list.filter((p) => !(p as StoredAdminProduct).__hidden);
}

export async function removeAdminProduct(
  slug: string,
  key: string
): Promise<PageProduct[]> {
  if (isDbConfigured()) {
    await ensureSchema();
    const sql = getSql();
    // Tombstone the key so built-in catalog items stay removed too.
    await sql`
      INSERT INTO admin_products (slug, product_key, data, hidden, updated_at)
      VALUES (${slug}, ${key}, '{}'::jsonb, true, now())
      ON CONFLICT (slug, product_key)
      DO UPDATE SET hidden = true, updated_at = now()
    `;
    return readAdminProductsForSlug(slug);
  }

  const catalog = await fsReadCatalog();
  const list = (catalog[slug] ?? []).filter((p) => productKey(p) !== key);
  list.push(productFromKey(key));
  catalog[slug] = list;
  await fsWriteCatalog(catalog);
  return list.filter((p) => !(p as StoredAdminProduct).__hidden);
}
