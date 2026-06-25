export type EnergyEstimate = {
  monthlyBill: number;
  sqft: number;
  state: string;
  efficiencySavingsMonthly: number;
  efficiencySavingsAnnual: number;
  solarOffsetAnnual: number;
  federalTaxCreditEstimate: number;
  summary: string;
};

/** State-level solar production factor (0.7–1.15 vs national average). */
const SOLAR_FACTOR: Record<string, number> = {
  AZ: 1.15,
  CA: 1.12,
  CO: 1.08,
  FL: 1.05,
  GA: 1.02,
  HI: 1.1,
  NV: 1.14,
  NM: 1.12,
  NC: 1.0,
  NY: 0.88,
  OR: 0.82,
  TX: 1.1,
  UT: 1.1,
  WA: 0.75,
};

function normalizeState(state: string): string {
  const trimmed = state.trim().toUpperCase();
  if (trimmed.length === 2) return trimmed;
  const map: Record<string, string> = {
    CALIFORNIA: "CA",
    TEXAS: "TX",
    FLORIDA: "FL",
    "NEW YORK": "NY",
    ARIZONA: "AZ",
    COLORADO: "CO",
    WASHINGTON: "WA",
    OREGON: "OR",
    GEORGIA: "GA",
    "NORTH CAROLINA": "NC",
    NEVADA: "NV",
    HAWAII: "HI",
    UTAH: "UT",
    "NEW MEXICO": "NM",
  };
  return map[trimmed] ?? trimmed.slice(0, 2);
}

export function calculateEnergyEstimate(
  sqft: number,
  monthlyBill: number,
  state: string
): EnergyEstimate {
  const stateCode = normalizeState(state);
  const solarFactor = SOLAR_FACTOR[stateCode] ?? 1.0;

  // Typical efficiency upgrade savings: 20–30% based on home size
  const efficiencyRate = sqft > 2500 ? 0.22 : sqft > 1500 ? 0.25 : 0.28;
  const efficiencySavingsMonthly = Math.round(monthlyBill * efficiencyRate);
  const efficiencySavingsAnnual = efficiencySavingsMonthly * 12;

  // Solar can offset ~45–70% of bill depending on climate
  const solarOffsetRate = Math.min(0.7, 0.45 * solarFactor);
  const solarOffsetAnnual = Math.round(monthlyBill * 12 * solarOffsetRate);

  // Federal solar ITC ~30% on a rough $3/watt install estimate
  const estimatedSystemCost = sqft * 4.5;
  const federalTaxCreditEstimate = Math.round(estimatedSystemCost * 0.3);

  const summary =
    `Based on ${sqft.toLocaleString()} sq ft in ${state.trim()}, ` +
    `you could save ~$${efficiencySavingsMonthly}/mo ($${efficiencySavingsAnnual.toLocaleString()}/yr) ` +
    `with efficiency upgrades, and offset up to ~$${solarOffsetAnnual.toLocaleString()}/yr with solar.`;

  return {
    monthlyBill,
    sqft,
    state: state.trim(),
    efficiencySavingsMonthly,
    efficiencySavingsAnnual,
    solarOffsetAnnual,
    federalTaxCreditEstimate,
    summary,
  };
}
