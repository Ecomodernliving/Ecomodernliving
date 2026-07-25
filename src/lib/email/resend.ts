type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  headers?: Record<string, string>;
};

export type SendEmailResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Send transactional email via Resend.
 */
export async function sendResendEmail({
  to,
  subject,
  html,
  replyTo,
  headers,
}: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      error:
        "RESEND_API_KEY is missing. Add it to .env.local (from resend.com → API Keys) and restart the server.",
    };
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "EcoModern Living <onboarding@resend.dev>";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
        ...(headers ? { headers } : {}),
      }),
    });

    if (response.ok) return { ok: true };

    const body = (await response.json().catch(() => null)) as {
      message?: string;
      name?: string;
    } | null;

    const detail = body?.message || body?.name || `Resend HTTP ${response.status}`;
    console.error("[resend] send failed:", detail);
    return { ok: false, error: detail };
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Network error talking to Resend";
    console.error("[resend] send error:", detail);
    return { ok: false, error: detail };
  }
}
