import { NextResponse } from "next/server";
import { ADMIN_EMAIL } from "@/lib/auth/admin";
import { sendResendEmail } from "@/lib/email/resend";
import { wrapEmailHtml } from "@/lib/email/layout";
import { unsubscribeEmail } from "@/lib/newsletter/subscribers";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const contentType = request.headers.get("content-type") ?? "";
    let email = (url.searchParams.get("email") ?? "").trim().toLowerCase();

    if (!email && contentType.includes("application/json")) {
      const body = await request.json();
      email = String(body.email ?? "").trim().toLowerCase();
    } else if (!email) {
      // List-Unsubscribe one-click (form-urlencoded) or HTML form posts
      try {
        const form = await request.formData();
        email = String(form.get("email") ?? "").trim().toLowerCase();
      } catch {
        // empty body is fine when email is only in the query string
      }
    }

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }

    await unsubscribeEmail(email);

    await sendResendEmail({
      to: ADMIN_EMAIL,
      subject: "EcoModern Living — Newsletter unsubscribe",
      html: wrapEmailHtml(
        `
          <h1 style="font-size:18px;margin:0 0 8px;color:#1b3b2d;">Unsubscribe request</h1>
          <p style="color:#5e6c4d;line-height:1.6;margin:0;">
            <strong>${email}</strong> asked to be removed from the newsletter.
          </p>
        `,
        { reason: "Internal notification for EcoModern Living admins." }
      ),
      replyTo: email,
    });

    return NextResponse.json({
      ok: true,
      message: "You've been unsubscribed. You won't receive further newsletter emails.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process unsubscribe. Please try again." },
      { status: 500 }
    );
  }
}
