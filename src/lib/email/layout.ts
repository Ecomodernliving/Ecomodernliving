import { legalLinks, siteConfig } from "@/config/site";
import { utilityLinks } from "@/config/navigation";

export function getSiteUrl(): string {
  return siteConfig.url.replace(/\/$/, "");
}

export function getLogoUrl(): string {
  return `${getSiteUrl()}/images/logo.png`;
}

export function getUnsubscribeUrl(email: string): string {
  const params = new URLSearchParams({ email });
  return `${getSiteUrl()}/unsubscribe?${params.toString()}`;
}

export function getUnsubscribeApiUrl(email: string): string {
  const params = new URLSearchParams({ email });
  return `${getSiteUrl()}/api/forms/unsubscribe?${params.toString()}`;
}

type EmailLayoutOptions = {
  /** Subscriber email — used for unsubscribe links. */
  email?: string;
  /** Shown above the footer: why they received this message. */
  reason?: string;
  previewText?: string;
};

/**
 * Industry-standard HTML email chrome: branded header + compact site footer.
 */
export function wrapEmailHtml(
  bodyHtml: string,
  { email, reason, previewText }: EmailLayoutOptions = {}
): string {
  const siteUrl = getSiteUrl();
  const logoUrl = getLogoUrl();
  const unsubscribeUrl = email
    ? getUnsubscribeUrl(email)
    : `${siteUrl}/unsubscribe`;
  const year = new Date().getFullYear();

  const footerLinks = [
    ...legalLinks.map((l) => ({ label: l.label, href: `${siteUrl}${l.href}` })),
    ...utilityLinks.map((l) => ({
      label: l.label,
      href: `${siteUrl}${l.href}`,
    })),
    { label: "Unsubscribe", href: unsubscribeUrl },
  ];

  const mutedLinkStyle =
    "color:#ffffff;text-decoration:none;font-size:12px;white-space:nowrap;";

  const legalHtml = footerLinks
    .map(
      (l, i) =>
        `${i > 0 ? "&nbsp;·&nbsp;" : ""}<a href="${l.href}" style="${mutedLinkStyle}">${l.label === "Terms of Service" ? "Terms &amp; Conditions" : l.label}</a>`
    )
    .join("");

  const preview = previewText
    ? `<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${previewText}</div>`
    : "";

  const reasonHtml = reason
    ? `<p style="margin:0 0 16px;font-size:12px;line-height:1.5;color:#788862;text-align:center;">${reason}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${siteConfig.name}</title>
</head>
<body style="margin:0;padding:0;background:#f4f7f4;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  ${preview}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f4;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2ebe4;">
          <!-- Header -->
          <tr>
            <td style="background:#0e2119;padding:20px 28px;text-align:center;">
              <a href="${siteUrl}" style="text-decoration:none;display:inline-block;">
                <img src="${logoUrl}" alt="${siteConfig.name}" width="48" height="48" style="display:block;margin:0 auto 10px;border:0;border-radius:10px;" />
                <span style="font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">EcoModern</span><span style="font-size:18px;font-weight:300;color:#a8b89a;"> Living</span>
              </a>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 28px 24px;color:#1b3b2d;font-size:16px;line-height:1.6;">
              ${bodyHtml}
            </td>
          </tr>

          ${reasonHtml ? `<tr><td style="padding:0 28px 8px;">${reasonHtml}</td></tr>` : ""}

          <!-- Footer -->
          <tr>
            <td style="background:#0a1a14;padding:18px 24px 24px;text-align:center;border-top:1px solid #1a3328;">
              <p style="margin:0 0 10px;font-size:12px;color:#ffffff;">
                © ${year} <span style="color:#ffffff;font-weight:500;">${siteConfig.name}</span>. All rights reserved.
              </p>
              <p style="margin:0;line-height:1.8;">
                ${legalHtml}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
