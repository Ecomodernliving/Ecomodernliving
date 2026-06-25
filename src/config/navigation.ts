import { siteConfig } from "@/config/site";

export type NavIconName =
  | "airVent"
  | "award"
  | "bookOpen"
  | "bot"
  | "building2"
  | "calculator"
  | "camera"
  | "clipboardList"
  | "compass"
  | "cpu"
  | "dollarSign"
  | "download"
  | "droplets"
  | "fileText"
  | "flame"
  | "graduationCap"
  | "hammer"
  | "handshake"
  | "home"
  | "house"
  | "leaf"
  | "lightbulb"
  | "mapPin"
  | "messageCircle"
  | "paintbrush"
  | "palette"
  | "plug"
  | "recycle"
  | "search"
  | "shield"
  | "shoppingBag"
  | "smartphone"
  | "sofa"
  | "sparkles"
  | "sun"
  | "thermometer"
  | "treePine"
  | "users"
  | "video"
  | "wind"
  | "zap";

export type NavLink = {
  label: string;
  href: string;
  description?: string;
  icon?: NavIconName;
  badge?: string;
  external?: boolean;
};

export type NavSection = {
  title: string;
  links: NavLink[];
};

export type NavItem = {
  label: string;
  href?: string;
  badge?: string;
  featured?: NavLink;
  sections?: NavSection[];
};

export const mainNavigation: NavItem[] = [
  {
    label: "Marketplace",
    featured: {
      label: "Shop All Eco Products",
      href: "/marketplace",
      description:
        "Curated sustainable products with affiliate partnerships across Amazon, Home Depot, Lowe's & more.",
      icon: "shoppingBag",
      badge: "New",
    },
    sections: [
      {
        title: "Building & Envelope",
        links: [
          { label: "Passive House Materials", href: "/marketplace/passive-house-materials", description: "Airtight membranes, ERVs, triple-glazed units", icon: "shield" },
          { label: "Energy-Efficient Windows", href: "/marketplace/windows", description: "Triple-pane, low-E, tilt-turn systems", icon: "home" },
          { label: "Insulation Products", href: "/marketplace/insulation", description: "Mineral wool, cellulose, rigid foam", icon: "flame" },
          { label: "Green Roofing", href: "/marketplace/green-roofing", description: "Cool roofs, living roofs, solar-ready", icon: "treePine" },
          { label: "Eco Paints & Finishes", href: "/marketplace/eco-paints", description: "Low-VOC, natural, zero-emission coatings", icon: "paintbrush" },
        ],
      },
      {
        title: "Energy & Climate",
        links: [
          { label: "Solar Products", href: "/marketplace/solar", description: "Panels, inverters, batteries, monitoring", icon: "sun" },
          { label: "Heat Pumps", href: "/marketplace/heat-pumps", description: "Air-source, ground-source, mini-splits", icon: "thermometer" },
          { label: "Smart Thermostats", href: "/marketplace/smart-thermostats", description: "Learning controls for max efficiency", icon: "cpu" },
          { label: "EV Chargers", href: "/marketplace/ev-chargers", description: "Level 2 home & garage installations", icon: "plug" },
        ],
      },
      {
        title: "Home & Living",
        links: [
          { label: "Water-Saving Fixtures", href: "/marketplace/water-fixtures", description: "Low-flow, greywater, rainwater systems", icon: "droplets" },
          { label: "Air Purifiers", href: "/marketplace/air-purifiers", description: "HEPA, ERV-integrated, VOC removal", icon: "wind" },
          { label: "Non-Toxic Furniture", href: "/marketplace/furniture", description: "Solid wood, FSC-certified, zero formaldehyde", icon: "sofa" },
          { label: "Sustainable Flooring", href: "/marketplace/flooring", description: "Bamboo, cork, reclaimed, LVT alternatives", icon: "hammer" },
          { label: "Indoor Gardening", href: "/marketplace/indoor-gardening", description: "Hydroponics, grow lights, compost bins", icon: "leaf" },
        ],
      },
      {
        title: "Smart & Specialty",
        links: [
          { label: "Smart Home Systems", href: "/marketplace/smart-home", description: "Automation, sensors, energy monitoring", icon: "smartphone" },
          { label: "Tiny Homes & ADUs", href: "/marketplace/tiny-homes-adus", description: "Prefabricated, modular, accessory units", icon: "house" },
          { label: "Composting Systems", href: "/marketplace/composting", description: "Countertop to full backyard solutions", icon: "recycle" },
          { label: "Affiliate Partners", href: "/marketplace/partners", description: "Amazon, Home Depot, Lowe's, Wayfair & more", icon: "handshake" },
        ],
      },
    ],
  },
  {
    label: "AI Tools",
    badge: "AI",
    featured: {
      label: "Try AI Home Advisor",
      href: "/ai/home-advisor",
      description: "Upload photos, floor plans & bills — get personalized sustainable upgrade recommendations.",
      icon: "bot",
      badge: "Popular",
    },
    sections: [
      {
        title: "AI-Powered Tools",
        links: [
          { label: "Sustainable Home Advisor", href: "/ai/home-advisor", description: "Upload images & bills for upgrade plans", icon: "compass" },
          { label: "Green Product Recommender", href: "/ai/product-recommender", description: "Ask anything — get products with ROI estimates", icon: "sparkles" },
          { label: "Eco Interior Design", href: "/ai/interior-design", description: "Upload a room → get eco-modern redesigns", icon: "palette" },
          { label: "Home Energy Audit", href: "/ai/energy-audit", description: "Estimate waste, solar savings & tax credits", icon: "zap" },
        ],
      },
      {
        title: "SaaS (Coming Soon)",
        links: [
          { label: "Green Renovation Planner", href: "/ai/renovation-planner", description: "Cost, materials, energy savings & ROI", icon: "calculator" },
          { label: "Sustainable Material Finder", href: "/ai/material-finder", description: "Low-carbon alternatives to conventional materials", icon: "search" },
          { label: "Building Code Assistant", href: "/ai/building-codes", description: "Permits, codes & compliance guidance", icon: "fileText" },
        ],
      },
    ],
  },
  {
    label: "Guides",
    featured: {
      label: "Browse All Guides",
      href: "/guides",
      description: "In-depth articles, reviews & how-tos for sustainable living and green construction.",
      icon: "bookOpen",
    },
    sections: [
      {
        title: "Sustainable Living",
        links: [
          { label: "Zero Waste Homes", href: "/guides/zero-waste", description: "Reduce, reuse, compost at home", icon: "recycle" },
          { label: "Non-Toxic Kitchens", href: "/guides/non-toxic-kitchens", description: "Safe cookware, surfaces & air quality", icon: "home" },
          { label: "Eco Baby & Parenting", href: "/guides/eco-parenting", description: "Non-toxic nurseries & sustainable parenting", icon: "users" },
          { label: "Healthy Homes", href: "/guides/healthy-homes", description: "Indoor air, mold prevention, wellness design", icon: "airVent" },
        ],
      },
      {
        title: "Green Construction",
        links: [
          { label: "Passive House Basics", href: "/guides/passive-house", description: "Principles, standards & certification paths", icon: "shield" },
          { label: "Net-Zero Homes", href: "/guides/net-zero", description: "Design strategies for energy independence", icon: "sun" },
          { label: "ADU Design", href: "/guides/adu-design", description: "Accessory dwelling unit planning & permits", icon: "building2" },
          { label: "Tiny Homes", href: "/guides/tiny-homes", description: "Design, zoning & off-grid living", icon: "house" },
          { label: "Eco Architecture", href: "/guides/eco-architecture", description: "Biophilic, regenerative & circular design", icon: "lightbulb" },
        ],
      },
      {
        title: "Reviews & Incentives",
        links: [
          { label: "Product Reviews", href: "/guides/reviews", description: "Best eco sofas, cooktops, heat pumps & more", icon: "award" },
          { label: "AI + Smart Living", href: "/guides/ai-smart-living", description: "Automation, climate optimization & AI tools", icon: "cpu" },
          { label: "Tax Credits & Grants", href: "/guides/incentives", description: "Solar credits, EV rebates & state programs", icon: "dollarSign" },
        ],
      },
    ],
  },
  {
    label: "Passive House",
    badge: "Learn",
    featured: {
      label: "Passive House Guide",
      href: "/passive-house",
      description: "Principles, certification, calculators, product picks & 100+ FAQs for homeowners.",
      icon: "bookOpen",
    },
    sections: [
      {
        title: "Education Hub",
        links: [
          { label: "Passive House Guide", href: "/passive-house", description: "Comprehensive overview, benefits, certification & ROI", icon: "bookOpen" },
          { label: "Five Principles", href: "/passive-house-principles", description: "Insulation, airtightness, windows, bridges & ventilation", icon: "shield" },
          { label: "Product Guide", href: "/passive-house-products", description: "Windows, insulation, ERVs, heat pumps & solar mapped to systems", icon: "shoppingBag" },
          { label: "Calculators", href: "/passive-house-calculators", description: "Heat loss, R-value, ACH50, energy savings & ROI tools", icon: "calculator" },
          { label: "FAQ (100+)", href: "/passive-house-faq", description: "Searchable answers on design, construction & certification", icon: "fileText" },
        ],
      },
      {
        title: "Planning & Design",
        links: [
          { label: "Why Passive House?", href: "/passive-house/vision", description: "Benefits, comfort, health & long-term savings", icon: "compass" },
          { label: "Design & PHPP", href: "/passive-house/design", description: "Energy modeling, form factor & orientation", icon: "palette" },
          { label: "Site & Climate", href: "/passive-house/site", description: "Lot selection, solar access & climate zones", icon: "mapPin" },
          { label: "Certification Path", href: "/passive-house/timeline", description: "Steps from design review to blower door test", icon: "clipboardList" },
        ],
      },
      {
        title: "Building Systems",
        links: [
          { label: "Envelope & Insulation", href: "/passive-house/envelope", description: "Airtight layer, windows & thermal bridge-free design", icon: "shield" },
          { label: "HVAC & Ventilation", href: "/passive-house/hvac", description: "ERV, heat pump & passive cooling strategies", icon: "airVent" },
          { label: "Solar & Energy", href: "/passive-house/solar", description: "PV sizing, battery storage & net metering", icon: "sun" },
          { label: "Recommended Materials", href: "/passive-house/materials", description: "Insulation, windows, membranes & ventilation products", icon: "hammer" },
        ],
      },
      {
        title: "Costs & Research",
        links: [
          { label: "Cost & ROI Guide", href: "/passive-house/costs", description: "Budget expectations, payback & lifecycle savings", icon: "calculator" },
          { label: "Case Studies", href: "/passive-house/before-after", description: "Real-world passive house examples & performance results", icon: "sparkles" },
          { label: "Articles & Insights", href: "/passive-house/journal", description: "Educational articles on passive house topics", icon: "camera" },
          { label: "Tax Credits & Grants", href: "/guides/incentives", description: "Federal and state programs that reduce project costs", icon: "dollarSign" },
        ],
      },
    ],
  },
  {
    label: "Services",
    sections: [
      {
        title: "For Homeowners",
        links: [
          { label: "Sustainable Home Consulting", href: "/services/consulting", description: "Personalized green upgrade roadmaps", icon: "compass" },
          { label: "Digital Products", href: "/services/digital-products", description: "Checklists, planners & audit templates", icon: "download" },
          { label: "Online Courses", href: "/services/courses", description: "Passive house, eco renovations & AI smart homes", icon: "graduationCap" },
        ],
      },
      {
        title: "For Professionals",
        links: [
          { label: "Builder & Architect Partners", href: "/services/b2b-partners", description: "Green sourcing, AI workflows & energy optimization", icon: "handshake" },
          { label: "B2B AI Automation", href: "/services/ai-automation", description: "Support bots, lead qualification & quote automation", icon: "bot" },
          { label: "Lead Generation", href: "/services/leads", description: "Solar, HVAC, EV charger & roofing referrals", icon: "users" },
        ],
      },
    ],
  },
  {
    label: "Community",
    sections: [
      {
        title: "Connect",
        links: [
          { label: "Newsletter", href: "/community/newsletter", description: "Weekly eco products, AI trends & savings tips", icon: "messageCircle" },
          { label: "YouTube Channel", href: siteConfig.social.youtube, description: "Home tours, reviews & passive house education", icon: "video", external: true },
          { label: "Forum & Discord", href: siteConfig.social.discord, description: "Discuss eco living, smart homes & architecture", icon: "users", external: true },
        ],
      },
      {
        title: "Discover",
        links: [
          { label: "Eco Homes Marketplace", href: "/eco-homes", description: "Green-certified, passive & solar-powered listings", icon: "building2" },
          { label: "Instagram", href: siteConfig.social.instagram, description: "Minimalist eco interiors & sustainable design inspiration", icon: "camera", external: true },
          { label: "Pinterest", href: siteConfig.social.pinterest, description: "Scandinavian eco design inspiration", icon: "camera", external: true },
          { label: "EcoModern Store", href: "/store", description: "Our brand — decor, kits & planners (coming soon)", icon: "shoppingBag", badge: "Soon" },
        ],
      },
    ],
  },
];

export const utilityLinks: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
