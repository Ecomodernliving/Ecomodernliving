import { NextRequest, NextResponse } from "next/server";
import { composeWeeklyDraft } from "@/lib/newsletter/compose-weekly";
import {
  approveNewsletterIssue,
  getNewsletterIssue,
  parseSection,
  updateNewsletterIssue,
} from "@/lib/newsletter/issues";
import { sendWeeklyIssueById } from "@/lib/newsletter/send-weekly";
import { notifyNewsletterWebhook } from "@/lib/newsletter/webhook";

/**
 * Inbound hook for n8n (and similar automation).
 * Auth: Authorization: Bearer $NEWSLETTER_HOOK_SECRET
 *
 * Actions:
 *   compose  — Phase 1 auto-draft from site content → Airtable
 *   update   — push LLM-enriched section copy back onto an issue
 *   approve  — mark approved (optional publishNow)
 *   publish  — send approved issue to subscribers
 */
function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function assertHookAuth(request: NextRequest): boolean {
  const secret = process.env.NEWSLETTER_HOOK_SECRET?.trim();
  if (!secret) return false;
  const auth = request.headers.get("authorization") ?? "";
  return auth === `Bearer ${secret}`;
}

export async function POST(request: NextRequest) {
  if (!assertHookAuth(request)) return unauthorized();

  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = typeof body.action === "string" ? body.action : "";

  try {
    if (action === "compose") {
      const result = await composeWeeklyDraft({
        force: body.force === true,
      });
      return NextResponse.json(result);
    }

    if (action === "update") {
      const id = typeof body.id === "string" ? body.id : "";
      if (!id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
      }

      const patch: Parameters<typeof updateNewsletterIssue>[1] = {};
      if (typeof body.subject === "string") patch.subject = body.subject;
      if (typeof body.previewText === "string") {
        patch.previewText = body.previewText;
      }
      for (const key of [
        "ecoProductPicks",
        "aiSmartHomeTrends",
        "energySavingTips",
        "passiveHouseEducation",
      ] as const) {
        if (body[key]) patch[key] = parseSection(body[key]);
      }

      const issue = await updateNewsletterIssue(id, patch);
      if (!issue) {
        return NextResponse.json({ error: "Issue not found" }, { status: 404 });
      }
      await notifyNewsletterWebhook("draft.updated", { issue });
      return NextResponse.json({ issue });
    }

    if (action === "approve") {
      const id = typeof body.id === "string" ? body.id : "";
      if (!id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
      }
      const issue = await approveNewsletterIssue(id);
      if (!issue) {
        return NextResponse.json({ error: "Issue not found" }, { status: 404 });
      }
      await notifyNewsletterWebhook("issue.approved", { issue });

      if (body.publishNow === true) {
        const send = await sendWeeklyIssueById(id);
        return NextResponse.json({ issue, send });
      }
      return NextResponse.json({ issue });
    }

    if (action === "publish") {
      const id = typeof body.id === "string" ? body.id : "";
      if (!id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
      }
      const existing = await getNewsletterIssue(id);
      if (!existing) {
        return NextResponse.json({ error: "Issue not found" }, { status: 404 });
      }
      if (existing.status !== "approved" && existing.status !== "sent") {
        await approveNewsletterIssue(id);
      }
      const send = await sendWeeklyIssueById(id);
      return NextResponse.json({ send });
    }

    return NextResponse.json(
      {
        error:
          "Unknown action. Use compose | update | approve | publish",
      },
      { status: 400 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Hook failed";
    console.error("[hooks/newsletter]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (!assertHookAuth(request)) return unauthorized();
  return NextResponse.json({
    ok: true,
    actions: ["compose", "update", "approve", "publish"],
  });
}
