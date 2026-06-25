import { NextResponse } from "next/server";
import { calculateEnergyEstimate } from "@/lib/energy-estimate";
import { sendAuditEstimateEmail } from "@/lib/email/audit-reply";
import { submitFormspreeServer } from "@/lib/email/formspree-server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim();
    const sqft = Number(body.sqft);
    const bill = Number(body.bill);
    const state = String(body.state ?? "").trim();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required to send your estimate." },
        { status: 400 }
      );
    }

    if (!sqft || sqft < 100 || sqft > 50000) {
      return NextResponse.json(
        { error: "Enter a valid square footage (100–50,000)." },
        { status: 400 }
      );
    }

    if (bill < 0 || bill > 10000) {
      return NextResponse.json(
        { error: "Enter a valid monthly electric bill." },
        { status: 400 }
      );
    }

    if (!state) {
      return NextResponse.json({ error: "State is required." }, { status: 400 });
    }

    const estimate = calculateEnergyEstimate(sqft, bill, state);

    const formspree = await submitFormspreeServer("audit", {
      email,
      sqft: String(sqft),
      bill: String(bill),
      state,
      estimate_summary: estimate.summary,
      efficiency_savings_monthly: String(estimate.efficiencySavingsMonthly),
      efficiency_savings_annual: String(estimate.efficiencySavingsAnnual),
      solar_offset_annual: String(estimate.solarOffsetAnnual),
      tax_credit_estimate: String(estimate.federalTaxCreditEstimate),
      _replyto: email,
      _subject: "EcoModern Living — Energy audit request",
    });

    if (!formspree.ok) {
      return NextResponse.json({ error: formspree.message }, { status: 502 });
    }

    const emailed = await sendAuditEstimateEmail(email, estimate);

    return NextResponse.json({
      ok: true,
      estimate,
      emailed,
      message: emailed
        ? `We've emailed your personalized savings estimate to ${email}. Full AI audit results coming soon.`
        : `Your estimate is ready. Full AI audit results coming soon — we'll follow up at ${email}.`,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process your audit. Please try again." },
      { status: 500 }
    );
  }
}
