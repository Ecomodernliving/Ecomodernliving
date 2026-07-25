import {
  getUnsubscribeApiUrl,
  getUnsubscribeUrl,
  wrapEmailHtml,
} from "@/lib/email/layout";
import { sendResendEmail, type SendEmailResult } from "@/lib/email/resend";
import { siteConfig } from "@/config/site";
import { ADMIN_EMAIL } from "@/lib/auth/admin";

function welcomeBodyHtml(email: string, siteUrl: string): string {
  return `
    <h1 style="font-size:22px;margin:0 0 12px;color:#1b3b2d;font-weight:700;">You're subscribed</h1>
    <p style="color:#5e6c4d;line-height:1.6;margin:0 0 16px;">
      Thanks for joining the EcoModern Living newsletter. You’ll get weekly
      eco product picks, AI smart home trends, energy savings tips, and
      passive house education — sent to <strong style="color:#1b3b2d;">${email}</strong>.
    </p>
    <p style="color:#5e6c4d;line-height:1.6;margin:0 0 12px;">
      While you wait for the next issue, explore our free tools and guides:
    </p>
    <ul style="color:#5e6c4d;line-height:1.8;padding-left:20px;margin:0 0 8px;">
      <li><a href="${siteUrl}/ai/energy-audit" style="color:#2d6f4e;">Free energy audit</a></li>
      <li><a href="${siteUrl}/passive-house" style="color:#2d6f4e;">Passive house guide</a></li>
      <li><a href="${siteUrl}/marketplace" style="color:#2d6f4e;">Eco marketplace</a></li>
    </ul>
  `;
}

function adminSignupHtml(email: string): string {
  return wrapEmailHtml(
    `
      <h1 style="font-size:18px;margin:0 0 8px;color:#1b3b2d;">New newsletter signup</h1>
      <p style="color:#5e6c4d;line-height:1.6;margin:0;">
        <strong>${email}</strong> subscribed to weekly eco living tips.
      </p>
    `,
    {
      reason: "Internal notification for EcoModern Living admins.",
    }
  );
}

/** Confirmation email to the subscriber. */
export async function sendNewsletterWelcomeEmail(
  email: string
): Promise<SendEmailResult> {
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const html = wrapEmailHtml(welcomeBodyHtml(email, siteUrl), {
    email,
    previewText: "You're subscribed to EcoModern Living weekly tips.",
    reason:
      "You received this email because you subscribed to weekly eco living tips on ecomodernliving.ai.",
  });

  return sendResendEmail({
    to: email,
    subject: "You're subscribed — EcoModern Living tips",
    html,
    headers: {
      "List-Unsubscribe": `<${getUnsubscribeUrl(email)}>, <${getUnsubscribeApiUrl(email)}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
}

/** Notify the site owner when Formspree isn't capturing the lead. */
export async function notifyAdminOfNewsletterSignup(
  email: string
): Promise<SendEmailResult> {
  return sendResendEmail({
    to: ADMIN_EMAIL,
    subject: "EcoModern Living — Newsletter signup",
    html: adminSignupHtml(email),
    replyTo: email,
  });
}
