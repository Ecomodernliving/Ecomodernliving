import { NextRequest, NextResponse } from "next/server";
import { composeWeeklyDraft } from "@/lib/newsletter/compose-weekly";

/**
 * Saturday auto-compose (and manual curl with CRON_SECRET).
 * Builds a pending_approval draft in Airtable / fallback store.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured" },
      { status: 500 }
    );
  }

  const auth = request.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await composeWeeklyDraft();
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Compose failed";
    console.error("[cron/compose-newsletter]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
