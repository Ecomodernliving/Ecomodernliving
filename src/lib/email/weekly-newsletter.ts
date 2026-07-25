import {
  getSiteUrl,
  getUnsubscribeApiUrl,
  getUnsubscribeUrl,
} from "@/lib/email/layout";
import { applyAffiliateTag } from "@/lib/affiliate";
import { sendResendEmail, type SendEmailResult } from "@/lib/email/resend";
import { ADMIN_EMAIL } from "@/lib/auth/admin";
import { legalLinks, siteConfig } from "@/config/site";
import { utilityLinks } from "@/config/navigation";
import type {
  NewsletterIssue,
  NewsletterSourceProduct,
} from "@/lib/newsletter/issues";

const ACCENT_ORANGE = "#c45c26";
const FOREST = "#1b3b2d";
const MUTED = "#6b7a6f";
const BORDER = "#e8ece8";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Amazon View links always include the affiliate tag. */
function productHref(url?: string): string {
  if (!url) return "#";
  return applyAffiliateTag(url);
}

function resolveProductImage(
  product: NewsletterSourceProduct
): string | undefined {
  if (product.imageUrl?.startsWith("http")) return product.imageUrl;
  const asin = product.asin?.toUpperCase();
  if (asin && /^[A-Z0-9]{10}$/.test(asin)) {
    return `https://m.media-amazon.com/images/P/${asin}.01._SL400_.jpg`;
  }
  return undefined;
}

function categoryLabel(product: NewsletterSourceProduct): string {
  if (product.description?.trim()) return product.description;
  const map: Record<string, string> = {
    solar: "Solar & backup power",
    "air-purifiers": "Healthy indoor air",
    "heat-pumps": "Efficient HVAC",
    "smart-home": "Smart energy",
    "smart-thermostats": "Smart comfort",
    "ev-chargers": "EV charging",
    "water-fixtures": "Water savings",
    composting: "Zero waste",
    "eco-paints": "Healthier finishes",
    "energy-efficient-appliances": "Efficient appliances",
  };
  return map[product.slug || ""] || "EcoModern pick";
}

function ctaButton(
  href: string,
  label: string,
  bg: string,
  fullWidth = false
): string {
  return `
    <a href="${escapeHtml(href)}"
       style="display:inline-block;${fullWidth ? "width:100%;box-sizing:border-box;text-align:center;" : ""}background:${bg};color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:999px;font-size:14px;font-weight:700;letter-spacing:0.01em;">
      ${escapeHtml(label)}
    </a>
  `;
}

function productGridCard(product: NewsletterSourceProduct): string {
  const image = resolveProductImage(product);
  const href = productHref(product.url);
  const img = image
    ? `<a href="${escapeHtml(href)}" style="text-decoration:none;display:block;">
         <img src="${escapeHtml(image)}" alt="${escapeHtml(product.name)}" width="220"
              style="display:block;width:100%;height:150px;object-fit:contain;object-position:center;background:#f3f5f3;border-radius:12px 12px 0 0;border:0;" />
       </a>`
    : `<div style="height:150px;background:#f3f5f3;border-radius:12px 12px 0 0;text-align:center;line-height:150px;font-size:40px;">🛒</div>`;

  return `
    <td width="50%" valign="top" style="padding:6px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
             style="background:#ffffff;border:1px solid ${BORDER};border-radius:12px;overflow:hidden;">
        <tr><td style="padding:0;background:#f3f5f3;">${img}</td></tr>
        <tr>
          <td style="padding:12px 12px 14px;">
            <p style="margin:0 0 4px;font-size:14px;line-height:1.3;color:${FOREST};font-weight:700;">
              ${escapeHtml(product.name)}
            </p>
            <p style="margin:0 0 8px;font-size:12px;line-height:1.4;color:${MUTED};">
              ${escapeHtml(categoryLabel(product))}
            </p>
            <a href="${escapeHtml(href)}" style="color:${MUTED};font-size:13px;font-weight:600;text-decoration:none;">View →</a>
          </td>
        </tr>
      </table>
    </td>
  `;
}

function productRows(products: NewsletterSourceProduct[]): string {
  const items = products.slice(0, 4);
  while (items.length < 4 && items.length > 0) {
    // keep grid balanced only with real products
    break;
  }
  const rows: string[] = [];
  for (let i = 0; i < items.length; i += 2) {
    const left = items[i];
    const right = items[i + 1];
    rows.push(`
      <tr>
        ${productGridCard(left)}
        ${
          right
            ? productGridCard(right)
            : `<td width="50%" style="padding:6px;"></td>`
        }
      </tr>
    `);
  }
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
      ${rows.join("")}
    </table>
  `;
}

function smartHomeCards(products: NewsletterSourceProduct[]): string {
  const items = products.slice(0, 2);
  if (items.length === 0) return "";

  const card = (p: NewsletterSourceProduct) => {
    const image = resolveProductImage(p);
    const href = productHref(p.url);
    const img = image
      ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(p.name)}" width="240"
             style="display:block;width:100%;height:160px;object-fit:contain;background:#f3f5f3;border-radius:12px 12px 0 0;" />`
      : `<div style="height:160px;background:#f3f5f3;border-radius:12px 12px 0 0;text-align:center;line-height:160px;font-size:42px;">🏠</div>`;

    return `
      <td width="50%" valign="top" style="padding:6px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border:1px solid ${BORDER};border-radius:12px;overflow:hidden;">
          <tr><td style="background:#f3f5f3;padding:0;">
            <a href="${escapeHtml(href)}" style="text-decoration:none;">${img}</a>
          </td></tr>
          <tr>
            <td style="padding:12px 12px 14px;">
              <p style="margin:0 0 4px;font-size:14px;line-height:1.3;color:${FOREST};font-weight:700;">
                ${escapeHtml(p.name)}
              </p>
              <p style="margin:0 0 8px;font-size:12px;line-height:1.4;color:${MUTED};">
                ${escapeHtml(categoryLabel(p))}
              </p>
              <a href="${escapeHtml(href)}" style="color:${MUTED};font-size:13px;font-weight:600;text-decoration:none;">View →</a>
            </td>
          </tr>
        </table>
      </td>
    `;
  };

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        ${card(items[0])}
        ${items[1] ? card(items[1]) : `<td width="50%"></td>`}
      </tr>
    </table>
  `;
}

function sectionTitleRow(
  emoji: string,
  label: string,
  title: string,
  labelColor: string
): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px;">
      <tr>
        <td width="28" valign="middle" style="padding:0 8px 0 0;font-size:18px;line-height:1;">${emoji}</td>
        <td valign="middle" style="padding:0;">
          <p style="margin:0 0 2px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${labelColor};font-weight:700;">
            ${escapeHtml(label)}
          </p>
          <p style="margin:0;font-size:18px;line-height:1.25;color:${FOREST};font-weight:700;">
            ${escapeHtml(title)}
          </p>
        </td>
      </tr>
    </table>
  `;
}

function calloutBox(
  bg: string,
  border: string,
  inner: string
): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background:${bg};border:1px solid ${border};border-radius:16px;margin:0 0 20px;">
      <tr>
        <td style="padding:18px 18px 20px;">
          ${inner}
        </td>
      </tr>
    </table>
  `;
}

/**
 * Sample-matching weekly newsletter layout:
 * hero → CTA → 2×2 eco grid → smart home row → energy tip → Passive House → light footer
 */
export function buildWeeklyNewsletterHtml(
  issue: NewsletterIssue,
  email: string
): string {
  const siteUrl = getSiteUrl();
  const heroUrl = `${siteUrl}/images/hero-passive-house.jpg`;
  const unsubscribeUrl = getUnsubscribeUrl(email);
  const year = new Date().getFullYear();

  const eco = (issue.sourcePayload?.products ?? []).slice(0, 4);
  const smart = (issue.sourcePayload?.smartHomeProducts ?? []).slice(0, 2);
  const tip = issue.sourcePayload?.tip;
  const faq = issue.sourcePayload?.faq;

  const footerLinks = [
    ...legalLinks.map((l) => ({
      label: l.label === "Terms of Service" ? "Terms & Conditions" : l.label,
      href: `${siteUrl}${l.href}`,
    })),
    ...utilityLinks.map((l) => ({
      label: l.label,
      href: `${siteUrl}${l.href}`,
    })),
    { label: "Unsubscribe", href: unsubscribeUrl },
  ];

  const footerHtml = footerLinks
    .map(
      (l, i) =>
        `${i > 0 ? "&nbsp;&nbsp;" : ""}<a href="${l.href}" style="color:#4b5563;text-decoration:none;font-size:12px;">${escapeHtml(l.label)}</a>`
    )
    .join("");

  const ecoSection =
    eco.length > 0
      ? `
      <tr>
        <td style="padding:8px 24px 8px;">
          ${productRows(eco)}
        </td>
      </tr>
    `
      : "";

  const smartSection =
    smart.length > 0
      ? `
      <tr>
        <td style="padding:16px 24px 8px;">
          ${sectionTitleRow(
            "🏠",
            "Smart home",
            issue.aiSmartHomeTrends.title || "Smart home pick",
            ACCENT_ORANGE
          )}
          ${smartHomeCards(smart)}
        </td>
      </tr>
    `
      : "";

  const tipTitle = tip?.title || issue.energySavingTips.title || "Energy savings tip";
  const tipBody =
    tip?.body ||
    issue.energySavingTips.body ||
    "Small setpoint changes on a schedule compound over a season.";
  const tipHref =
    issue.energySavingTips.linkHref || `${siteUrl}/ai/energy-audit`;

  const energySection = `
    <tr>
      <td style="padding:16px 24px 4px;">
        ${calloutBox(
          "#fff4eb",
          "#f0dcc8",
          `
            ${sectionTitleRow("⚡", "Energy tip", tipTitle, ACCENT_ORANGE)}
            <p style="margin:0 0 14px;font-size:14px;line-height:1.55;color:${MUTED};">
              ${escapeHtml(tipBody)}
            </p>
            ${ctaButton(tipHref, issue.energySavingTips.linkLabel || "Free energy audit", ACCENT_ORANGE)}
          `
        )}
      </td>
    </tr>
  `;

  const faqTitle =
    faq?.question ||
    issue.passiveHouseEducation.title ||
    "Passive House education";
  const faqBody =
    faq?.answer ||
    issue.passiveHouseEducation.body ||
    "Efficiency first — then right-size systems.";
  const faqHref =
    faq?.link ||
    issue.passiveHouseEducation.linkHref ||
    `${siteUrl}/passive-house`;

  const passiveSection = `
    <tr>
      <td style="padding:4px 24px 8px;">
        ${calloutBox(
          "#eaf6ef",
          "#d5e8dc",
          `
            ${sectionTitleRow("🏡", "Passive House", faqTitle, "#2d6f4e")}
            <p style="margin:0 0 14px;font-size:14px;line-height:1.55;color:${MUTED};">
              ${escapeHtml(faqBody)}
            </p>
            ${ctaButton(faqHref, "Read more", FOREST)}
          `
        )}
      </td>
    </tr>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(issue.subject || siteConfig.name)}</title>
</head>
<body style="margin:0;padding:0;background:#eef1ee;font-family:Georgia,'Times New Roman',serif;">
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${escapeHtml(issue.previewText || "Transform your home. Save energy. Live better.")}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1ee;padding:20px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid ${BORDER};font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">

          <!-- Hero image (full bleed) -->
          <tr>
            <td style="padding:0;line-height:0;font-size:0;">
              <a href="${siteUrl}" style="text-decoration:none;">
                <img src="${heroUrl}" alt="EcoModern Living home"
                     width="600"
                     style="display:block;width:100%;max-width:600px;height:auto;border:0;" />
              </a>
            </td>
          </tr>

          <!-- Hero copy + CTA -->
          <tr>
            <td style="padding:28px 28px 10px;text-align:center;">
              <h1 style="margin:0 0 18px;font-size:26px;line-height:1.25;color:${FOREST};font-weight:800;letter-spacing:-0.02em;">
                Transform Your Home.<br />Save Energy. Live Better.
              </h1>
              <p style="margin:0 0 20px;font-size:14px;line-height:1.5;color:${MUTED};">
                Your sustainable future starts here.
              </p>
              ${ctaButton(
                `${siteUrl}/marketplace`,
                "Explore EcoModern Solutions & Shop Now",
                ACCENT_ORANGE
              )}
            </td>
          </tr>

          <tr>
            <td style="padding:22px 28px 6px;">
              <div style="height:1px;background:${BORDER};line-height:1px;font-size:1px;">&nbsp;</div>
            </td>
          </tr>

          ${ecoSection}
          ${smartSection}
          ${energySection}
          ${passiveSection}

          <!-- Light footer (sample style) -->
          <tr>
            <td style="background:#f3f4f3;padding:22px 20px 26px;text-align:center;border-top:1px solid ${BORDER};">
              <p style="margin:0 0 12px;font-size:12px;color:#6b7280;">
                © ${year} ${escapeHtml(siteConfig.name)}. All rights reserved.
              </p>
              <p style="margin:0;line-height:1.9;">
                ${footerHtml}
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

export async function sendWeeklyNewsletterEmail(
  issue: NewsletterIssue,
  to: string
): Promise<SendEmailResult> {
  return sendResendEmail({
    to,
    subject: issue.subject,
    html: buildWeeklyNewsletterHtml(issue, to),
    replyTo: ADMIN_EMAIL,
    headers: {
      "List-Unsubscribe": `<${getUnsubscribeUrl(to)}>, <${getUnsubscribeApiUrl(to)}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
}
