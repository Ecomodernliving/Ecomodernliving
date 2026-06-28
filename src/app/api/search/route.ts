import { NextResponse } from "next/server";
import { searchSite } from "@/lib/search";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const limitParam = Number(searchParams.get("limit"));
  const limit =
    Number.isFinite(limitParam) && limitParam > 0
      ? Math.min(limitParam, 50)
      : 20;

  try {
    const results = await searchSite(query, limit);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { error: "Search is temporarily unavailable.", results: [] },
      { status: 500 }
    );
  }
}
