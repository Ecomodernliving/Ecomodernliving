import type { PageCategory } from "@/lib/navigation-utils";
import type { NavIconName } from "@/config/navigation";
import type { AffiliateStore } from "@/lib/affiliate-stores";
import { marketplaceProducts } from "@/config/marketplace-products";
import { passiveHouseContentOverrides } from "@/config/passive-house-content";

export type PageFeature = {
  title: string;
  description: string;
};

export type PageProduct = {
  name: string;
  description: string;
  tag?: string;
  priceRange?: string;
  store?: AffiliateStore;
  imageUrl?: string;
  affiliateUrl?: string;
  amazonUrl?: string;
  amazonQuery?: string;
  amazonAsin?: string;
};

export type PageStep = {
  step: number;
  title: string;
  description: string;
};

export type PageTimelineItem = {
  title: string;
  status: "complete" | "in-progress" | "planned";
  date?: string;
  description: string;
};

export type PageContent = {
  intro: string;
  highlights: string[];
  features: PageFeature[];
  products?: PageProduct[];
  steps?: PageStep[];
  timeline?: PageTimelineItem[];
  tips?: string[];
  comingSoon?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
};

function defaultProducts(label: string): PageProduct[] {
  const q = label.toLowerCase();
  return [
    { name: `Premium ${label}`, description: "Top-rated sustainable option with verified eco certifications", tag: "Editor's Choice", priceRange: "$$$", amazonQuery: `best eco ${q}` },
    { name: `Best Value ${label}`, description: "Excellent performance at a mid-range price point", tag: "Best Value", priceRange: "$$", amazonQuery: `affordable eco ${q}` },
    { name: `Budget ${label}`, description: "Affordable entry point without compromising safety standards", tag: "Budget Pick", priceRange: "$", amazonQuery: `budget eco ${q}` },
    { name: `Professional ${label}`, description: "Contractor-grade option for whole-home installations", tag: "Pro Grade", priceRange: "$$$$", amazonQuery: `professional ${q} installation` },
  ];
}

function defaultFeatures(label: string, category: PageCategory): PageFeature[] {
  const base: Record<PageCategory, PageFeature[]> = {
    marketplace: [
      { title: "Verified Eco Standards", description: "Every product meets strict sustainability and safety criteria" },
      { title: "Affiliate Transparency", description: "We earn commissions that support our free content and tools" },
      { title: "Expert Curated", description: "Selected by our team based on performance, durability, and impact" },
      { title: "Price Tracking", description: "Compare prices across Amazon, Home Depot, Lowe's, and more" },
    ],
    ai: [
      { title: "Personalized Results", description: "Recommendations tailored to your home, climate, and budget" },
      { title: "ROI Calculations", description: "See payback periods and long-term savings estimates" },
      { title: "Product Matching", description: "Direct links to verified eco-friendly products" },
      { title: "Always Improving", description: "Our AI learns from the latest building science research" },
    ],
    guides: [
      { title: "Research-Backed", description: "Content based on building science and industry standards" },
      { title: "Actionable Steps", description: "Clear checklists you can follow today" },
      { title: "Updated Regularly", description: "We refresh guides as products and codes evolve" },
      { title: "Expert Reviewed", description: "Reviewed by sustainability and construction professionals" },
    ],
    "passive-house": [
      { title: "Research-Backed", description: "Content based on building science and Passive House Institute standards" },
      { title: "Practical Guidance", description: "Clear explanations homeowners and renovators can act on" },
      { title: "Curated Products", description: "Recommended materials and systems mapped to each topic" },
      { title: "Free Tools", description: "Calculators, FAQs, and AI audits to support your planning" },
    ],
    services: [
      { title: "Expert Guidance", description: "Personalized advice from sustainability professionals" },
      { title: "Flexible Packages", description: "Options for homeowners and businesses of all sizes" },
      { title: "AI-Enhanced", description: "Leveraging automation to deliver faster, smarter results" },
      { title: "Results-Driven", description: "Focused on measurable energy savings and ROI" },
    ],
    community: [
      { title: "Active Community", description: "Connect with others on the same sustainable journey" },
      { title: "Weekly Updates", description: "Fresh content on products, trends, and sustainable living" },
      { title: "Exclusive Access", description: "Early access to tools, guides, and new features" },
      { title: "Free to Join", description: "No cost to participate in our community channels" },
    ],
    utility: [
      { title: "Our Mission", description: "Making sustainable living accessible to every homeowner" },
      { title: "AI + Sustainability", description: "Unique blend of technology and green building expertise" },
      { title: "Transparent", description: "Honest reviews, clear education, and open affiliate disclosures" },
      { title: "Community First", description: "Built for homeowners exploring smarter, greener living" },
    ],
  };
  return base[category];
}

function defaultSteps(category: PageCategory): PageStep[] {
  if (category === "ai") {
    return [
      { step: 1, title: "Share Your Details", description: "Upload photos, floor plans, or enter your home specifications" },
      { step: 2, title: "AI Analysis", description: "Our engine evaluates energy use, materials, and upgrade opportunities" },
      { step: 3, title: "Get Recommendations", description: "Receive a prioritized list with cost estimates and ROI projections" },
      { step: 4, title: "Take Action", description: "Shop curated products or connect with certified installers" },
    ];
  }
  if (category === "services") {
    return [
      { step: 1, title: "Discovery Call", description: "We learn about your home, goals, and budget in a free consultation" },
      { step: 2, title: "Custom Plan", description: "Receive a tailored roadmap with prioritized upgrades and timelines" },
      { step: 3, title: "Implementation", description: "We guide product selection, contractor matching, and project oversight" },
      { step: 4, title: "Measure Results", description: "Track energy savings, comfort improvements, and ROI over time" },
    ];
  }
  return [];
}

function defaultTips(label: string, category: PageCategory): string[] {
  if (category === "guides") {
    return [
      `Start with an energy audit before investing in ${label.toLowerCase()} upgrades`,
      "Check local rebates and tax credits — they can cover 30%+ of project costs",
      "Prioritize envelope improvements (insulation, air sealing) before adding renewables",
      "Get at least three quotes from certified contractors for any major work",
    ];
  }
  if (category === "marketplace") {
    return [
      "Look for third-party certifications: Energy Star, FSC, GREENGUARD, Cradle to Cradle",
      "Compare total cost of ownership, not just upfront price",
      "Read recent reviews — product formulations and models change frequently",
      "Consider professional installation for HVAC, solar, and electrical products",
    ];
  }
  return [];
}

const contentOverrides: Partial<Record<string, Partial<PageContent>>> = {
  "/ai/home-advisor": {
    intro: "Upload photos of your home, floor plans, and utility bills. Our AI analyzes your space and delivers a personalized sustainable upgrade plan with ROI calculations.",
    comingSoon: false,
    ctaLabel: "Start Free Analysis",
    ctaHref: "#get-started",
  },
  "/ai/energy-audit": {
    intro: "Enter your square footage, appliance usage, and utility bills to get an instant estimate of energy waste, solar savings potential, and available tax credits.",
    comingSoon: false,
    ctaLabel: "Run Free Audit",
    ctaHref: "#audit-form",
  },
  "/passive-house/journal": {
    intro: "Educational articles on passive house design, retrofit strategies, product comparisons, and industry trends — written to help you plan with confidence.",
    comingSoon: true,
  },
  "/passive-house/before-after": {
    intro: "Real-world passive house and deep retrofit case studies — performance results, design choices, and lessons from certified projects around the world.",
    comingSoon: true,
  },
  "/passive-house/tours": {
    intro: "Virtual walkthroughs and photo galleries of certified passive house homes — see what exceptional comfort and efficiency look like in practice.",
    comingSoon: true,
  },
  "/passive-house/vision": {
    intro: "Why homeowners and developers choose Passive House — superior comfort, indoor air quality, durability, and dramatically lower energy bills.",
    highlights: [
      "Even temperatures in every room, year-round",
      "Continuous filtered fresh air without drafts",
      "50–90% lower heating and cooling energy use",
      "Higher resale value and long-term durability",
    ],
  },
  "/passive-house/site": {
    intro: "How site selection, solar orientation, and climate zone affect your passive house design — key factors to evaluate before you commit to a lot or retrofit.",
    highlights: [
      "South-facing solar access for winter gains",
      "Shading from trees and neighboring buildings",
      "Climate data drives insulation and glazing specs",
      "Wind exposure affects airtightness detailing",
    ],
  },
  "/passive-house/timeline": {
    intro: "The typical Passive House certification path — from schematic design and PHPP modeling through construction, testing, and independent certifier review.",
    timeline: [
      { title: "Schematic Design", status: "complete", description: "Compact form, orientation, and initial PHPP feasibility study" },
      { title: "Design Development", status: "complete", description: "Envelope details, window specs, and ventilation layout finalized in PHPP" },
      { title: "Construction", status: "in-progress", description: "Air barrier installation, insulation, windows, and mechanical systems" },
      { title: "Testing & Commissioning", status: "planned", description: "Blower door test, ventilation balancing, and performance verification" },
      { title: "Certification", status: "planned", description: "Independent certifier review and PHI certification issued" },
    ],
  },
  "/passive-house/materials": {
    intro: "Recommended insulation, windows, air barriers, and ventilation products for passive house projects — curated for performance, availability, and value.",
    tips: [
      "Match insulation type to your assembly and climate",
      "Specify windows with published U-factor and SHGC values",
      "Use dedicated air barrier membranes — not spray foam alone",
      "Select ERV/HRV units with ≥75% heat recovery efficiency",
    ],
    ctaLabel: "Browse Product Guide",
    ctaHref: "/passive-house-products",
  },
  "/passive-house/solar": {
    intro: "How to size solar PV and battery storage for a low-energy passive house home — efficiency first, then right-sized renewables.",
    highlights: [
      "Minimize demand before sizing solar arrays",
      "Passive House Plus and Premium certification tiers",
      "Battery storage for resilience and time-of-use savings",
      "Federal 30% solar tax credit through 2032",
    ],
  },
  "/guides/incentives": {
    intro: "Federal, state, and local incentives can dramatically reduce the cost of sustainable upgrades. Here's what's available in 2025-2026.",
    highlights: [
      "30% Federal Solar Tax Credit (ITC) through 2032",
      "Up to $8,000 heat pump rebate via IRA HOMES program",
      "$7,500 federal EV tax credit for qualifying vehicles",
      "State-specific programs vary — check your zip code",
    ],
    tips: [
      "Stack federal and state incentives for maximum savings",
      "Keep all receipts and contractor documentation for tax filing",
      "Some rebates require pre-approval before starting work",
      "Income limits may apply for certain rebate programs",
    ],
  },
  "/guides/passive-house": {
    intro: "Passive House is the world's leading standard for energy-efficient buildings. Learn the core principles and whether it's right for your project.",
    highlights: [
      "≤ 0.6 ACH50 airtightness (blower door test)",
      "Heating/cooling demand ≤ 4.75 kBTU/ft²/yr",
      "Primary energy ≤ 38 kBTU/ft²/yr",
      "Thermal comfort in every room, every season",
    ],
  },
  "/community/newsletter": {
    intro: "Join thousands of homeowners getting weekly eco product picks, AI smart home trends, energy savings tips, and passive house education.",
    ctaLabel: "Subscribe Free",
    ctaHref: "#subscribe",
  },
  "/about": {
    intro: "EcoModern Living is an AI-powered sustainable living platform. We combine curated eco products, intelligent home tools, and expert passive house education to help you plan a greener home.",
    highlights: [
      "Founded by sustainability and AI enthusiasts",
      "Research-backed passive house guides and tools",
      "60+ curated product categories with affiliate partnerships",
      "Free AI tools for energy audits and home upgrades",
    ],
  },
  "/contact": {
    intro: "Have a question about sustainable living, passive house planning, or partnership opportunities? We'd love to hear from you.",
    ctaLabel: "Send Message",
    ctaHref: "#contact-form",
  },
};

export function buildPageContent(
  href: string,
  label: string,
  description: string,
  category: PageCategory,
  badge?: string
): PageContent {
  const slug = href.split("/").pop() ?? "";
  const override = { ...passiveHouseContentOverrides[href], ...contentOverrides[href] };

  const isComingSoon =
    badge === "Soon" ||
    href.includes("renovation-planner") ||
    href.includes("material-finder") ||
    href.includes("building-codes") ||
    href === "/store";

  return {
    intro: description,
    highlights: [
      `Expert guidance on ${label.toLowerCase()}`,
      "Curated for sustainability and performance",
      "Updated with the latest products and research",
      category === "passive-house" ? "Research-backed education" : "Free resources and tools available",
    ],
    features: defaultFeatures(label, category),
    products:
      href === "/passive-house-products"
        ? passiveHouseContentOverrides["/passive-house-products"]?.products
        : category === "marketplace"
          ? marketplaceProducts[slug] ?? defaultProducts(label)
          : undefined,
    steps: defaultSteps(category).length > 0 ? defaultSteps(category) : undefined,
    timeline: undefined,
    tips: defaultTips(label, category).length > 0 ? defaultTips(label, category) : undefined,
    comingSoon: isComingSoon,
    ctaLabel: category === "ai" ? "Try It Free" : category === "services" ? "Book Consultation" : "Explore Products",
    ctaHref: category === "marketplace" ? "#products" : "#get-started",
    ...override,
  };
}

export function getCategoryAccent(category: PageCategory): {
  gradient: string;
  light: string;
  text: string;
} {
  const accents: Record<PageCategory, { gradient: string; light: string; text: string }> = {
    marketplace: { gradient: "from-teal-600 to-forest-700", light: "bg-teal-50", text: "text-teal-700" },
    ai: { gradient: "from-violet-600 to-forest-700", light: "bg-violet-50", text: "text-violet-700" },
    guides: { gradient: "from-amber-500 to-forest-700", light: "bg-amber-50", text: "text-amber-700" },
    "passive-house": { gradient: "from-orange-500 to-forest-800", light: "bg-orange-50", text: "text-orange-700" },
    services: { gradient: "from-blue-600 to-forest-700", light: "bg-blue-50", text: "text-blue-700" },
    community: { gradient: "from-pink-500 to-forest-700", light: "bg-pink-50", text: "text-pink-700" },
    utility: { gradient: "from-forest-600 to-forest-800", light: "bg-forest-50", text: "text-forest-700" },
  };
  return accents[category];
}

export type { NavIconName };
