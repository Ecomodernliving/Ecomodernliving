import type { NewsletterIssue } from "@/lib/newsletter/issues";

/**
 * Outbound webhook for n8n (LLM / RAG enrichment pipelines).
 * Set N8N_NEWSLETTER_WEBHOOK_URL to receive draft/approve/publish events.
 */
export async function notifyNewsletterWebhook(
  event:
    | "draft.composed"
    | "draft.updated"
    | "issue.approved"
    | "issue.published",
  payload: { issue: NewsletterIssue; meta?: Record<string, unknown> }
): Promise<void> {
  const url = process.env.N8N_NEWSLETTER_WEBHOOK_URL?.trim();
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        issueId: payload.issue.id,
        status: payload.issue.status,
        subject: payload.issue.subject,
        weekKey: payload.issue.weekKey,
        sourcePayload: payload.issue.sourcePayload,
        sections: {
          ecoProductPicks: payload.issue.ecoProductPicks,
          aiSmartHomeTrends: payload.issue.aiSmartHomeTrends,
          energySavingTips: payload.issue.energySavingTips,
          passiveHouseEducation: payload.issue.passiveHouseEducation,
        },
        airtableRecordId: payload.issue.airtableRecordId,
        meta: payload.meta,
        at: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error(
      "[newsletter/webhook]",
      err instanceof Error ? err.message : err
    );
  }
}
