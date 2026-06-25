import { NextResponse } from "next/server";
import { submitFormspreeServer } from "@/lib/email/formspree-server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }

    const result = await submitFormspreeServer("newsletter", {
      email,
      _replyto: email,
      _subject: "EcoModern Living — Newsletter signup",
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      message: "You're subscribed! Watch your inbox for eco tips and product picks.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
