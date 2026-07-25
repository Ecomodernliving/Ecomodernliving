import { NextResponse } from "next/server";
import { getFormspreeEndpoint } from "@/lib/formspree";
import { submitFormspreeServer } from "@/lib/email/formspree-server";
import {
  notifyAdminOfNewsletterSignup,
  sendNewsletterWelcomeEmail,
} from "@/lib/email/newsletter-welcome";
import {
  getSubscriber,
  markConfirmationEmailed,
  shouldResendConfirmation,
  subscribeEmail,
  unsubscribeEmail,
  type NewsletterSubscriber,
} from "@/lib/newsletter/subscribers";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sendConfirmation(
  email: string,
  existing?: NewsletterSubscriber | null
): Promise<{ ok: true; resent: boolean } | { ok: false; error: string }> {
  if (existing?.status === "subscribed" && !shouldResendConfirmation(existing)) {
    return { ok: true, resent: false };
  }

  const welcome = await sendNewsletterWelcomeEmail(email);
  if (!welcome.ok) {
    return { ok: false, error: welcome.error };
  }

  await markConfirmationEmailed(email);
  return { ok: true, resent: Boolean(existing?.status === "subscribed") };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }

    const existing = await getSubscriber(email);

    if (existing?.status === "subscribed") {
      const sent = await sendConfirmation(email, existing);
      if (!sent.ok) {
        return NextResponse.json(
          {
            error: sent.error,
            hint: "Check RESEND_API_KEY / RESEND_FROM_EMAIL in Vercel env and redeploy.",
          },
          { status: 503 }
        );
      }

      return NextResponse.json({
        ok: true,
        alreadySubscribed: true,
        emailed: sent.resent,
        message: sent.resent
          ? "You're already subscribed - we sent another confirmation to your inbox (check spam)."
          : "You're already subscribed to EcoModern Living tips. Check your inbox/spam for the confirmation we sent earlier.",
      });
    }

    // Claim the address before emailing so a second submit sees "already subscribed".
    const claimed = await subscribeEmail(email);
    if (claimed.alreadySubscribed) {
      const sent = await sendConfirmation(email, {
        email,
        status: "subscribed",
        subscribedAt: new Date().toISOString(),
      });
      if (!sent.ok) {
        return NextResponse.json({ error: sent.error }, { status: 503 });
      }
      return NextResponse.json({
        ok: true,
        alreadySubscribed: true,
        emailed: sent.resent,
        message: sent.resent
          ? "You're already subscribed - we sent another confirmation to your inbox (check spam)."
          : "You're already subscribed to EcoModern Living tips.",
      });
    }

    const welcome = await sendNewsletterWelcomeEmail(email);
    if (!welcome.ok) {
      try {
        await unsubscribeEmail(email);
      } catch (err) {
        console.warn("[newsletter] rollback after email failure failed:", err);
      }
      return NextResponse.json(
        {
          error: welcome.error,
          hint: "Check RESEND_API_KEY / RESEND_FROM_EMAIL in .env.local / Vercel and restart or redeploy.",
        },
        { status: 503 }
      );
    }

    await markConfirmationEmailed(email);

    const formspreeConfigured = !!getFormspreeEndpoint("newsletter");
    if (formspreeConfigured) {
      const result = await submitFormspreeServer("newsletter", {
        email,
        _replyto: email,
        _subject: "EcoModern Living — Newsletter signup",
      });
      if (!result.ok) {
        console.warn("[newsletter] Formspree capture failed:", result.message);
      }
    } else {
      const notified = await notifyAdminOfNewsletterSignup(email);
      if (!notified.ok) {
        console.warn("[newsletter] Admin notify failed:", notified.error);
      }
    }

    return NextResponse.json({
      ok: true,
      emailed: true,
      alreadySubscribed: false,
      message:
        "You're subscribed! Check your inbox (and spam) for a confirmation from EcoModern Living.",
    });
  } catch (err) {
    console.error("[newsletter] subscribe failed:", err);
    return NextResponse.json(
      { error: "Unable to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
