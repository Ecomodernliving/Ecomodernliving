import type { EnergyEstimate } from "@/lib/energy-estimate";
import {
  getSiteUrl,
  wrapEmailHtml,
} from "@/lib/email/layout";
import { sendResendEmail } from "@/lib/email/resend";
import { ADMIN_EMAIL } from "@/lib/auth/admin";

const FOREST = "#1b3b2d";
const MUTED = "#5e6c4d";
const ACCENT = "#2d6f4e";
const ORANGE = "#c45c26";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function money(n: number): string {
  return n.toLocaleString("en-US");
}

function ctaButton(href: string, label: string, bg: string): string {
  return `
    <a href="${escapeHtml(href)}"
       target="_blank"
       rel="noopener noreferrer"
       style="display:inline-block;background:${bg};color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:999px;font-size:14px;font-weight:700;">
      ${escapeHtml(label)}
    </a>
  `;
}

function metricCard(
  emoji: string,
  label: string,
  value: string,
  hint: string,
  bg: string
): string {
  return `
    <td width="50%" valign="top" style="padding:6px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
             style="background:${bg};border:1px solid #e2ebe4;border-radius:14px;">
        <tr>
          <td style="padding:16px;">
            <p style="margin:0 0 8px;font-size:22px;line-height:1;">${emoji}</p>
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${MUTED};font-weight:700;">
              ${escapeHtml(label)}
            </p>
            <p style="margin:0 0 4px;font-size:22px;line-height:1.2;color:${FOREST};font-weight:800;">
              ${escapeHtml(value)}
            </p>
            <p style="margin:0;font-size:12px;line-height:1.4;color:${MUTED};">
              ${escapeHtml(hint)}
            </p>
          </td>
        </tr>
      </table>
    </td>
  `;
}

function auditEmailHtml(estimate: EnergyEstimate): string {
  const siteUrl = getSiteUrl();
  const heroUrl = `${siteUrl}/images/hero-passive-house.jpg`;

  return `
    <!-- Hero -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
      <tr>
        <td style="padding:0;line-height:0;font-size:0;border-radius:14px;overflow:hidden;">
          <a href="${siteUrl}/ai/energy-audit" style="text-decoration:none;">
            <img src="${heroUrl}" alt="Sustainable home"
                 width="504"
                 style="display:block;width:100%;max-width:504px;height:auto;border:0;border-radius:14px;" />
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${ACCENT};font-weight:700;">
      Free energy audit
    </p>
    <h1 style="font-size:24px;margin:0 0 10px;color:${FOREST};font-weight:800;letter-spacing:-0.02em;line-height:1.25;">
      Your energy savings estimate
    </h1>
    <p style="color:${MUTED};line-height:1.6;margin:0 0 20px;font-size:15px;">
      Thanks for requesting a free audit. Here’s a personalized snapshot for your
      <strong style="color:${FOREST};">${estimate.sqft.toLocaleString()} sq ft</strong> home in
      <strong style="color:${FOREST};">${escapeHtml(estimate.state)}</strong>
      (about <strong style="color:${FOREST};">$${money(estimate.monthlyBill)}/mo</strong> on utilities).
    </p>

    <!-- Metric grid -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
      <tr>
        ${metricCard(
          "⚡",
          "Efficiency upgrades",
          `$${money(estimate.efficiencySavingsMonthly)}/mo`,
          "Typical envelope & equipment upgrades",
          "#f0f7f4"
        )}
        ${metricCard(
          "📅",
          "Annual savings",
          `$${money(estimate.efficiencySavingsAnnual)}`,
          "Projected yearly efficiency impact",
          "#f0f7f4"
        )}
      </tr>
      <tr>
        ${metricCard(
          "☀️",
          "Solar offset",
          `~$${money(estimate.solarOffsetAnnual)}/yr`,
          "Climate-adjusted production potential",
          "#fff8f1"
        )}
        ${metricCard(
          "🏛️",
          "Federal tax credit",
          `~$${money(estimate.federalTaxCreditEstimate)}`,
          "Est. solar ITC (~30%) on system cost",
          "#fff8f1"
        )}
      </tr>
    </table>

    <!-- Next steps -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="margin:18px 0 8px;background:#fbfdfb;border:1px solid #e2ebe4;border-radius:14px;">
      <tr>
        <td style="padding:18px;">
          <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${ORANGE};font-weight:700;">
            Next steps
          </p>
          <h2 style="margin:0 0 10px;font-size:17px;color:${FOREST};font-weight:700;">
            Turn this estimate into action
          </h2>
          <p style="margin:0 0 8px;font-size:14px;line-height:1.55;color:${MUTED};">
            🌿 Start with insulation, air sealing, and a smart thermostat
          </p>
          <p style="margin:0 0 8px;font-size:14px;line-height:1.55;color:${MUTED};">
            ☀️ Compare solar + battery options for your climate
          </p>
          <p style="margin:0 0 14px;font-size:14px;line-height:1.55;color:${MUTED};">
            💵 Check incentives that can cover a large share of project cost
          </p>
          <p style="margin:0;">
            ${ctaButton(`${siteUrl}/marketplace`, "Shop eco upgrades", ACCENT)}
            &nbsp;&nbsp;
            ${ctaButton(`${siteUrl}/guides/incentives`, "View incentives", ORANGE)}
          </p>
        </td>
      </tr>
    </table>

    <p style="color:${MUTED};line-height:1.6;margin:18px 0 0;font-size:13px;">
      This is an estimate only — explore upgrades in our
      <a href="${siteUrl}/marketplace" target="_blank" rel="noopener noreferrer" style="color:${ACCENT};font-weight:600;text-decoration:none;">marketplace</a>.
    </p>
  `;
}

export async function sendAuditEstimateEmail(
  email: string,
  estimate: EnergyEstimate
): Promise<boolean> {
  const result = await sendResendEmail({
    to: email,
    subject: "Your EcoModern Living Energy Savings Estimate",
    html: wrapEmailHtml(auditEmailHtml(estimate), {
      email,
      previewText: `Save ~$${estimate.efficiencySavingsMonthly}/mo with efficiency upgrades — your free audit estimate.`,
      reason:
        "You received this email because you requested a free energy audit on ecomodernliving.ai.",
    }),
    replyTo: ADMIN_EMAIL,
  });
  return result.ok;
}
