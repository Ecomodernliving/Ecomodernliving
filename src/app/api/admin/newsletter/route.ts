import { NextRequest, NextResponse } from "next/server";
import { isAdminResponse, requireAdmin } from "@/lib/auth/require-admin";
import { isAirtableConfigured } from "@/lib/airtable";
import { composeWeeklyDraft } from "@/lib/newsletter/compose-weekly";
import {
  approveNewsletterIssue,
  createNewsletterIssue,
  listNewsletterIssues,
  updateNewsletterIssue,
  type NewsletterSection,
} from "@/lib/newsletter/issues";
import { sendWeeklyIssueById } from "@/lib/newsletter/send-weekly";
import { notifyNewsletterWebhook } from "@/lib/newsletter/webhook";

function parseSectionRequired(value: unknown): NewsletterSection | null {
  if (!value || typeof value !== "object") return null;
  const s = value as Record<string, unknown>;
  if (typeof s.title !== "string" || typeof s.body !== "string") return null;
  return {
    title: s.title,
    body: s.body,
    linkLabel: typeof s.linkLabel === "string" ? s.linkLabel : undefined,
    linkHref: typeof s.linkHref === "string" ? s.linkHref : undefined,
  };
}

export async function GET() {
  const admin = await requireAdmin();
  if (isAdminResponse(admin)) return admin;

  try {
    const issues = await listNewsletterIssues();
    return NextResponse.json({
      issues,
      airtable: isAirtableConfigured(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load issues";
    console.error("[admin/newsletter GET]", message);
    return NextResponse.json(
      { error: message, airtable: isAirtableConfigured(), issues: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (isAdminResponse(admin)) return admin;

  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = typeof body.action === "string" ? body.action : "create";

  if (action === "compose") {
    const result = await composeWeeklyDraft({
      force: body.force === true,
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json(result);
  }

  if (action === "approve") {
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) {
      return NextResponse.json({ error: "Missing issue id" }, { status: 400 });
    }
    const issue = await approveNewsletterIssue(id);
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }
    await notifyNewsletterWebhook("issue.approved", { issue });

    if (body.publishNow === true) {
      const send = await sendWeeklyIssueById(id);
      if ("error" in send) {
        return NextResponse.json({ issue, publishError: send.error });
      }
      return NextResponse.json({ issue, send });
    }

    return NextResponse.json({ issue });
  }

  if (action === "update") {
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) {
      return NextResponse.json({ error: "Missing issue id" }, { status: 400 });
    }

    const patch: Parameters<typeof updateNewsletterIssue>[1] = {};
    if (typeof body.subject === "string") patch.subject = body.subject;
    if (typeof body.previewText === "string") patch.previewText = body.previewText;
    for (const key of [
      "ecoProductPicks",
      "aiSmartHomeTrends",
      "energySavingTips",
      "passiveHouseEducation",
    ] as const) {
      if (body[key]) {
        const section = parseSectionRequired(body[key]);
        if (section) patch[key] = section;
      }
    }

    const issue = await updateNewsletterIssue(id, patch);
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }
    await notifyNewsletterWebhook("draft.updated", { issue });
    return NextResponse.json({ issue });
  }

  if (action === "send") {
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) {
      return NextResponse.json({ error: "Missing issue id" }, { status: 400 });
    }
    const result = await sendWeeklyIssueById(id);
    if ("error" in result) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result);
  }

  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  if (!subject) {
    return NextResponse.json({ error: "Subject is required" }, { status: 400 });
  }

  const ecoProductPicks = parseSectionRequired(body.ecoProductPicks);
  const aiSmartHomeTrends = parseSectionRequired(body.aiSmartHomeTrends);
  const energySavingTips = parseSectionRequired(body.energySavingTips);
  const passiveHouseEducation = parseSectionRequired(body.passiveHouseEducation);

  if (
    !ecoProductPicks ||
    !aiSmartHomeTrends ||
    !energySavingTips ||
    !passiveHouseEducation
  ) {
    return NextResponse.json(
      { error: "All four sections need a title and body" },
      { status: 400 }
    );
  }

  if (
    !ecoProductPicks.body.trim() ||
    !aiSmartHomeTrends.body.trim() ||
    !energySavingTips.body.trim() ||
    !passiveHouseEducation.body.trim()
  ) {
    return NextResponse.json(
      { error: "Each section body is required" },
      { status: 400 }
    );
  }

  const issue = await createNewsletterIssue({
    subject,
    previewText:
      typeof body.previewText === "string" ? body.previewText : undefined,
    ecoProductPicks,
    aiSmartHomeTrends,
    energySavingTips,
    passiveHouseEducation,
    status: "pending_approval",
    scheduledFor:
      typeof body.scheduledFor === "string" && body.scheduledFor
        ? body.scheduledFor
        : null,
  });

  return NextResponse.json({ issue }, { status: 201 });
}
