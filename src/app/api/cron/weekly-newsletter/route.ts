import { NextRequest, NextResponse } from "next/server";
import { sendNextWeeklyIssue } from "@/lib/newsletter/send-weekly";

/**
 * Vercel Cron (and manual curl) entrypoint.
 * Auth: Authorization: Bearer $CRON_SECRET
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
    const result = await sendNextWeeklyIssue();
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Send failed";
    console.error("[cron/weekly-newsletter]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
