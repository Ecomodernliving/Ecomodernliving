import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { PageProduct } from "@/config/page-content";
import type { AffiliateStore } from "@/lib/affiliate-stores";
import { AFFILIATE_STORES } from "@/lib/affiliate-stores";
import { isAdminResponse, requireAdmin } from "@/lib/auth/require-admin";
import { productKey } from "@/lib/marketplace-product-utils";
import {
  removeAdminProduct,
  upsertAdminProduct,
} from "@/lib/marketplace-admin";

function parseProduct(body: Record<string, unknown>): PageProduct | null {
  const name = String(body.name ?? "").trim();
  const affiliateUrl = String(body.affiliateUrl ?? "").trim();
  if (!name || !affiliateUrl.startsWith("http")) return null;

  const store = String(body.store ?? "Amazon") as AffiliateStore;
  if (!AFFILIATE_STORES.includes(store)) return null;

  const asin = String(body.amazonAsin ?? "").trim().toUpperCase();
  const imageUrl = String(body.imageUrl ?? "").trim();

  return {
    name,
    description:
      String(body.description ?? "").trim() ||
      "Curated eco-friendly pick for sustainable modern homes.",
    tag: String(body.tag ?? "").trim() || undefined,
    store,
    affiliateUrl,
    imageUrl: imageUrl || undefined,
    amazonAsin: /^[A-Z0-9]{10}$/.test(asin) ? asin : undefined,
  };
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (isAdminResponse(admin)) return admin;

  try {
    const body = await request.json();
    const slug = String(body.slug ?? "").trim();
    const originalKey = String(body.originalKey ?? "").trim() || undefined;

    if (!slug) {
      return NextResponse.json({ error: "Category slug is required." }, { status: 400 });
    }

    const product = parseProduct(body);
    if (!product) {
      return NextResponse.json(
        { error: "Name and a valid affiliate URL are required." },
        { status: 400 }
      );
    }

    const products = await upsertAdminProduct(slug, product, originalKey);
    revalidatePath(`/marketplace/${slug}`);
    revalidatePath("/marketplace");

    return NextResponse.json({
      ok: true,
      product,
      key: productKey(product),
      products,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to save product." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (isAdminResponse(admin)) return admin;

  try {
    const body = await request.json();
    const slug = String(body.slug ?? "").trim();
    const key = String(body.key ?? "").trim();

    if (!slug || !key) {
      return NextResponse.json(
        { error: "Slug and product key are required." },
        { status: 400 }
      );
    }

    const products = await removeAdminProduct(slug, key);
    revalidatePath(`/marketplace/${slug}`);
    revalidatePath("/marketplace");

    return NextResponse.json({ ok: true, products });
  } catch {
    return NextResponse.json(
      { error: "Unable to remove product." },
      { status: 500 }
    );
  }
}
