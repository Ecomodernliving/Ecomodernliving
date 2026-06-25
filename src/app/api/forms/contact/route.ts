import { NextResponse } from "next/server";
import { submitFormspreeServer } from "@/lib/email/formspree-server";

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

    const result = await submitFormspreeServer("contact", {
      name,
      email,
      message,
      _replyto: email,
      _subject: "EcoModern Living — Contact form",
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 502 });
    }

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
