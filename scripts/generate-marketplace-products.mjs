import fs from "fs";

const rows = [
  ["smart-thermostats", "Google Nest Learning Thermostat", "https://www.amazon.com/s?k=google+nest+learning+thermostat"],
  ["smart-thermostats", "ecobee Smart Thermostat Premium", "https://www.amazon.com/s?k=ecobee+smart+thermostat+premium"],
  ["smart-home", "Sense Home Energy Monitor", "https://www.amazon.com/s?k=Sense+Energy+Monitor"],
  ["smart-home", "Emporia Vue Smart Home Energy Monitor", "https://www.amazon.com/s?k=Emporia+Vue+Energy+Monitor"],
  ["smart-home", "Kasa Smart Plug Mini", "https://www.amazon.com/s?k=Kasa+Smart+Plug+Mini"],
  ["smart-home", "Smart Energy Saving Power Strip", "https://www.amazon.com/s?k=smart+power+strip"],
  ["smart-home", "Smart Electrical Panel Energy Monitor", "https://www.amazon.com/s?k=smart+electrical+panel"],
  ["smart-home", "Energy Efficient Induction Cooktop", "https://www.amazon.com/s?k=induction+cooktop"],
  ["smart-home", "Portable Induction Burner", "https://www.amazon.com/s?k=portable+induction+burner"],
  ["smart-home", "ENERGY STAR Refrigerator", "https://www.amazon.com/s?k=energy+star+refrigerator"],
  ["smart-home", "Energy Saving Washing Machine", "https://www.amazon.com/s?k=energy+efficient+washing+machine"],
  ["smart-home", "Heat Pump Clothes Dryer", "https://www.amazon.com/s?k=heat+pump+dryer"],
  ["smart-home", "GreenPan Ceramic Nonstick Cookware", "https://www.amazon.com/s?k=GreenPan+Cookware"],
  ["smart-home", "Caraway Non-Toxic Cookware Set", "https://www.amazon.com/s?k=Caraway+Cookware"],
  ["smart-home", "Stasher Reusable Silicone Storage Bags", "https://www.amazon.com/s?k=Stasher+Bags"],
  ["smart-home", "Vitamix Professional Blender", "https://www.amazon.com/s?k=Vitamix"],
  ["smart-home", "Philips Hue Smart Lighting System", "https://www.amazon.com/s?k=Philips+Hue"],
  ["smart-home", "Lutron Caseta Smart Lighting Control", "https://www.amazon.com/s?k=Lutron+Caseta"],
  ["smart-home", "Aqara Smart Home Sensors", "https://www.amazon.com/s?k=Aqara+Sensors"],
  ["smart-home", "SwitchBot Smart Home Automation", "https://www.amazon.com/s?k=SwitchBot"],
  ["smart-home", "Smart WiFi Door Lock", "https://www.amazon.com/s?k=smart+lock"],
  ["smart-home", "EGO Battery Powered Lawn Mower", "https://www.amazon.com/s?k=EGO+Lawn+Mower"],
  ["smart-home", "Greenworks Electric Lawn Mower", "https://www.amazon.com/s?k=Greenworks+Lawn+Mower"],
  ["smart-home", "Worx Landroid Robotic Lawn Mower", "https://www.amazon.com/s?k=Worx+Landroid"],
  ["smart-home", "Battery Powered Leaf Blower", "https://www.amazon.com/s?k=battery+leaf+blower"],
  ["smart-home", "Battery Powered String Trimmer", "https://www.amazon.com/s?k=battery+string+trimmer"],
  ["smart-home", "Circadian Rhythm Lighting System", "https://www.amazon.com/s?k=circadian+lighting"],
  ["heat-pumps", "Smart HVAC Air Vent", "https://www.amazon.com/s?k=smart+vent"],
  ["heat-pumps", "MERV 13 High Efficiency Air Filter", "https://www.amazon.com/s?k=MERV+13+air+filter"],
  ["heat-pumps", "Smart Temperature Room Sensor", "https://www.amazon.com/s?k=smart+room+sensor"],
  ["heat-pumps", "HVAC Duct Sealing Kit", "https://www.amazon.com/s?k=duct+sealing+kit"],
  ["heat-pumps", "Air Flow Balancing Register", "https://www.amazon.com/s?k=air+balancing+register"],
  ["water-fixtures", "Rachio Smart Sprinkler Controller", "https://www.amazon.com/s?k=Rachio+Smart+Sprinkler+Controller"],
  ["water-fixtures", "Moen Flo Smart Water Monitor", "https://www.amazon.com/s?k=Moen+Flo+Smart+Water+Monitor"],
  ["water-fixtures", "Rainwater Collection Barrel", "https://www.amazon.com/s?k=rain+barrel"],
  ["water-fixtures", "Smart Water Leak Detector", "https://www.amazon.com/s?k=water+leak+detector"],
  ["water-fixtures", "Smart Water Shutoff Valve", "https://www.amazon.com/s?k=smart+water+shutoff+valve"],
  ["water-fixtures", "Water Saving Low Flow Shower Head", "https://www.amazon.com/s?k=low+flow+showerhead"],
  ["water-fixtures", "Water Saving Faucet Aerator", "https://www.amazon.com/s?k=faucet+aerator"],
  ["water-fixtures", "Dual Flush Toilet Conversion Kit", "https://www.amazon.com/s?k=dual+flush+conversion+kit"],
  ["water-fixtures", "High Efficiency Water Saving Toilet", "https://www.amazon.com/s?k=water+saving+toilet"],
  ["water-fixtures", "Berkey Water Filtration System", "https://www.amazon.com/s?k=Berkey+Water+Filter"],
  ["water-fixtures", "Whole Home Water Filtration System", "https://www.amazon.com/s?k=water+filtration+system"],
  ["water-fixtures", "Whole House Water Filter System", "https://www.amazon.com/s?k=whole+house+water+filter"],
  ["water-fixtures", "High Sierra Water Saving Showerhead", "https://www.amazon.com/s?k=high+sierra+showerhead"],
  ["water-fixtures", "Niagara Earth Massage Water Saving Showerhead", "https://www.amazon.com/s?k=niagara+earth+massage+showerhead"],
  ["air-purifiers", "Airthings View Plus Indoor Air Quality Monitor", "https://www.amazon.com/s?k=Airthings+View+Plus"],
  ["air-purifiers", "Temtop Air Quality Monitor", "https://www.amazon.com/s?k=Temtop+Air+Quality+Monitor"],
  ["air-purifiers", "HEPA Air Purifier for Home", "https://www.amazon.com/s?k=HEPA+air+purifier"],
  ["air-purifiers", "Energy Efficient Dehumidifier", "https://www.amazon.com/s?k=dehumidifier"],
  ["air-purifiers", "Whole House Humidifier", "https://www.amazon.com/s?k=humidifier"],
  ["air-purifiers", "VOC Indoor Air Quality Detector", "https://www.amazon.com/s?k=VOC+detector"],
  ["air-purifiers", "Infrared Sauna Blanket", "https://www.amazon.com/s?k=infrared+sauna+blanket"],
  ["air-purifiers", "Red Light Therapy Panel", "https://www.amazon.com/s?k=red+light+therapy+panel"],
  ["air-purifiers", "Medical Grade HEPA Air Purifier", "https://www.amazon.com/s?k=medical+grade+air+purifier"],
  ["air-purifiers", "Levoit Core 400S Smart Air Purifier", "https://www.amazon.com/s?k=levoit+core+400s"],
  ["air-purifiers", "Coway Airmega Air Purifier", "https://www.amazon.com/s?k=coway+airmega"],
  ["furniture", "Organic Natural Mattress", "https://www.amazon.com/s?k=organic+mattress"],
  ["furniture", "Natural Latex Mattress", "https://www.amazon.com/s?k=natural+latex+mattress"],
  ["furniture", "Organic Cotton Bedding Set", "https://www.amazon.com/s?k=organic+bedding"],
  ["furniture", "Natural Wool Area Rug", "https://www.amazon.com/s?k=wool+rug"],
  ["furniture", "Bamboo Standing Desk", "https://www.amazon.com/s?k=bamboo+desk"],
  ["furniture", "Electric Standing Desk", "https://www.amazon.com/s?k=standing+desk"],
  ["furniture", "Energy Efficient Computer Monitor", "https://www.amazon.com/s?k=energy+efficient+monitor"],
  ["furniture", "LED Energy Saving Desk Lamp", "https://www.amazon.com/s?k=LED+desk+lamp+energy+efficient"],
  ["composting", "Lomi Kitchen Composter", "https://www.amazon.com/s?k=Lomi+Composter"],
  ["composting", "Countertop Compost Bin", "https://www.amazon.com/s?k=kitchen+compost+bin"],
  ["composting", "Food Waste Recycler", "https://www.amazon.com/s?k=food+waste+recycler"],
  ["composting", "FCMP Outdoor Compost Tumbler", "https://www.amazon.com/s?k=fcmp+outdoor+compost+tumbler"],
  ["composting", "Miracle-Gro Dual Chamber Composter", "https://www.amazon.com/s?k=miracle+gro+composter"],
  ["solar", "Jackery Solar Generator", "https://www.amazon.com/s?k=Jackery+Solar+Generator"],
  ["solar", "EcoFlow Portable Power Station", "https://www.amazon.com/s?k=EcoFlow+Power+Station"],
  ["solar", "BLUETTI Solar Generator", "https://www.amazon.com/s?k=BLUETTI+Solar+Generator"],
  ["solar", "Solar Powered Outdoor Lights", "https://www.amazon.com/s?k=solar+outdoor+lights"],
  ["solar", "Solar Security Camera", "https://www.amazon.com/s?k=solar+security+camera"],
  ["solar", "Renogy Solar Panel Kit", "https://www.amazon.com/s?k=renogy+solar+panel+kit"],
  ["indoor-gardening", "AeroGarden Indoor Garden System", "https://www.amazon.com/s?k=AeroGarden"],
  ["indoor-gardening", "Gardyn Indoor Hydroponic Garden", "https://www.amazon.com/s?k=Gardyn+Indoor+Garden"],
  ["indoor-gardening", "Click and Grow Smart Garden", "https://www.amazon.com/s?k=Click+and+Grow"],
  ["indoor-gardening", "Hydroponic Growing System", "https://www.amazon.com/s?k=hydroponic+system"],
  ["indoor-gardening", "Indoor Greenhouse Growing Kit", "https://www.amazon.com/s?k=indoor+greenhouse"],
  ["indoor-gardening", "AeroGarden Harvest Indoor Garden", "https://www.amazon.com/s?k=aerogarden+harvest"],
  ["indoor-gardening", "iDOO Hydroponic Garden System", "https://www.amazon.com/s?k=idoo+hydroponic+garden"],
  ["ev-chargers", "ChargePoint Home Flex Level 2 EV Charger", "https://www.amazon.com/s?k=chargepoint+home+flex"],
  ["ev-chargers", "Emporia Level 2 EV Charger", "https://www.amazon.com/s?k=emporia+ev+charger"],
  ["eco-paints", "ECOS Low VOC Eco-Friendly Paint", "https://www.amazon.com/s?k=ecos+paint"],
  ["eco-paints", "Rust-Oleum Low VOC Paint", "https://www.amazon.com/s?k=low+voc+paint"],
];

const bySlug = {};
for (const [slug, name, url] of rows) {
  if (!bySlug[slug]) bySlug[slug] = [];
  if (bySlug[slug].some((p) => p.name === name)) continue;
  bySlug[slug].push({ name, url });
}

let out = `/**
 * Amazon marketplace product catalog.
 *
 * HOW TO UPDATE:
 * 1. Open the marketplace page URL, e.g. /marketplace/smart-thermostats → slug is "smart-thermostats"
 * 2. Add or edit entries under that slug below
 * 3. Use p("Product Name", "https://www.amazon.com/s?k=search+terms", "Optional description", "Optional tag")
 * 4. git commit + push — Vercel redeploys automatically
 *
 * Your Amazon Associates tag (NEXT_PUBLIC_AMAZON_AFFILIATE_TAG) is appended to every link at runtime.
 */

import type { PageProduct } from "./page-content";

function p(
  name: string,
  amazonUrl: string,
  description?: string,
  tag?: string
): PageProduct {
  return {
    name,
    amazonUrl,
    description:
      description ?? "Curated eco-friendly pick for sustainable modern homes.",
    tag,
  };
}

export const marketplaceProducts: Record<string, PageProduct[]> = {
`;

for (const slug of Object.keys(bySlug).sort()) {
  out += `  "${slug}": [\n`;
  for (const { name, url } of bySlug[slug]) {
    out += `    p(${JSON.stringify(name)}, ${JSON.stringify(url)}),\n`;
  }
  out += `  ],\n`;
}
out += "};\n";

fs.writeFileSync("src/config/marketplace-products.ts", out);
console.log(`Wrote ${Object.keys(bySlug).length} categories`);
