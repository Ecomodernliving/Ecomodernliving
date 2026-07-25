import { NextRequest, NextResponse } from "next/server";
import { isAdminResponse, requireAdmin } from "@/lib/auth/require-admin";
import { buildWeeklyNewsletterHtml } from "@/lib/email/weekly-newsletter";
import { getNewsletterIssue } from "@/lib/newsletter/issues";
import { ADMIN_EMAIL } from "@/lib/auth/admin";

/**
 * Renders the exact HTML email for an issue (admin preview only).
 * Open in browser: /api/admin/newsletter/preview?id=<issueId>
 */
export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (isAdminResponse(admin)) return admin;

  const id = request.nextUrl.searchParams.get("id")?.trim();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const issue = await getNewsletterIssue(id);
  if (!issue) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  const html = buildWeeklyNewsletterHtml(issue, ADMIN_EMAIL);
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
