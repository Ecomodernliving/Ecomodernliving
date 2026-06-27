import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
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

  // Vercel's filesystem is read-only, so uploaded files can't be saved/served.
  // Guide the admin to paste an image URL or use the ASIN's auto image instead.
  if (process.env.VERCEL) {
    return NextResponse.json(
      {
        error:
          "File uploads aren't supported on the live site. Paste an image URL, or leave it blank to use the Amazon image from the ASIN.",
      },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const slug = String(formData.get("slug") ?? "general")
      .trim()
      .replace(/[^a-z0-9-]/gi, "");

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
    const dir = path.join(process.cwd(), "public", "images", "products", slug);
    await fs.mkdir(dir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(dir, safeName);
    await fs.writeFile(filePath, buffer);

    const imageUrl = `/images/products/${slug}/${safeName}`;
    return NextResponse.json({ ok: true, imageUrl });
  } catch {
    return NextResponse.json(
      { error: "Unable to upload image." },
      { status: 500 }
    );
  }
}
