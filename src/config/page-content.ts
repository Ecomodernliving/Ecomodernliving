import type { PageCategory } from "@/lib/navigation-utils";
import type { NavIconName } from "@/config/navigation";

export type PageFeature = {
  title: string;
  description: string;
};

export type PageProduct = {
  name: string;
  description: string;
  tag?: string;
  priceRange?: string;
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

const marketplaceProducts: Record<string, PageProduct[]> = {
  solar: [
    { name: "REC Alpha Pure-R Panels", description: "High-efficiency monocrystalline with 22%+ efficiency", tag: "Top Pick", priceRange: "$$$", amazonQuery: "REC Alpha Pure R solar panel" },
    { name: "Enphase IQ8 Microinverters", description: "Module-level monitoring and rapid shutdown compliance", tag: "Best Monitoring", priceRange: "$$$", amazonQuery: "Enphase IQ8 microinverter" },
    { name: "Tesla Powerwall 3", description: "Integrated battery storage for backup and self-consumption", tag: "Popular", priceRange: "$$$$", amazonQuery: "home battery storage solar" },
    { name: "Emporia Vue Energy Monitor", description: "Real-time whole-home energy tracking", tag: "Budget", priceRange: "$", amazonAsin: "B08CJGPHL9" },
  ],
  "heat-pumps": [
    { name: "Mitsubishi Hyper-Heat H2i", description: "Cold-climate mini-split rated to -13°F", tag: "Top Pick", priceRange: "$$$", amazonQuery: "Mitsubishi mini split heat pump" },
    { name: "Carrier Infinity Heat Pump", description: "Variable-speed central system with excellent SEER2", tag: "Whole Home", priceRange: "$$$$", amazonQuery: "Carrier heat pump system" },
    { name: "Daikin Fit System", description: "Compact ducted solution for retrofits", tag: "Retrofit", priceRange: "$$$", amazonQuery: "Daikin ducted mini split" },
  ],
  furniture: [
    { name: "Medley Sofa", description: "FSC-certified wood, OEKO-TEX fabrics, made in USA", tag: "Non-Toxic", priceRange: "$$$", amazonQuery: "non toxic sofa FSC certified" },
    { name: "Avocado Green Mattress", description: "GOLS organic latex, zero polyurethane foam", tag: "Organic", priceRange: "$$$", amazonQuery: "Avocado green mattress organic" },
    { name: "Greenington Bamboo Desk", description: "Sustainable bamboo with low-VOC finish", tag: "Eco Material", priceRange: "$$", amazonQuery: "bamboo desk sustainable" },
  ],
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
      { title: "Real Project", description: "Documenting our actual build — not theoretical advice" },
      { title: "Transparent Costs", description: "Full budget breakdown with no hidden numbers" },
      { title: "Product Links", description: "Every material choice linked to what we actually purchased" },
      { title: "Lessons Learned", description: "Honest notes on what worked and what we'd change" },
    ],
    services: [
      { title: "Expert Guidance", description: "Personalized advice from sustainability professionals" },
      { title: "Flexible Packages", description: "Options for homeowners and businesses of all sizes" },
      { title: "AI-Enhanced", description: "Leveraging automation to deliver faster, smarter results" },
      { title: "Results-Driven", description: "Focused on measurable energy savings and ROI" },
    ],
    community: [
      { title: "Active Community", description: "Connect with others on the same sustainable journey" },
      { title: "Weekly Updates", description: "Fresh content on products, trends, and our build" },
      { title: "Exclusive Access", description: "Early access to tools, guides, and build updates" },
      { title: "Free to Join", description: "No cost to participate in our community channels" },
    ],
    utility: [
      { title: "Our Mission", description: "Making sustainable living accessible to every homeowner" },
      { title: "AI + Sustainability", description: "Unique blend of technology and green building expertise" },
      { title: "Transparent", description: "Honest reviews, real build documentation, clear affiliations" },
      { title: "Community First", description: "Built for homeowners, by people who are building too" },
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

function defaultTimeline(label: string): PageTimelineItem[] {
  return [
    { title: "Planning Phase", status: "complete", date: "Q1 2025", description: `Completed initial research and planning for ${label.toLowerCase()}` },
    { title: "Design & Specs", status: "in-progress", date: "Q2 2025", description: "Finalizing specifications and sourcing materials" },
    { title: "Implementation", status: "planned", date: "Q3 2025", description: "Construction and installation phase" },
    { title: "Testing & Certification", status: "planned", date: "Q4 2025", description: "Performance verification and final documentation" },
  ];
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
  "/passive-house": {
    intro: "We're building a certified eco-modern passive house from the ground up. Follow every decision — from site selection to move-in day — with full transparency on costs, materials, and lessons learned.",
    timeline: [
      { title: "Site Selection & Analysis", status: "complete", date: "Jan 2025", description: "Lot purchased with optimal south-facing orientation" },
      { title: "Architect & PHPP Modeling", status: "complete", date: "Mar 2025", description: "Passive House Planning Package completed" },
      { title: "Permitting", status: "in-progress", date: "Jun 2025", description: "Building permits submitted and under review" },
      { title: "Foundation & Envelope", status: "planned", date: "Fall 2025", description: "Groundbreaking and airtight shell construction" },
      { title: "Systems Installation", status: "planned", date: "Winter 2025", description: "ERV, heat pump, and solar PV installation" },
      { title: "Certification & Move-In", status: "planned", date: "Spring 2026", description: "Blower door test, Passive House certification, keys!" },
    ],
  },
  "/passive-house/journal": {
    intro: "Weekly updates from our passive house build site. Photos, decisions, challenges, and wins — documented in real time.",
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
    intro: "Join thousands of homeowners getting weekly eco product picks, AI smart home trends, energy savings tips, and exclusive updates from our passive house build.",
    ctaLabel: "Subscribe Free",
    ctaHref: "#subscribe",
  },
  "/about": {
    intro: "EcoModern Living is an AI-powered sustainable living platform. We combine curated eco products, intelligent home tools, and real-world passive house expertise to help you build a greener home.",
    highlights: [
      "Founded by sustainability and AI enthusiasts",
      "Building a real passive house — documented openly",
      "60+ curated product categories with affiliate partnerships",
      "Free AI tools for energy audits and home upgrades",
    ],
  },
  "/contact": {
    intro: "Have a question about sustainable living, our passive house build, or partnership opportunities? We'd love to hear from you.",
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
  const override = contentOverrides[href] ?? {};

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
      category === "passive-house" ? "From our real build experience" : "Free resources and tools available",
    ],
    features: defaultFeatures(label, category),
    products:
      category === "marketplace"
        ? marketplaceProducts[slug] ?? defaultProducts(label)
        : undefined,
    steps: defaultSteps(category).length > 0 ? defaultSteps(category) : undefined,
    timeline: category === "passive-house" ? defaultTimeline(label) : undefined,
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
