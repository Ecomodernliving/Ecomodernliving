import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { isAdminResponse, requireAdmin } from "@/lib/auth/require-admin";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (isAdminResponse(admin)) return admin;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const slug =
      String(formData.get("slug") ?? "general")
        .trim()
        .replace(/[^a-z0-9-]/gi, "") || "general";

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image must be 5 MB or smaller." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Use JPEG, PNG, WebP, or GIF." },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // Production-grade persistent storage via Vercel Blob (token is auto-injected
    // once a Blob store is connected to the project in the Vercel dashboard).
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`products/${slug}/${safeName}`, file, {
        access: "public",
        contentType: file.type,
      });
      return NextResponse.json({ ok: true, imageUrl: blob.url });
    }

    // On a serverless host with no Blob store, the filesystem is read-only/ephemeral.
    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          error:
            "Image uploads need a Vercel Blob store. Add one in the Vercel dashboard (Storage → Blob) and redeploy, or paste an image URL / leave blank to use the Amazon ASIN image.",
        },
        { status: 400 }
      );
    }

    // Local dev: persist to the public folder so it's served statically.
    const dir = path.join(process.cwd(), "public", "images", "products", slug);
    await fs.mkdir(dir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(dir, safeName), buffer);

    return NextResponse.json({
      ok: true,
      imageUrl: `/images/products/${slug}/${safeName}`,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to upload image." },
      { status: 500 }
    );
  }
}
