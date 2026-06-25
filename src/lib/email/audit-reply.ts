import type { EnergyEstimate } from "@/lib/energy-estimate";

function auditEmailHtml(estimate: EnergyEstimate, email: string): string {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; color: #1b3b2d;">
      <h1 style="font-size: 22px; margin-bottom: 8px;">Your Energy Savings Estimate</h1>
      <p style="color: #5e6c4d; line-height: 1.6;">
        Hi there — thanks for requesting a free energy audit from EcoModern Living.
        Here is your personalized estimate for <strong>${estimate.sqft.toLocaleString()} sq ft</strong>
        in <strong>${estimate.state}</strong> (monthly bill: $${estimate.monthlyBill}).
      </p>
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tr>
          <td style="padding: 12px; background: #f0f7f4; border-radius: 8px 0 0 8px;">
            <strong>Efficiency upgrades</strong><br/>
            <span style="font-size: 20px; color: #2d6f4e;">$${estimate.efficiencySavingsMonthly}/mo</span>
          </td>
          <td style="padding: 12px; background: #f0f7f4; border-radius: 0 8px 8px 0;">
            <strong>Annual savings</strong><br/>
            <span style="font-size: 20px; color: #2d6f4e;">$${estimate.efficiencySavingsAnnual.toLocaleString()}</span>
          </td>
        </tr>
      </table>
      <p style="color: #5e6c4d; line-height: 1.6;">
        <strong>Solar offset potential:</strong> ~$${estimate.solarOffsetAnnual.toLocaleString()}/year<br/>
        <strong>Est. federal tax credit:</strong> ~$${estimate.federalTaxCreditEstimate.toLocaleString()}
      </p>
      <p style="color: #5e6c4d; line-height: 1.6; font-size: 14px;">
        Full AI audit results with product recommendations are coming soon.
        We'll notify you at ${email} when they're ready.
      </p>
      <p style="margin-top: 32px; font-size: 13px; color: #788862;">
        — EcoModern Living<br/>
        <a href="https://ecomodernliving.ai" style="color: #2d6f4e;">ecomodernliving.ai</a>
      </p>
    </div>
  `;
}

export async function sendAuditEstimateEmail(
  email: string,
  estimate: EnergyEstimate
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL ??
    "EcoModern Living <onboarding@resend.dev>";

  if (!apiKey) return false;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "Your EcoModern Living Energy Savings Estimate",
        html: auditEmailHtml(estimate, email),
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
