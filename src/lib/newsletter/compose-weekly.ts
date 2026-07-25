import knowledgeBase from "../../../data/passive-house-knowledge-base.json";
import { passiveHouseFaqs } from "@/config/passive-house-faq";
import type { PageProduct } from "@/config/page-content";
import { getSiteUrl, wrapEmailHtml } from "@/lib/email/layout";
import { sendResendEmail } from "@/lib/email/resend";
import { ADMIN_EMAIL } from "@/lib/auth/admin";
import { applyAffiliateTag, amazonAffiliateUrl } from "@/lib/affiliate";
import { getProductsForSlug } from "@/lib/marketplace-catalog";
import {
  createNewsletterIssue,
  findIssueByWeekKey,
  getRecentRotation,
  isoWeekKey,
  updateNewsletterIssue,
  type NewsletterIssue,
  type NewsletterSection,
  type NewsletterSourcePayload,
  type NewsletterSourceProduct,
} from "@/lib/newsletter/issues";
import { notifyNewsletterWebhook } from "@/lib/newsletter/webhook";

const ECO_PICK_SLUGS = [
  "heat-pumps",
  "solar",
  "air-purifiers",
  "energy-efficient-appliances",
  "water-fixtures",
  "ev-chargers",
  "composting",
  "eco-paints",
] as const;

const SMART_HOME_SLUGS = ["smart-home", "smart-thermostats"] as const;

const GUIDE_TIPS = [
  "Start with an energy audit before investing in major upgrades",
  "Check local rebates and tax credits — they can cover 30%+ of project costs",
  "Prioritize envelope improvements (insulation, air sealing) before adding renewables",
  "Get at least three quotes from certified contractors for any major work",
  "Look for third-party certifications: Energy Star, FSC, GREENGUARD, Cradle to Cradle",
  "Compare total cost of ownership, not just upfront price",
  "Seal air leaks around windows, doors, and attic hatches before buying a bigger HVAC system",
  "Set smart thermostats on a schedule — small setpoint changes compound over a season",
];

type KbTopic = {
  name: string;
  relatedPages?: string[];
  bestPractices?: Array<{ title: string; description: string }>;
};

const SLUG_LABELS: Record<string, string> = {
  "heat-pumps": "Efficient heating & cooling",
  solar: "Solar & backup power",
  "air-purifiers": "Cleaner indoor air",
  "energy-efficient-appliances": "Lower utility bills",
  "water-fixtures": "Water-wise home",
  "ev-chargers": "EV-ready living",
  composting: "Less waste at home",
  "eco-paints": "Healthier finishes",
  "smart-home": "Smarter energy use",
  "smart-thermostats": "Comfort that saves energy",
};

function shorten(text: string, max = 96): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.replace(/\s+\S*$/, "").replace(/[,:;.–-]$/, "")}…`;
}

function crispDescription(product: PageProduct, slug: string): string {
  const raw = product.description?.trim() || "";
  const generic = /curated eco-friendly pick/i.test(raw) || raw.length < 12;
  if (generic) return SLUG_LABELS[slug] || "Editor’s pick for eco homes";
  // Prefer first sentence
  const first = raw.split(/(?<=[.!?])\s+/)[0] || raw;
  return shorten(first, 96);
}

function productUrl(product: PageProduct, siteUrl: string, slug: string): string {
  const raw =
    product.affiliateUrl ||
    product.amazonUrl ||
    (product.amazonAsin
      ? `https://www.amazon.com/dp/${product.amazonAsin}`
      : null);

  if (raw) {
    // Ensures tag=ecomodernliving-20 (or NEXT_PUBLIC_AMAZON_AFFILIATE_TAG) on Amazon links
    return applyAffiliateTag(raw);
  }

  if (product.amazonAsin) {
    return amazonAffiliateUrl(product.name, product.amazonAsin);
  }

  return `${siteUrl}/marketplace/${slug}`;
}

function toSourceProduct(
  product: PageProduct,
  slug: string,
  siteUrl: string
): NewsletterSourceProduct {
  const asin = product.amazonAsin?.toUpperCase();
  const imageUrl =
    product.imageUrl?.startsWith("http")
      ? product.imageUrl
      : asin
        ? `https://m.media-amazon.com/images/P/${asin}.01._SL400_.jpg`
        : undefined;

  return {
    name: shorten(product.name, 64),
    description: crispDescription(product, slug),
    asin,
    url: productUrl(product, siteUrl, slug),
    slug,
    store: product.store,
    imageUrl,
  };
}

function pickUnusedProducts(
  pool: Array<{ product: PageProduct; slug: string }>,
  usedAsins: Set<string>,
  count: number
): Array<{ product: PageProduct; slug: string }> {
  const hasImage = (p: PageProduct) =>
    Boolean(p.imageUrl?.startsWith("http") || p.amazonAsin);

  const fresh = pool.filter((p) => {
    const asin = p.product.amazonAsin?.toUpperCase();
    return !asin || !usedAsins.has(asin);
  });
  const source = (fresh.length >= count ? fresh : pool)
    .slice()
    .sort((a, b) => Number(hasImage(b.product)) - Number(hasImage(a.product)));

  const week = isoWeekKey();
  const weekNum = Number(week.split("-W")[1] || "1");
  const start = (weekNum * 3) % Math.max(source.length, 1);
  const rotated = [...source.slice(start), ...source.slice(0, start)];
  const picked: Array<{ product: PageProduct; slug: string }> = [];
  const seen = new Set<string>();

  for (const item of rotated) {
    const key =
      item.product.amazonAsin?.toUpperCase() ||
      `${item.slug}::${item.product.name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(item);
    if (picked.length >= count) break;
  }
  return picked;
}

function buildEcoSection(
  products: NewsletterSourceProduct[],
  siteUrl: string
): NewsletterSection {
  const lines = products.map((p) => `• ${p.name} — ${p.description}`);
  return {
    title: "Editor’s picks",
    body: lines.join("\n"),
    linkLabel: "Browse marketplace",
    linkHref: `${siteUrl}/marketplace`,
  };
}

function buildSmartHomeSection(
  products: NewsletterSourceProduct[],
  siteUrl: string
): NewsletterSection {
  const p = products[0];
  return {
    title: "Smart home pick",
    body: p
      ? `${p.name} — ${p.description}`
      : "Small automation upgrades that cut waste without complexity.",
    linkLabel: "AI smart living",
    linkHref: `${siteUrl}/guides/ai-smart-living`,
  };
}

function buildEnergyTipsSection(
  tipTitle: string,
  tipBody: string,
  siteUrl: string
): NewsletterSection {
  return {
    title: tipTitle,
    body: shorten(tipBody, 140),
    linkLabel: "Free energy audit",
    linkHref: `${siteUrl}/ai/energy-audit`,
  };
}

function buildPassiveSection(
  question: string,
  answer: string,
  link: string
): NewsletterSection {
  return {
    title: shorten(question, 72),
    body: shorten(answer, 180),
    linkLabel: "Learn more",
    linkHref: link,
  };
}

function collectBestPracticeTips(): Array<{
  title: string;
  body: string;
  source: string;
}> {
  const topics = (knowledgeBase as { topics?: KbTopic[] }).topics ?? [];
  const fromKb = topics.flatMap((topic) =>
    (topic.bestPractices ?? []).map((bp) => ({
      title: bp.title,
      body: bp.description,
      source: topic.name,
    }))
  );
  const fromGuides = GUIDE_TIPS.map((text, i) => ({
    title: "Energy savings tip",
    body: text,
    source: `guide-tip-${i}`,
  }));
  return [...fromKb, ...fromGuides];
}

export type ComposeWeeklyResult =
  | { ok: true; issue: NewsletterIssue; created: true }
  | { ok: true; issue: NewsletterIssue; created: false; reason: string }
  | { ok: false; error: string };

/**
 * Build this week's newsletter draft from on-site catalog, FAQs, and tips.
 * Saves as pending_approval in Airtable (or local fallback) and notifies admin.
 */
export async function composeWeeklyDraft(options?: {
  force?: boolean;
}): Promise<ComposeWeeklyResult> {
  const weekKey = isoWeekKey();
  const existing = await findIssueByWeekKey(weekKey);
  if (existing && !options?.force) {
    return {
      ok: true,
      issue: existing,
      created: false,
      reason: `Issue already exists for ${weekKey}`,
    };
  }

  const siteUrl = getSiteUrl();
  // When regenerating, allow reuse of this week's ASINs/FAQ from the draft we're replacing.
  const { asins: usedAsins, faqIds } = await getRecentRotation(8);
  if (existing && options?.force) {
    for (const a of existing.usedAsins ?? existing.sourcePayload?.usedAsins ?? []) {
      usedAsins.delete(a.toUpperCase());
    }
    const faqId = existing.faqId ?? existing.sourcePayload?.faq?.id;
    if (faqId) faqIds.delete(faqId);
  }

  const ecoPool: Array<{ product: PageProduct; slug: string }> = [];
  for (const slug of ECO_PICK_SLUGS) {
    const products = await getProductsForSlug(slug);
    for (const product of products) {
      ecoPool.push({ product, slug });
    }
  }

  const smartPool: Array<{ product: PageProduct; slug: string }> = [];
  for (const slug of SMART_HOME_SLUGS) {
    const products = await getProductsForSlug(slug);
    for (const product of products) {
      smartPool.push({ product, slug });
    }
  }

  const ecoPicked = pickUnusedProducts(ecoPool, usedAsins, 4);
  const smartPicked = pickUnusedProducts(smartPool, usedAsins, 2);

  const ecoSources = ecoPicked.map(({ product, slug }) =>
    toSourceProduct(product, slug, siteUrl)
  );
  const smartSources = smartPicked.map(({ product, slug }) =>
    toSourceProduct(product, slug, siteUrl)
  );

  const faqCandidates = passiveHouseFaqs.filter((f) => !faqIds.has(f.id));
  const faqList =
    faqCandidates.length > 0 ? faqCandidates : passiveHouseFaqs;
  const weekNum = Number(weekKey.split("-W")[1] || "1");
  const faq = faqList[weekNum % faqList.length];
  const faqLink = faq.relatedLinks?.[0]
    ? `${siteUrl}${faq.relatedLinks[0]}`
    : `${siteUrl}/passive-house-faq`;

  const tips = collectBestPracticeTips();
  const tip = tips[weekNum % tips.length];

  const newAsins = [
    ...ecoSources.map((p) => p.asin).filter((a): a is string => Boolean(a)),
    ...smartSources.map((p) => p.asin).filter((a): a is string => Boolean(a)),
  ];

  const sourcePayload: NewsletterSourcePayload = {
    products: ecoSources,
    smartHomeProducts: smartSources,
    faq: {
      id: faq.id,
      question: faq.question,
      answer: shorten(faq.answer, 180),
      link: faqLink,
    },
    tip: {
      title: tip.title,
      body: shorten(tip.body, 140),
      source: tip.source,
    },
    usedAsins: newAsins,
    weekKey,
  };

  const subject = `EcoModern Living — Week ${weekKey.replace("-W", " ")}`;
  const previewText = "Short weekly brief: eco picks, smart home, energy tip, Passive House.";

  const sections = {
    ecoProductPicks: buildEcoSection(ecoSources, siteUrl),
    aiSmartHomeTrends: buildSmartHomeSection(smartSources, siteUrl),
    energySavingTips: buildEnergyTipsSection(tip.title, tip.body, siteUrl),
    passiveHouseEducation: buildPassiveSection(
      faq.question,
      faq.answer,
      faqLink
    ),
  };

  let issue: NewsletterIssue;
  if (existing && options?.force) {
    const updated = await updateNewsletterIssue(existing.id, {
      subject,
      previewText,
      status: "pending_approval",
      ...sections,
      sourcePayload,
      usedAsins: newAsins,
      faqId: faq.id,
      weekKey,
    });
    if (!updated) {
      return { ok: false, error: "Could not update existing draft" };
    }
    issue = updated;
  } else {
    issue = await createNewsletterIssue({
      subject,
      previewText,
      status: "pending_approval",
      ...sections,
      sourcePayload,
      usedAsins: newAsins,
      faqId: faq.id,
      weekKey,
    });
  }

  await sendDraftPreviewEmail(issue);
  await notifyNewsletterWebhook("draft.composed", { issue });

  return {
    ok: true,
    issue,
    created: true as const,
  };
}

export async function sendDraftPreviewEmail(
  issue: NewsletterIssue
): Promise<void> {
  const siteUrl = getSiteUrl();
  const previewUrl = `${siteUrl}/admin/newsletter?issue=${encodeURIComponent(issue.id)}`;
  const html = wrapEmailHtml(
    `
      <h1 style="font-size:20px;margin:0 0 12px;color:#1b3b2d;">Newsletter draft ready for approval</h1>
      <p style="color:#5e6c4d;line-height:1.6;margin:0 0 12px;">
        <strong>${issue.subject}</strong> is waiting for review.
      </p>
      <p style="color:#5e6c4d;line-height:1.6;margin:0 0 16px;">
        Status: <strong>${issue.status}</strong>. Approve it in admin before Monday’s send cron can deliver it.
      </p>
      <p style="margin:0;">
        <a href="${previewUrl}" style="display:inline-block;background:#1b3b2d;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;font-weight:600;">
          Review &amp; approve
        </a>
      </p>
    `,
    {
      reason: "Internal newsletter approval notification.",
      previewText: `Approve newsletter: ${issue.subject}`,
    }
  );

  await sendResendEmail({
    to: ADMIN_EMAIL,
    subject: `[Approve] ${issue.subject}`,
    html,
    replyTo: ADMIN_EMAIL,
  });
}
