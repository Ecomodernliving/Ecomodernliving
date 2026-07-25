import { sendWeeklyNewsletterEmail } from "@/lib/email/weekly-newsletter";
import {
  getNewsletterIssue,
  getNextIssueToSend,
  markNewsletterIssueSent,
  type NewsletterIssue,
} from "@/lib/newsletter/issues";
import { listActiveSubscriberEmails } from "@/lib/newsletter/subscribers";
import { notifyNewsletterWebhook } from "@/lib/newsletter/webhook";

export type WeeklySendResult = {
  issueId: string;
  subject: string;
  attempted: number;
  sent: number;
  failed: number;
  errors: string[];
};

const BATCH_SIZE = 8;

async function deliverIssue(
  issue: NewsletterIssue
): Promise<WeeklySendResult> {
  if (issue.status === "sent") {
    return {
      issueId: issue.id,
      subject: issue.subject,
      attempted: 0,
      sent: 0,
      failed: 0,
      errors: ["Issue already sent"],
    };
  }

  if (issue.status !== "approved") {
    return {
      issueId: issue.id,
      subject: issue.subject,
      attempted: 0,
      sent: 0,
      failed: 0,
      errors: [
        `Issue must be approved before send (current: ${issue.status})`,
      ],
    };
  }

  const emails = await listActiveSubscriberEmails();
  if (emails.length === 0) {
    return {
      issueId: issue.id,
      subject: issue.subject,
      attempted: 0,
      sent: 0,
      failed: 0,
      errors: ["No active subscribers"],
    };
  }

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async (email) => {
        const result = await sendWeeklyNewsletterEmail(issue, email);
        return { email, result };
      })
    );

    for (const { email, result } of results) {
      if (result.ok) {
        sent += 1;
      } else {
        failed += 1;
        if (errors.length < 10) {
          errors.push(`${email}: ${result.error}`);
        }
      }
    }
  }

  if (sent > 0) {
    await markNewsletterIssueSent(issue.id);
    const published = { ...issue, status: "sent" as const };
    await notifyNewsletterWebhook("issue.published", { issue: published });
  }

  return {
    issueId: issue.id,
    subject: issue.subject,
    attempted: emails.length,
    sent,
    failed,
    errors,
  };
}

/** Send a specific approved issue (admin "Send now"). */
export async function sendWeeklyIssueById(
  id: string
): Promise<WeeklySendResult | { error: string }> {
  const issue = await getNewsletterIssue(id);
  if (!issue) return { error: "Issue not found" };
  if (issue.status === "sent") return { error: "Issue already sent" };
  if (issue.status !== "approved") {
    return {
      error: "Approve this issue before sending (human gate).",
    };
  }
  return deliverIssue(issue);
}

/** Cron: send the next approved issue, if any. */
export async function sendNextWeeklyIssue(): Promise<
  WeeklySendResult | { skipped: true; reason: string }
> {
  const issue = await getNextIssueToSend();
  if (!issue) {
    return { skipped: true, reason: "No approved issue ready to send" };
  }
  return deliverIssue(issue);
}
