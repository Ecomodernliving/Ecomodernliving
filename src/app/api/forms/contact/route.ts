import { NextResponse } from "next/server";
import { submitFormspreeServer } from "@/lib/email/formspree-server";
import {
  sendContactAdminEmail,
  sendContactConfirmationEmail,
} from "@/lib/email/contact-reply";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }

    if (!message || message.length < 10) {
      return NextResponse.json(
        { error: "Please enter a message (at least 10 characters)." },
        { status: 400 }
      );
    }

    const payload = { name, email, message };

    // Prefer branded Resend notification (avoids plain Formspree admin email).
    const adminOk = await sendContactAdminEmail(payload);
    if (!adminOk) {
      const formspree = await submitFormspreeServer("contact", {
        name,
        email,
        message,
        _replyto: email,
        _subject: "EcoModern Living — Contact form",
      });
      if (!formspree.ok) {
        return NextResponse.json({ error: formspree.message }, { status: 502 });
      }
    }

    void sendContactConfirmationEmail(payload);

    return NextResponse.json({
      ok: true,
      message: "Thank you! We'll be in touch shortly.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to send your message. Please try again." },
      { status: 500 }
    );
  }
}
