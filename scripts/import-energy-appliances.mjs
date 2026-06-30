/**
 * Import Energy-Efficient Appliances into marketplace-catalog.json
 * Run: node scripts/import-energy-appliances.mjs
 */
import fs from "fs";
import path from "path";

const SLUG = "energy-efficient-appliances";
const CATALOG_PATH = path.join(
  process.cwd(),
  "src/data/marketplace-catalog.json"
);

const APPLIANCES = [
  ["Refrigerator", "LG", "LRFLC2706S"],
  ["Refrigerator", "LG", "LRFVS3006S"],
  ["Refrigerator", "Samsung", "RF29DB9900"],
  ["Refrigerator", "GE Profile", "PGE29BYTFS"],
  ["Refrigerator", "Bosch", "B36CT80SNS"],
  ["Refrigerator", "Whirlpool", "WRQA59CNKZ"],
  ["Refrigerator", "Frigidaire", "GRFN2853AF"],
  ["Refrigerator", "Cafe", "CVE28DP4NW2"],
  ["Dishwasher", "Bosch", "SHX78CM5N"],
  ["Dishwasher", "Bosch", "SHV9PCM3N"],
  ["Dishwasher", "LG", "LDPH7972S"],
  ["Dishwasher", "GE Profile", "PDT755SYRFS"],
  ["Dishwasher", "KitchenAid", "KDPM604KPS"],
  ["Dishwasher", "Samsung", "DW80B7070US"],
  ["Range", "GE Profile", "PHS930YPFS"],
  ["Range", "Cafe", "CHS900P2MS1"],
  ["Range", "LG", "LSIL6336F"],
  ["Range", "Samsung", "NSI6DG9900SR"],
  ["Range", "Frigidaire", "GCFI3060BF"],
  ["Wall Oven", "Bosch", "HBLP651UC"],
  ["Wall Oven", "Cafe", "CTS90DP2NS1"],
  ["Wall Oven", "KitchenAid", "KOSE900HSS"],
  ["Microwave", "Panasonic", "NN-SN97JS"],
  ["Microwave", "GE Profile", "PEM31SFSS"],
  ["Microwave", "Sharp", "SMD2470ASY"],
  ["Clothes Washer", "LG", "WM8900HBA"],
  ["Clothes Washer", "LG", "WM6500HBA"],
  ["Clothes Washer", "Samsung", "Bespoke AI Laundry Combo"],
  ["Clothes Washer", "Samsung", "WF53BB8900AT"],
  ["Clothes Washer", "GE Profile", "UltraFresh Front Load"],
  ["Clothes Washer", "Electrolux", "ELFW7637AT"],
  ["Clothes Washer", "Whirlpool", "Smart Front Load"],
  ["Clothes Washer", "Maytag", "Pet Pro Front Load"],
  ["Clothes Washer", "Bosch", "500 Series Compact"],
  ["Clothes Washer", "Miele", "W1 TwinDos"],
  ["Dryer", "LG", "DLHC5502 Heat Pump"],
  ["Dryer", "LG", "DLEX4000"],
  ["Dryer", "Samsung", "Bespoke AI Dryer"],
  ["Dryer", "Bosch", "500 Series Heat Pump"],
  ["Dryer", "Electrolux", "ELFE7637AT"],
  ["Dryer", "GE Profile", "Smart Dryer"],
  ["Dryer", "Whirlpool", "Smart Dryer"],
  ["Dryer", "Miele", "T1 Heat Pump"],
  ["Air Purifier", "Coway", "Airmega 400"],
  ["Air Purifier", "Coway", "Airmega ProX"],
  ["Air Purifier", "Blueair", "Blue Pure 211i Max"],
  ["Air Purifier", "Blueair", "DustMagnet 5440i"],
  ["Air Purifier", "Levoit", "Core 600S"],
  ["Air Purifier", "Winix", "5500-2"],
  ["Air Purifier", "Honeywell", "HPA5300"],
  ["Air Purifier", "Shark", "NeverChange MAX"],
  ["Air Purifier", "Dyson", "Purifier Big+Quiet"],
  ["Air Purifier", "Medify", "MA-112"],
  ["Dehumidifier", "Midea", "Cube 50 Pint"],
  ["Dehumidifier", "Frigidaire", "Gallery Smart"],
  ["Dehumidifier", "Honeywell", "Smart Wi-Fi"],
  ["Dehumidifier", "GE", "Energy Efficient"],
  ["Dehumidifier", "LG", "PuriCare"],
  ["Window AC", "LG", "Dual Inverter"],
  ["Window AC", "Midea", "U-Shaped Inverter"],
  ["Window AC", "GE", "ClearView"],
  ["Window AC", "Frigidaire", "Gallery QuietTemp"],
  ["Window AC", "Windmill", "Smart AC"],
  ["Smart Thermostat", "Google", "Nest Learning Thermostat"],
  ["Smart Thermostat", "Google", "Nest Thermostat"],
  ["Smart Thermostat", "ecobee", "Smart Thermostat Premium"],
  ["Smart Thermostat", "ecobee", "Enhanced"],
  ["Smart Thermostat", "Honeywell Home", "T10 Pro"],
  ["Smart Thermostat", "Emerson", "Sensi Touch 2"],
  ["Smart Thermostat", "Amazon", "Smart Thermostat"],
  ["Ceiling Fan", "Big Ass Fans", "Haiku L"],
  ["Ceiling Fan", "Hunter", "Aerodyne"],
  ["Ceiling Fan", "Casablanca", "Aya"],
  ["Ceiling Fan", "Minka Aire", "Light Wave"],
  ["Ceiling Fan", "Home Decorators Collection", "Kensgrove"],
  ["Ceiling Fan", "Harbor Breeze", "Hydra"],
  ["Robot Vacuum", "Roborock", "S8 MaxV Ultra"],
  ["Robot Vacuum", "Roborock", "Qrevo Curv"],
  ["Robot Vacuum", "iRobot", "Roomba Combo j9+"],
  ["Robot Vacuum", "Dreame", "X50 Ultra"],
  ["Robot Vacuum", "Ecovacs", "Deebot X9 Pro Omni"],
  ["Robot Vacuum", "Shark", "AI Ultra 2-in-1"],
  ["Smart Plug", "TP-Link", "Kasa EP25"],
  ["Smart Plug", "Eve", "Energy"],
  ["Smart Plug", "Meross", "Matter Smart Plug"],
  ["Smart Lighting", "Philips Hue", "White & Color Starter Kit"],
  ["Smart Lighting", "Nanoleaf", "Essentials Bulbs"],
  ["Smart Lighting", "GE Cync", "Smart Bulb Starter Kit"],
  ["Energy Monitor", "Emporia", "Vue 3"],
  ["Energy Monitor", "Sense", "Home Energy Monitor"],
  ["Water Heater Controller", "Aquanta", "Smart Water Heater Controller"],
  ["Leak Detector", "Flo", "Smart Water Monitor"],
  ["Irrigation Controller", "Rachio", "Controller 3"],
  ["EV Charger", "ChargePoint", "Home Flex"],
  ["EV Charger", "Emporia", "Level 2 EV Charger"],
  ["Portable Power", "EcoFlow", "DELTA 3 Plus"],
  ["Portable Power", "Jackery", "Explorer 2000 Plus"],
  ["Portable Power", "Bluetti", "AC200L"],
  ["Smart Blind", "SwitchBot", "Blind Tilt"],
  ["Smart Home Hub", "Aqara", "Hub M3"],
];

/** Build retailer search URLs matching the affiliate spreadsheet format. */
function storeUrls(brand, model) {
  const q = `${brand} ${model}`.trim().replace(/\s+/g, "+");
  return {
    amazon: `https://www.amazon.com/s?k=${q}`,
    homedepot: `https://www.homedepot.com/s/${q}`,
    lowes: `https://www.lowes.com/search?searchTerm=${q}`,
    wayfair: `https://www.wayfair.com/keyword.php?keyword=${q}`,
  };
}

function description(category) {
  return `ENERGY STAR-rated ${category.toLowerCase()} — compare prices at Amazon, Home Depot, Lowe's & Wayfair.`;
}

function buildListings(category, brand, model) {
  const name = `${brand} ${model}`.trim();
  const urls = storeUrls(brand, model);
  const base = {
    name,
    description: description(category),
    tag: category,
  };
  return [
    { ...base, store: "Amazon", affiliateUrl: urls.amazon },
    { ...base, store: "Home Depot", affiliateUrl: urls.homedepot },
    { ...base, store: "Lowe's", affiliateUrl: urls.lowes },
    { ...base, store: "Wayfair", affiliateUrl: urls.wayfair },
  ];
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
const listings = APPLIANCES.flatMap(([category, brand, model]) =>
  buildListings(category, brand, model)
);

catalog[SLUG] = listings;
fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + "\n", "utf8");

console.log(
  `Wrote ${APPLIANCES.length} products (${listings.length} store listings) to ${SLUG}`
);
