import type { PageContent } from "./page-content";
import { marketplaceProducts } from "./marketplace-products";

function pickProducts(...slugs: string[]) {
  return slugs.flatMap((s) => marketplaceProducts[s] ?? []).slice(0, 12);
}

/** Rich content overrides for Passive House education hub pages */
export const passiveHouseContentOverrides: Partial<Record<string, Partial<PageContent>>> = {
  "/passive-house": {
    intro:
      "Passive House is the world's most rigorous building energy standard. This hub brings together certification-level education, calculators, product guides, and 100+ FAQs to help homeowners plan smarter projects.",
    highlights: [
      "≤ 0.6 ACH50 airtightness (blower door tested)",
      "≤ 4.75 kBtu/(ft²·yr) heating demand",
      "≤ 3.17 Btu/(hr·ft²) peak heat load",
      "Continuous ventilation with ≥75% heat recovery",
      "Thermal comfort in every room, every season",
      "Classic, Plus, and Premium certification paths",
    ],
    tips: [
      "Start with our Principles guide if you're new to Passive House",
      "Use calculators to estimate heat loss and airtightness targets",
      "Browse curated products mapped to each building system",
      "Search the FAQ for answers on design, costs, and certification",
    ],
    ctaLabel: "Explore Principles",
    ctaHref: "/passive-house-principles",
  },
  "/passive-house-principles": {
    intro:
      "Five interconnected principles define every certified Passive House. Master these before sizing HVAC or selecting solar — the envelope does the heavy lifting.",
    highlights: [
      "1. Super insulation — continuous, climate-tuned R-values",
      "2. Airtight construction — ≤0.6 ACH50, designed not accidental",
      "3. High-performance windows — triple-pane, tuned SHGC",
      "4. Thermal-bridge-free design — Ψ and χ minimized at every junction",
      "5. Heat-recovery ventilation — balanced, filtered fresh air",
    ],
    features: [
      { title: "Super Insulation", description: "Wrap the thermal envelope in continuous insulation sized for your climate and building form — typically R-38 to R-60+ for single-family homes in cool climates." },
      { title: "Airtight Construction", description: "A dedicated air barrier layer prevents uncontrolled infiltration, moisture damage, and wasted heat. Target ≤0.6 air changes per hour at 50 Pascals." },
      { title: "High-Performance Windows", description: "Triple-pane units with low U-factors and orientation-tuned solar heat gain coefficients keep surfaces warm and balance solar gains." },
      { title: "Thermal Bridge Free", description: "Detail every junction — slab edges, balconies, roof connections — so heat cannot shortcut through the insulation." },
      { title: "Heat Recovery Ventilation", description: "Balanced ERV/HRV systems deliver filtered fresh air while recovering up to 90%+ of exhaust heat." },
    ],
    ctaLabel: "View Products",
    ctaHref: "/passive-house-products",
  },
  "/passive-house-products": {
    intro:
      "Every Passive House system maps to curated affiliate products we've researched for performance, availability, and value. Always verify specs against your PHPP model.",
    products: pickProducts(
      "heat-pumps",
      "smart-thermostats",
      "solar",
      "air-purifiers",
      "smart-home",
      "water-fixtures",
      "eco-paints"
    ),
    tips: [
      "Windows: prioritize certified frames with published Uf and installation psi-values",
      "Insulation: match material to assembly — mineral wool, cellulose, or rigid foam",
      "Ventilation: select ERV/HRV with ≥75% sensible recovery and F7+ filtration",
      "Heat pumps: size to peak load, not conventional oversizing rules",
    ],
    ctaLabel: "Shop Marketplace",
    ctaHref: "/marketplace/passive-house-materials",
  },
  "/passive-house-calculators": {
    intro:
      "Interactive tools based on Passive House Institute formulas. Use these for education and rough estimates — final certification requires PHPP modeling.",
    ctaLabel: "Read the FAQ",
    ctaHref: "/passive-house-faq",
  },
  "/passive-house-faq": {
    intro:
      "100+ answers on Passive House design, construction, certification, and products — searchable by topic. All content is original, written for homeowners and professionals.",
    ctaLabel: "Try Energy Audit",
    ctaHref: "/ai/energy-audit",
  },
  "/passive-house/envelope": {
    intro:
      "The thermal envelope is your home's protective shell — insulation, air barrier, and weather barrier working together. In Passive House, envelope performance determines everything downstream.",
    highlights: [
      "Continuous insulation without thermal bypasses",
      "Dedicated airtight layer with blower door verification",
      "Moisture-safe assemblies for your climate zone",
      "Exterior dimensions used for conservative heat loss calcs",
    ],
  },
  "/passive-house/hvac": {
    intro:
      "Passive House HVAC is radically smaller than conventional systems. Ventilation with heat recovery is mandatory; heating and cooling are supplementary.",
    highlights: [
      "Balanced ERV/HRV — not window ventilation",
      "Peak heat load ≤3.17 Btu/(hr·ft²)",
      "Supply-air post-heating often sufficient",
      "Heat pump water heaters for efficient DHW",
    ],
  },
  "/passive-house/design": {
    intro:
      "Design starts with climate analysis, compact form, and PHPP energy modeling. Orientation and glazing ratios are tuned before structural details are finalized.",
    highlights: [
      "PHPP modeling from schematic design",
      "Optimize A/V ratio with compact massing",
      "South glazing balanced with summer shading",
      "Thermal bridge-free details developed early",
    ],
  },
  "/passive-house/costs": {
    intro:
      "Passive House upfront costs are real but manageable — typically 5–15% over code construction, offset by decades of energy savings, comfort, durability, and available incentives.",
    highlights: [
      "Envelope investment pays back over the building lifecycle",
      "IRA rebates up to $8,000 for heat pumps",
      "30% federal solar tax credit through 2032",
      "Experience curve reduces premiums on repeat projects",
    ],
  },
  "/guides/passive-house": {
    intro:
      "A practical introduction to Passive House for homeowners considering new construction or deep retrofits. Learn the principles, costs, and whether it's right for your project.",
    highlights: [
      "Works for homes, apartments, schools, and offices",
      "Windows open normally — ventilation runs continuously",
      "Not the same as net zero, but pairs well with solar",
      "EnerPHit standard available for retrofits",
    ],
  },
  "/guides/healthy-homes": {
    intro:
      "Healthy homes start with controlled ventilation, low-toxic materials, and moisture-safe construction. Passive House delivers all three by design.",
    tips: [
      "Continuous ERV/HRV filtration removes outdoor pollutants",
      "Airtightness prevents wall cavity moisture damage",
      "Low-VOC paints and finishes reduce chemical exposure",
      "Target 68°F and 50% RH for comfort and mold prevention",
    ],
  },
  "/ai/home-advisor": {
    intro:
      "Upload photos, floor plans, and utility bills. Our AI evaluates your home against Passive House principles — envelope upgrades, retrofit opportunities, and prioritized ROI.",
    highlights: [
      "Envelope-first upgrade sequencing",
      "Climate-appropriate insulation recommendations",
      "Thermal bridge risk identification",
      "Product matches from our curated marketplace",
    ],
  },
  "/ai/energy-audit": {
    intro:
      "Estimate energy waste, compare to Passive House targets, and score insulation and airtightness based on construction type and age.",
    highlights: [
      "ACH50 estimates by construction era",
      "Insulation scoring by assembly type",
      "Simplified heat loss analysis",
      "Solar savings and tax credit estimates",
    ],
  },
  "/ai/interior-design": {
    intro:
      "Upload a room photo for eco-modern redesigns that optimize daylighting, passive solar orientation, and thermal comfort materials.",
    highlights: [
      "Daylighting and glare control strategies",
      "Passive solar furniture placement",
      "Low-VOC material recommendations",
      "Window treatment suggestions for comfort",
    ],
  },
};
