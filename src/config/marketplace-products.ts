/**
 * Amazon marketplace product catalog — imported from affiliate spreadsheet.
 * Regenerate: node scripts/import-affiliate-xlsx.mjs
 *
 * Prefer editing data/marketplace-products.csv or Google Sheet (MARKETPLACE_SHEET_CSV_URL).
 */

import type { PageProduct } from "./page-content";

function product(
  name: string,
  amazonUrl: string,
  description = "Curated eco-friendly pick for sustainable modern homes.",
  tag?: string
): PageProduct {
  return { name, amazonUrl, description, tag: tag || undefined };
}

export const marketplaceProducts: Record<string, PageProduct[]> = {
  "air-purifiers": [
    product("Airthings View Plus Indoor Air Quality Monitor", "https://www.amazon.com/dp/B097YW5Q72?tag=ecomodernliving-20&linkCode=ll2"),
    product("Temtop Air Quality Monitor", "https://www.amazon.com/dp/B0D1K7GNPM?tag=ecomodernliving-20&linkCode=ll2"),
    product("HEPA Air Purifier for Home", "https://www.amazon.com/dp/B0BGPF71Q6?tag=ecomodernliving-20&linkCode=ll2"),
    product("Energy Efficient Dehumidifier", "https://www.amazon.com/dp/B0DXKRFFGM?tag=ecomodernliving-20&linkCode=ll2"),
    product("Whole House Humidifier", "https://www.amazon.com/dp/B01MR4Y0CZ?tag=ecomodernliving-20&linkCode=ll2"),
    product("VOC Indoor Air Quality Detector", "https://www.amazon.com/dp/B08W8KS8D3?tag=ecomodernliving-20&linkCode=ll2"),
    product("Infrared Sauna Blanket", "https://www.amazon.com/dp/B09PSKN6X3?tag=ecomodernliving-20&linkCode=ll2"),
    product("Red Light Therapy Panel", "https://www.amazon.com/dp/B0C77RVG2X?tag=ecomodernliving-20&linkCode=ll2"),
    product("Whole House Water Filter System", "https://www.amazon.com/dp/B09JG2SWVC?tag=ecomodernliving-20&linkCode=ll2"),
    product("Circadian Rhythm Lighting System", "https://www.amazon.com/dp/B0DGW46BW3?tag=ecomodernliving-20&linkCode=ll2"),
    product("Medical Grade HEPA Air Purifier", "https://www.amazon.com/dp/B01728NLRG?tag=ecomodernliving-20&linkCode=ll2"),
    product("Levoit Core 400S Smart Air Purifier", "https://www.amazon.com/s?k=levoit+core+400s"),
    product("Coway Airmega Air Purifier", "https://www.amazon.com/s?k=coway+airmega"),
  ],
  "composting": [
    product("Lomi Kitchen Composter", "https://www.amazon.com/dp/B0CVNNKPRP?tag=ecomodernliving-20&linkCode=ll2"),
    product("Countertop Compost Bin", "https://www.amazon.com/dp/B015DRQ36E?tag=ecomodernliving-20&linkCode=ll2"),
    product("Food Waste Recycler", "https://www.amazon.com/dp/B0C777PL71?tag=ecomodernliving-20&linkCode=ll2"),
    product("Vitamix Professional Blender", "https://www.amazon.com/dp/B0BWSJVTCJ?tag=ecomodernliving-20&linkCode=ll2"),
    product("Berkey Water Filtration System", "https://www.amazon.com/dp/B09C59M3YY?tag=ecomodernliving-20&linkCode=ll2"),
    product("Whole Home Water Filtration System", "https://www.amazon.com/dp/B083NPW1DN?tag=ecomodernliving-20&linkCode=ll2"),
    product("FCMP Outdoor Compost Tumbler", "https://www.amazon.com/s?k=fcmp+outdoor+compost+tumbler"),
    product("Miracle-Gro Dual Chamber Composter", "https://www.amazon.com/s?k=miracle+gro+composter"),
  ],
  "eco-paints": [
    product("ECOS Low VOC Eco-Friendly Paint", "https://www.amazon.com/s?k=ecos+paint"),
    product("Rust-Oleum Low VOC Paint", "https://www.amazon.com/s?k=low+voc+paint"),
  ],
  "ev-chargers": [
    product("ChargePoint Home Flex Level 2 EV Charger", "https://www.amazon.com/s?k=chargepoint+home+flex"),
    product("Emporia Level 2 EV Charger", "https://www.amazon.com/s?k=emporia+ev+charger"),
  ],
  "furniture": [
    product("Organic Natural Mattress", "https://www.amazon.com/dp/B0DTTN5YMW?tag=ecomodernliving-20&linkCode=ll2"),
    product("Organic Cotton Bedding Set", "https://www.amazon.com/dp/B09JTTQ66V?tag=ecomodernliving-20&linkCode=ll2"),
    product("Natural Wool Area Rug", "https://www.amazon.com/dp/B07JJDS9XP?tag=ecomodernliving-20&linkCode=ll2"),
    product("GreenPan Ceramic Nonstick Cookware", "https://www.amazon.com/dp/B08T4Q3CNY?tag=ecomodernliving-20&linkCode=ll2"),
    product("Caraway Non-Toxic Cookware Set", "https://www.amazon.com/dp/B08XLDWJYV?tag=ecomodernliving-20&linkCode=ll2"),
    product("Stasher Reusable Silicone Storage Bags", "https://www.amazon.com/dp/B087XBR564?tag=ecomodernliving-20&linkCode=ll2"),
    product("Bamboo Standing Desk", "https://www.amazon.com/dp/B08DK1WS6S?tag=ecomodernliving-20&linkCode=ll2"),
    product("Electric Standing Desk", "https://www.amazon.com/dp/B0F8MHPVPH?tag=ecomodernliving-20&linkCode=ll2"),
    product("Energy Efficient Computer Monitor", "https://www.amazon.com/dp/B0F1HNQTN2?tag=ecomodernliving-20&linkCode=ll2"),
    product("LED Energy Saving Desk Lamp", "https://www.amazon.com/dp/B0F1HNQTN2?tag=ecomodernliving-20&linkCode=ll2"),
  ],
  "heat-pumps": [
    product("Smart HVAC Air Vent", "https://www.amazon.com/dp/B0792R5KJF?tag=ecomodernliving-20&linkCode=ll2"),
    product("MERV 13 High Efficiency Air Filter", "https://www.amazon.com/dp/B01CR9K33K?tag=ecomodernliving-20&linkCode=ll2"),
    product("Smart Temperature Room Sensor", "https://www.amazon.com/dp/B07NQVWRR3?tag=ecomodernliving-20&linkCode=ll2"),
    product("HVAC Duct Sealing Kit", "https://www.amazon.com/dp/B07PDRY2T2?tag=ecomodernliving-20&linkCode=ll2"),
    product("Air Flow Balancing Register", "https://www.amazon.com/dp/B0BPXKVZXV?tag=ecomodernliving-20&linkCode=ll2"),
  ],
  "indoor-gardening": [
    product("AeroGarden Indoor Garden System", "https://www.amazon.com/dp/B0B6BB4TVC?tag=ecomodernliving-20&linkCode=ll2"),
    product("Gardyn Indoor Hydroponic Garden", "https://www.amazon.com/dp/B0CJ4HWMCS?tag=ecomodernliving-20&linkCode=ll2"),
    product("Click and Grow Smart Garden", "https://www.amazon.com/dp/B01MRVMKQH?tag=ecomodernliving-20&linkCode=ll2"),
    product("Hydroponic Growing System", "https://www.amazon.com/dp/B08DLMRKHM?tag=ecomodernliving-20&linkCode=ll2"),
    product("Indoor Greenhouse Growing Kit", "https://www.amazon.com/dp/B0FL7V6PYB?tag=ecomodernliving-20&linkCode=ll2"),
    product("AeroGarden Harvest Indoor Garden", "https://www.amazon.com/s?k=aerogarden+harvest"),
    product("iDOO Hydroponic Garden System", "https://www.amazon.com/s?k=idoo+hydroponic+garden"),
  ],
  "smart-home": [
    product("Sense Home Energy Monitor", "https://www.amazon.com/dp/B0C79PNK84?tag=ecomodernliving-20&linkCode=ll2"),
    product("Emporia Vue Smart Home Energy Monitor", "https://www.amazon.com/dp/B0C7B1LKDW?tag=ecomodernliving-20&linkCode=ll2"),
    product("Kasa Smart Plug Mini", "https://www.amazon.com/dp/B091699Z3W?tag=ecomodernliving-20&linkCode=ll2"),
    product("Smart Energy Saving Power Strip", "https://www.amazon.com/dp/B07G95FFN3?tag=ecomodernliving-20&linkCode=ll2"),
    product("Smart Electrical Panel Energy Monitor", "https://www.amazon.com/dp/B0D6X5GW5N?tag=ecomodernliving-20&linkCode=ll2"),
    product("Energy Efficient Induction Cooktop", "https://www.amazon.com/dp/B0B4J6PXPN?tag=ecomodernliving-20&linkCode=ll2"),
    product("Portable Induction Burner", "https://www.amazon.com/dp/B0DM6VPPQS?tag=ecomodernliving-20&linkCode=ll2"),
    product("ENERGY STAR Refrigerator", "https://www.amazon.com/dp/B0G443NKSP?tag=ecomodernliving-20&linkCode=ll2"),
    product("Energy Saving Washing Machine", "https://www.amazon.com/dp/B0799Q45TT?tag=ecomodernliving-20&linkCode=ll2"),
    product("Heat Pump Clothes Dryer", "https://www.amazon.com/dp/B082YGFMQZ?tag=ecomodernliving-20&linkCode=ll2"),
    product("Philips Hue Smart Lighting System", "https://www.amazon.com/dp/B0FMGP1P6W?tag=ecomodernliving-20&linkCode=ll2"),
    product("Lutron Caseta Smart Lighting Control", "https://www.amazon.com/dp/B07DX5QRB8?tag=ecomodernliving-20&linkCode=ll2"),
    product("Aqara Smart Home Sensors", "https://www.amazon.com/dp/B09TP7VMKB?tag=ecomodernliving-20&linkCode=ll2"),
    product("SwitchBot Smart Home Automation", "https://www.amazon.com/dp/B0DKXZZ79Z?tag=ecomodernliving-20&linkCode=ll2"),
    product("Smart WiFi Door Lock", "https://www.amazon.com/dp/B0F61WG9F2?tag=ecomodernliving-20&linkCode=ll2"),
    product("EGO Battery Powered Lawn Mower", "https://www.amazon.com/dp/B0857KWHHC?tag=ecomodernliving-20&linkCode=ll2"),
    product("Greenworks Electric Lawn Mower", "https://www.amazon.com/dp/B0CLSC6B2T?tag=ecomodernliving-20&linkCode=ll2"),
    product("Worx Landroid Robotic Lawn Mower", "https://www.amazon.com/dp/B0GQMG6ZJ3?tag=ecomodernliving-20&linkCode=ll2"),
    product("Battery Powered Leaf Blower", "https://www.amazon.com/dp/B0DJJB7WS9?tag=ecomodernliving-20&linkCode=ll2"),
    product("Battery Powered String Trimmer", "https://www.amazon.com/dp/B018S68U40?tag=ecomodernliving-20&linkCode=ll2"),
  ],
  "smart-thermostats": [
    product("Google Nest Learning Thermostat", "https://www.amazon.com/dp/B08HRWWCTR?tag=ecomodernliving-20&linkCode=ll2"),
    product("ecobee Smart Thermostat Premium", "https://www.amazon.com/dp/B09XXS48P8?tag=ecomodernliving-20&linkCode=ll2"),
  ],
  "solar": [
    product("Jackery Solar Generator", "https://www.amazon.com/dp/B0D2L1G66J?tag=ecomodernliving-20&linkCode=ll2"),
    product("EcoFlow Portable Power Station", "https://www.amazon.com/dp/B0B9XB57XM?tag=ecomodernliving-20&linkCode=ll2"),
    product("BLUETTI Solar Generator", "https://www.amazon.com/dp/B0C1SMJTDT?tag=ecomodernliving-20&linkCode=ll2"),
    product("Solar Powered Outdoor Lights", "https://www.amazon.com/dp/B09F3DJNGF?tag=ecomodernliving-20&linkCode=ll2"),
    product("Solar Security Camera", "https://www.amazon.com/dp/B0CCYP6KFM?tag=ecomodernliving-20&linkCode=ll2"),
    product("Renogy Solar Panel Kit", "https://www.amazon.com/s?k=renogy+solar+panel+kit"),
  ],
  "water-fixtures": [
    product("Rachio Smart Sprinkler Controller", "https://www.amazon.com/dp/B07CZ864Y9?tag=ecomodernliving-20&linkCode=ll2"),
    product("Moen Flo Smart Water Monitor", "https://www.amazon.com/dp/B00C03D01Q?tag=ecomodernliving-20&linkCode=ll2"),
    product("Rainwater Collection Barrel", "https://www.amazon.com/dp/B00YFT9846?tag=ecomodernliving-20&linkCode=ll2"),
    product("Smart Water Leak Detector", "https://www.amazon.com/dp/B0DQLDBXWF?tag=ecomodernliving-20&linkCode=ll2"),
    product("Smart Water Shutoff Valve", "https://www.amazon.com/dp/B084WYB8PM?tag=ecomodernliving-20&linkCode=ll2"),
    product("Water Saving Low Flow Shower Head", "https://www.amazon.com/dp/B08WPQ12XX?tag=ecomodernliving-20&linkCode=ll2"),
    product("Water Saving Faucet Aerator", "https://www.amazon.com/dp/B09ZNWP8YX?tag=ecomodernliving-20&linkCode=ll2"),
    product("Dual Flush Toilet Conversion Kit", "https://www.amazon.com/dp/B00B9BNGU0?tag=ecomodernliving-20&linkCode=ll2"),
    product("High Efficiency Water Saving Toilet", "https://www.amazon.com/dp/B09WYQCPMP?tag=ecomodernliving-20&linkCode=ll2"),
    product("High Sierra Water Saving Showerhead", "https://www.amazon.com/s?k=high+sierra+showerhead"),
    product("Niagara Earth Massage Water Saving Showerhead", "https://www.amazon.com/s?k=niagara+earth+massage+showerhead"),
  ],
};
