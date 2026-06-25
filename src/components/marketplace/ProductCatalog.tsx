"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Pencil, Plus, Search, Store } from "lucide-react";
import type { PageProduct } from "@/config/page-content";
import { useAuth } from "@/components/auth/AuthProvider";
import { isAdminEmail } from "@/lib/auth/admin";
import { ProductEditModal } from "@/components/marketplace/ProductEditModal";
import {
  groupProductsByName,
  productKey,
  type GroupedProduct,
} from "@/lib/marketplace-product-utils";
import {
  AFFILIATE_STORES,
  amazonImageFromAsin,
  categoryImageForSlug,
  getProductImage,
  getProductStore,
  storeStyles,
  type AffiliateStore,
} from "@/lib/affiliate-stores";
import { affiliateRel } from "@/lib/affiliate";

const PAGE_SIZE = 12;

type ProductCatalogProps = {
  products: PageProduct[];
  catalogSlug?: string;
};

function ProductCardImage({
  product,
  catalogSlug,
}: {
  product: PageProduct;
  catalogSlug?: string;
}) {
  const primary = getProductImage(product, catalogSlug);
  const [src, setSrc] = useState(primary);

  const handleError = () => {
    if (product.amazonAsin && !src.includes(product.amazonAsin)) {
      setSrc(amazonImageFromAsin(product.amazonAsin));
      return;
    }
    const category = categoryImageForSlug(catalogSlug);
    if (src !== category) setSrc(category);
  };

  const isExternal = src.startsWith("http");

  return (
    <Image
      src={src}
      alt={product.name}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      unoptimized={isExternal}
      onError={handleError}
    />
  );
}

function StoreDot({ store }: { store: AffiliateStore }) {
  const style = storeStyles[store];
  return (
    <span
      className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white ${style.dot}`}
      aria-hidden="true"
    />
  );
}

function GroupedProductCard({
  group,
  catalogSlug,
  isAdmin,
  onEdit,
}: {
  group: GroupedProduct;
  catalogSlug?: string;
  isAdmin: boolean;
  onEdit: (product: PageProduct) => void;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-sage-200/80 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-2 hover:ring-forest-200/60">
      <div className="relative aspect-[4/3] overflow-hidden bg-sage-50 sm:aspect-square">
        <ProductCardImage product={group.imageProduct} catalogSlug={catalogSlug} />
        {group.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-forest-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
            {group.tag}
          </span>
        )}
        {isAdmin && catalogSlug && (
          <button
            type="button"
            onClick={() => onEdit(group.primaryProduct)}
            className="absolute right-3 top-3 inline-flex min-h-9 min-w-9 items-center justify-center rounded-full bg-white/95 text-forest-700 shadow-md ring-1 ring-sage-200/80 transition-colors hover:bg-forest-600 hover:text-white"
            aria-label={`Edit ${group.name}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-display text-base font-semibold leading-snug text-forest-900 group-hover:text-forest-700 sm:text-lg">
          {group.name}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-sage-600">
          {group.description}
        </p>
        {group.priceRange && (
          <p className="mt-2 text-xs font-semibold text-sage-500">{group.priceRange}</p>
        )}

        <div className="mt-4 border-t border-sage-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-sage-500">
            Available at
          </p>
          <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-2">
            {group.listings.map(({ store }) => (
              <li key={store} className="inline-flex items-center gap-2 text-sm text-sage-700">
                <StoreDot store={store} />
                <span className="font-medium">{store}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {group.listings.map(({ store, url }) => {
            const style = storeStyles[store];
            return (
              <a
                key={store}
                href={url}
                target="_blank"
                rel={affiliateRel}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${style.button}`}
              >
                View Price on {store}
                <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              </a>
            );
          })}
        </div>
      </div>
    </article>
  );
}

export function ProductCatalog({ products: initialProducts, catalogSlug }: ProductCatalogProps) {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = isAdminEmail(user?.email);

  const [items, setItems] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [storeFilter, setStoreFilter] = useState<AffiliateStore | "All">("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [editOpen, setEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PageProduct | null>(null);
  const [editingKey, setEditingKey] = useState<string | undefined>();

  function openAdd() {
    setEditingProduct(null);
    setEditingKey(undefined);
    setEditOpen(true);
  }

  function openEdit(product: PageProduct) {
    setEditingProduct(product);
    setEditingKey(productKey(product));
    setEditOpen(true);
  }

  function handleSaved(product: PageProduct) {
    const key = productKey(product);
    setItems((prev) => {
      const map = new Map(prev.map((p) => [productKey(p), p]));
      if (editingKey && editingKey !== key) map.delete(editingKey);
      map.set(key, product);
      return Array.from(map.values());
    });
    router.refresh();
  }

  const grouped = useMemo(() => groupProductsByName(items), [items]);

  const storesInCatalog = useMemo(() => {
    const set = new Set<AffiliateStore>();
    for (const p of items) set.add(getProductStore(p));
    return AFFILIATE_STORES.filter((s) => set.has(s));
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return grouped.filter((group) => {
      if (storeFilter !== "All") {
        if (!group.listings.some((l) => l.store === storeFilter)) return false;
      }
      if (!q) return true;
      return (
        group.name.toLowerCase().includes(q) ||
        group.description.toLowerCase().includes(q) ||
        group.listings.some((l) => l.store.toLowerCase().includes(q)) ||
        (group.tag?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [grouped, query, storeFilter]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <div id="products" className="space-y-6">
      <div className="rounded-2xl border border-sage-200/70 bg-white/90 p-4 shadow-sm sm:p-5">
        {isAdmin && catalogSlug && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
            <p className="text-xs font-medium text-amber-900">
              Admin mode — edit or add Top Picks for this category
            </p>
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-forest-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-forest-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Add product
            </button>
          </div>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sage-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Search products..."
              className="w-full rounded-full border border-sage-200 bg-cream-50 py-2.5 pl-10 pr-4 text-sm text-sage-800 placeholder:text-sage-400 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100"
            />
          </div>
          <p className="text-center text-xs text-sage-500 sm:text-right">
            <span className="font-semibold text-forest-700">{filtered.length}</span>{" "}
            product{filtered.length !== 1 ? "s" : ""}
            {storeFilter !== "All" && (
              <span>
                {" "}
                at <span className="font-medium">{storeFilter}</span>
              </span>
            )}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setStoreFilter("All");
              setVisible(PAGE_SIZE);
            }}
            className={`inline-flex min-h-9 items-center rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              storeFilter === "All"
                ? "bg-forest-600 text-white shadow-sm"
                : "border border-sage-200 bg-white text-sage-600 hover:border-forest-200 hover:text-forest-700"
            }`}
          >
            All stores
          </button>
          {storesInCatalog.map((store) => {
            const style = storeStyles[store];
            return (
              <button
                key={store}
                type="button"
                onClick={() => {
                  setStoreFilter(store);
                  setVisible(PAGE_SIZE);
                }}
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  storeFilter === store
                    ? `${style.badge} shadow-sm`
                    : "border border-sage-200 bg-white text-sage-600 hover:border-forest-200 hover:text-forest-700"
                }`}
              >
                <StoreDot store={store} />
                {store}
              </button>
            );
          })}
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sage-200 bg-sage-50/50 px-6 py-12 text-center">
          <Store className="mx-auto h-8 w-8 text-sage-400" />
          <p className="mt-3 text-sm font-medium text-sage-700">No products match your search</p>
          <p className="mt-1 text-xs text-sage-500">Try a different keyword or store filter</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((group) => (
            <GroupedProductCard
              key={group.id}
              group={group}
              catalogSlug={catalogSlug}
              isAdmin={isAdmin}
              onEdit={openEdit}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-forest-200 bg-white px-6 py-2.5 text-sm font-semibold text-forest-700 shadow-sm transition-colors hover:bg-forest-50"
          >
            Load more products
            <span className="text-xs font-normal text-sage-500">
              ({filtered.length - visible} remaining)
            </span>
          </button>
        </div>
      )}

      <p className="text-center text-xs text-sage-500">
        We may earn commissions from qualifying purchases at Amazon, Home Depot, Lowe&apos;s,
        Wayfair, Target &amp; other partners.{" "}
        <Link href="/affiliate-disclosure" className="font-medium text-forest-600 hover:underline">
          Affiliate Disclosure
        </Link>
      </p>

      {catalogSlug && (
        <ProductEditModal
          open={editOpen}
          slug={catalogSlug}
          product={editingProduct}
          originalKey={editingKey}
          onClose={() => setEditOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
