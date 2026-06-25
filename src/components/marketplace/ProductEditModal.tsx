"use client";

import { useEffect, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import type { PageProduct } from "@/config/page-content";
import { AFFILIATE_STORES, type AffiliateStore } from "@/lib/affiliate-stores";
import { productKey } from "@/lib/marketplace-product-utils";

type ProductEditModalProps = {
  open: boolean;
  slug: string;
  product?: PageProduct | null;
  originalKey?: string;
  onClose: () => void;
  onSaved: (product: PageProduct) => void;
};

export function ProductEditModal({
  open,
  slug,
  product,
  originalKey,
  onClose,
  onSaved,
}: ProductEditModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [store, setStore] = useState<AffiliateStore>("Amazon");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [amazonAsin, setAmazonAsin] = useState("");
  const [tag, setTag] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(product?.name ?? "");
    setDescription(product?.description ?? "");
    setStore(product?.store ?? "Amazon");
    setAffiliateUrl(product?.affiliateUrl ?? product?.amazonUrl ?? "");
    setImageUrl(product?.imageUrl ?? "");
    setAmazonAsin(product?.amazonAsin ?? "");
    setTag(product?.tag ?? "");
    setError("");
  }, [open, product]);

  if (!open) return null;

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slug", slug);
      const res = await fetch("/api/admin/products/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }
      setImageUrl(data.imageUrl);
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          slug,
          originalKey,
          name,
          description,
          store,
          affiliateUrl,
          imageUrl,
          amazonAsin,
          tag,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Unable to save product");
        return;
      }
      onSaved(data.product);
      onClose();
    } catch {
      setError("Unable to save product. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-forest-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-sage-200 bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-forest-950">
              {product ? "Edit product" : "Add product"}
            </h2>
            <p className="mt-1 text-xs text-sage-500">
              {slug.replace(/-/g, " ")} · Admin only
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg text-sage-500 hover:bg-sage-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-sage-700">
              Product name *
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-sage-200 bg-cream-50 px-4 py-2.5 text-sm focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-sage-700">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-xl border border-sage-200 bg-cream-50 px-4 py-2.5 text-sm focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-sage-700">
                Store *
              </label>
              <select
                value={store}
                onChange={(e) => setStore(e.target.value as AffiliateStore)}
                className="w-full rounded-xl border border-sage-200 bg-cream-50 px-4 py-2.5 text-sm focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100"
              >
                {AFFILIATE_STORES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-sage-700">
                Tag
              </label>
              <input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Editor's Choice"
                className="w-full rounded-xl border border-sage-200 bg-cream-50 px-4 py-2.5 text-sm focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-sage-700">
              Affiliate / product URL *
            </label>
            <input
              required
              type="url"
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              placeholder="https://www.amazon.com/dp/..."
              className="w-full rounded-xl border border-sage-200 bg-cream-50 px-4 py-2.5 text-sm focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-sage-700">
              Amazon ASIN
            </label>
            <input
              value={amazonAsin}
              onChange={(e) => setAmazonAsin(e.target.value)}
              placeholder="B08HRWWCTR"
              className="w-full rounded-xl border border-sage-200 bg-cream-50 px-4 py-2.5 text-sm focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-sage-700">
              Product image
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... or upload below"
                className="min-w-0 flex-1 rounded-xl border border-sage-200 bg-cream-50 px-4 py-2.5 text-sm focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100"
              />
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-forest-200 bg-forest-50 px-4 py-2.5 text-sm font-medium text-forest-700 hover:bg-forest-100">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Upload
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleImageUpload(file);
                  }}
                />
              </label>
            </div>
            {imageUrl && (
              <p className="mt-2 truncate text-xs text-sage-500">{imageUrl}</p>
            )}
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-sage-200 px-4 text-sm font-medium text-sage-600 hover:bg-sage-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-forest-600 px-4 text-sm font-semibold text-white hover:bg-forest-700 disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
