import { ADMIN_EMAIL } from "@/lib/auth/admin";
import { getSiteUrl, wrapEmailHtml } from "@/lib/email/layout";
import { sendResendEmail } from "@/lib/email/resend";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function infoRow(emoji: string, label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e8efe9;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="36" valign="top" style="font-size:18px;line-height:1.2;">${emoji}</td>
            <td valign="top">
              <p style="margin:0 0 2px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#788862;font-weight:700;">
                ${escapeHtml(label)}
              </p>
              <p style="margin:0;font-size:15px;line-height:1.45;color:#1b3b2d;font-weight:600;word-break:break-word;">
                ${value}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

/** Branded admin alert for a new contact submission. */
export async function sendContactAdminEmail(
  payload: ContactPayload
): Promise<boolean> {
  const siteUrl = getSiteUrl();
  const heroUrl = `${siteUrl}/images/hero-passive-house.jpg`;
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, "<br/>");

  const body = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
      <tr>
        <td style="padding:0;line-height:0;font-size:0;">
          <img src="${heroUrl}" alt="" width="504"
               style="display:block;width:100%;max-width:504px;height:auto;border:0;border-radius:14px;" />
        </td>
      </tr>
    </table>

    <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#2d6f4e;font-weight:700;">
      Contact form
    </p>
    <h1 style="font-size:22px;margin:0 0 10px;color:#1b3b2d;font-weight:800;">
      New message received
    </h1>
    <p style="margin:0 0 18px;font-size:14px;line-height:1.55;color:#5e6c4d;">
      Someone submitted the contact form on EcoModern Living.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background:#fbfdfb;border:1px solid #e2ebe4;border-radius:14px;margin:0 0 16px;">
      ${infoRow("👤", "Name", escapeHtml(payload.name))}
      ${infoRow(
        "✉️",
        "Email",
        `<a href="mailto:${escapeHtml(payload.email)}" style="color:#2d6f4e;text-decoration:none;">${escapeHtml(payload.email)}</a>`
      )}
      ${infoRow("💬", "Message", safeMessage)}
    </table>

    <p style="margin:0;">
      <a href="mailto:${escapeHtml(payload.email)}?subject=${encodeURIComponent(`Re: Your EcoModern Living message`)}"
         style="display:inline-block;background:#1b3b2d;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:999px;font-size:14px;font-weight:700;">
        Reply to ${escapeHtml(payload.name)}
      </a>
    </p>
  `;

  const result = await sendResendEmail({
    to: ADMIN_EMAIL,
    subject: `Contact — ${payload.name}`,
    html: wrapEmailHtml(body, {
      previewText: `New contact from ${payload.name}: ${payload.message.slice(0, 80)}`,
      reason: "Internal notification for EcoModern Living admins.",
    }),
    replyTo: payload.email,
  });

  return result.ok;
}

/** Branded confirmation to the person who contacted you. */
export async function sendContactConfirmationEmail(
  payload: ContactPayload
): Promise<boolean> {
  const siteUrl = getSiteUrl();
  const heroUrl = `${siteUrl}/images/hero-passive-house.jpg`;

  const body = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
      <tr>
        <td style="padding:0;line-height:0;font-size:0;">
          <img src="${heroUrl}" alt="" width="504"
               style="display:block;width:100%;max-width:504px;height:auto;border:0;border-radius:14px;" />
        </td>
      </tr>
    </table>

    <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#2d6f4e;font-weight:700;">
      We got your message
    </p>
    <h1 style="font-size:22px;margin:0 0 10px;color:#1b3b2d;font-weight:800;">
      Thanks, ${escapeHtml(payload.name.split(" ")[0] || payload.name)}
    </h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#5e6c4d;">
      Thanks for reaching out to EcoModern Living. We typically reply within
      <strong style="color:#1b3b2d;">1–2 business days</strong>.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background:#f0f7f4;border:1px solid #e2ebe4;border-radius:14px;margin:0 0 18px;">
      <tr>
        <td style="padding:16px;">
          <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#788862;font-weight:700;">
            Your message
          </p>
          <p style="margin:0;font-size:14px;line-height:1.55;color:#1b3b2d;">
            ${escapeHtml(payload.message).replace(/\n/g, "<br/>")}
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 14px;font-size:14px;line-height:1.55;color:#5e6c4d;">
      While you wait, explore our free tools and guides:
    </p>
    <p style="margin:0;">
      <a href="${siteUrl}/ai/energy-audit"
         style="display:inline-block;background:#1b3b2d;color:#ffffff;text-decoration:none;padding:11px 16px;border-radius:999px;font-size:13px;font-weight:700;margin:0 8px 8px 0;">
        Free energy audit
      </a>
      <a href="${siteUrl}/marketplace"
         style="display:inline-block;background:#c45c26;color:#ffffff;text-decoration:none;padding:11px 16px;border-radius:999px;font-size:13px;font-weight:700;margin:0 0 8px 0;">
        Shop eco upgrades
      </a>
    </p>
  `;

  const result = await sendResendEmail({
    to: payload.email,
    subject: "We received your message — EcoModern Living",
    html: wrapEmailHtml(body, {
      email: payload.email,
      previewText: "Thanks for contacting EcoModern Living — we'll reply soon.",
      reason:
        "You received this email because you submitted the contact form on ecomodernliving.ai.",
    }),
    replyTo: ADMIN_EMAIL,
  });

  return result.ok;
}
