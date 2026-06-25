/**
 * Export marketplace catalog to Google Sheets CSV template.
 * Run: node scripts/export-marketplace-csv.mjs
 */
import fs from "fs";

/** @type {Array<[string, string, string, string?, string?, string?]>} */
const rows = [
  // [category, product_name, amazon_url, asin, description, tag]
  ["Smart Thermostats", "Google Nest Learning Thermostat (3rd Gen)", "", "B07RSH4YWB", "Programmable smart thermostat with ENERGY STAR certification.", "Top Pick"],
  ["Smart Thermostats", "ecobee Smart Thermostat Premium", "", "B0BDHB563V", "SmartSensor-ready thermostat with air quality monitoring.", "Premium"],
  ["Smart Power Management", "Sense Home Energy Monitor", "https://www.amazon.com/s?k=Sense+Energy+Monitor"],
  ["Smart Power Management", "Emporia Vue Smart Home Energy Monitor", "https://www.amazon.com/s?k=Emporia+Vue+Energy+Monitor"],
  ["Smart Power Management", "Kasa Smart Plug Mini", "https://www.amazon.com/s?k=Kasa+Smart+Plug+Mini"],
  ["Smart Power Management", "Smart Energy Saving Power Strip", "https://www.amazon.com/s?k=smart+power+strip"],
  ["Smart Power Management", "Smart Electrical Panel Energy Monitor", "https://www.amazon.com/s?k=smart+electrical+panel"],
  ["HVAC & Heat Pumps", "Smart HVAC Air Vent", "https://www.amazon.com/s?k=smart+vent"],
  ["HVAC & Heat Pumps", "MERV 13 High Efficiency Air Filter", "https://www.amazon.com/s?k=MERV+13+air+filter"],
  ["HVAC & Heat Pumps", "Smart Temperature Room Sensor", "https://www.amazon.com/s?k=smart+room+sensor"],
  ["HVAC & Heat Pumps", "HVAC Duct Sealing Kit", "https://www.amazon.com/s?k=duct+sealing+kit"],
  ["HVAC & Heat Pumps", "Air Flow Balancing Register", "https://www.amazon.com/s?k=air+balancing+register"],
  ["Energy Efficient Appliances", "Energy Efficient Induction Cooktop", "https://www.amazon.com/s?k=induction+cooktop"],
  ["Energy Efficient Appliances", "Portable Induction Burner", "https://www.amazon.com/s?k=portable+induction+burner"],
  ["Energy Efficient Appliances", "ENERGY STAR Refrigerator", "https://www.amazon.com/s?k=energy+star+refrigerator"],
  ["Energy Efficient Appliances", "Energy Saving Washing Machine", "https://www.amazon.com/s?k=energy+efficient+washing+machine"],
  ["Energy Efficient Appliances", "Heat Pump Clothes Dryer", "https://www.amazon.com/s?k=heat+pump+dryer"],
  ["Water Conservation", "Rachio Smart Sprinkler Controller", "https://www.amazon.com/s?k=Rachio+Smart+Sprinkler+Controller"],
  ["Water Conservation", "Moen Flo Smart Water Monitor", "https://www.amazon.com/s?k=Moen+Flo+Smart+Water+Monitor"],
  ["Water Conservation", "Rainwater Collection Barrel", "https://www.amazon.com/s?k=rain+barrel"],
  ["Water Conservation", "Smart Water Leak Detector", "https://www.amazon.com/s?k=water+leak+detector"],
  ["Water Conservation", "Smart Water Shutoff Valve", "https://www.amazon.com/s?k=smart+water+shutoff+valve"],
  ["Sustainable Bathroom", "Water Saving Low Flow Shower Head", "https://www.amazon.com/s?k=low+flow+showerhead"],
  ["Sustainable Bathroom", "Water Saving Faucet Aerator", "https://www.amazon.com/s?k=faucet+aerator"],
  ["Sustainable Bathroom", "Dual Flush Toilet Conversion Kit", "https://www.amazon.com/s?k=dual+flush+conversion+kit"],
  ["Sustainable Bathroom", "High Efficiency Water Saving Toilet", "https://www.amazon.com/s?k=water+saving+toilet"],
  ["Healthy Home", "Airthings View Plus Indoor Air Quality Monitor", "https://www.amazon.com/s?k=Airthings+View+Plus"],
  ["Healthy Home", "Temtop Air Quality Monitor", "https://www.amazon.com/s?k=Temtop+Air+Quality+Monitor"],
  ["Healthy Home", "HEPA Air Purifier for Home", "https://www.amazon.com/s?k=HEPA+air+purifier"],
  ["Healthy Home", "Energy Efficient Dehumidifier", "https://www.amazon.com/s?k=dehumidifier"],
  ["Healthy Home", "Whole House Humidifier", "https://www.amazon.com/s?k=humidifier"],
  ["Healthy Home", "VOC Indoor Air Quality Detector", "https://www.amazon.com/s?k=VOC+detector"],
  ["Non-Toxic Home", "Organic Natural Mattress", "https://www.amazon.com/s?k=organic+mattress"],
  ["Non-Toxic Home", "Natural Latex Mattress", "https://www.amazon.com/s?k=natural+latex+mattress"],
  ["Non-Toxic Home", "Organic Cotton Bedding Set", "https://www.amazon.com/s?k=organic+bedding"],
  ["Non-Toxic Home", "Natural Wool Area Rug", "https://www.amazon.com/s?k=wool+rug"],
  ["Non-Toxic Home", "GreenPan Ceramic Nonstick Cookware", "https://www.amazon.com/s?k=GreenPan+Cookware"],
  ["Non-Toxic Home", "Caraway Non-Toxic Cookware Set", "https://www.amazon.com/s?k=Caraway+Cookware"],
  ["Non-Toxic Home", "Stasher Reusable Silicone Storage Bags", "https://www.amazon.com/s?k=Stasher+Bags"],
  ["Sustainable Kitchen", "Lomi Kitchen Composter", "https://www.amazon.com/s?k=Lomi+Composter"],
  ["Sustainable Kitchen", "Countertop Compost Bin", "https://www.amazon.com/s?k=kitchen+compost+bin"],
  ["Sustainable Kitchen", "Food Waste Recycler", "https://www.amazon.com/s?k=food+waste+recycler"],
  ["Sustainable Kitchen", "Vitamix Professional Blender", "https://www.amazon.com/s?k=Vitamix"],
  ["Sustainable Kitchen", "Berkey Water Filtration System", "https://www.amazon.com/s?k=Berkey+Water+Filter"],
  ["Sustainable Kitchen", "Whole Home Water Filtration System", "https://www.amazon.com/s?k=water+filtration+system"],
  ["Solar & Backup Power", "Jackery Explorer 1000 v2 Portable Power Station", "", "B0CXQGSSQZ", "1000W solar generator for backup power and off-grid use.", "Top Pick"],
  ["Solar & Backup Power", "EcoFlow Portable Power Station", "https://www.amazon.com/s?k=EcoFlow+Power+Station"],
  ["Solar & Backup Power", "BLUETTI Solar Generator", "https://www.amazon.com/s?k=BLUETTI+Solar+Generator"],
  ["Solar & Backup Power", "Solar Powered Outdoor Lights", "https://www.amazon.com/s?k=solar+outdoor+lights"],
  ["Solar & Backup Power", "Solar Security Camera", "https://www.amazon.com/s?k=solar+security+camera"],
  ["Smart Home Automation", "Philips Hue Smart Lighting System", "https://www.amazon.com/s?k=Philips+Hue"],
  ["Smart Home Automation", "Lutron Caseta Smart Lighting Control", "https://www.amazon.com/s?k=Lutron+Caseta"],
  ["Smart Home Automation", "Aqara Smart Home Sensors", "https://www.amazon.com/s?k=Aqara+Sensors"],
  ["Smart Home Automation", "SwitchBot Smart Home Automation", "https://www.amazon.com/s?k=SwitchBot"],
  ["Smart Home Automation", "Smart WiFi Door Lock", "https://www.amazon.com/s?k=smart+lock"],
  ["Smart Garden", "AeroGarden Indoor Garden System", "https://www.amazon.com/s?k=AeroGarden"],
  ["Smart Garden", "Gardyn Indoor Hydroponic Garden", "https://www.amazon.com/s?k=Gardyn+Indoor+Garden"],
  ["Smart Garden", "Click and Grow Smart Garden", "https://www.amazon.com/s?k=Click+and+Grow"],
  ["Smart Garden", "Hydroponic Growing System", "https://www.amazon.com/s?k=hydroponic+system"],
  ["Smart Garden", "Indoor Greenhouse Growing Kit", "https://www.amazon.com/s?k=indoor+greenhouse"],
  ["Electric Yard Equipment", "EGO Battery Powered Lawn Mower", "https://www.amazon.com/s?k=EGO+Lawn+Mower"],
  ["Electric Yard Equipment", "Greenworks Electric Lawn Mower", "https://www.amazon.com/s?k=Greenworks+Lawn+Mower"],
  ["Electric Yard Equipment", "Worx Landroid Robotic Lawn Mower", "https://www.amazon.com/s?k=Worx+Landroid"],
  ["Electric Yard Equipment", "Battery Powered Leaf Blower", "https://www.amazon.com/s?k=battery+leaf+blower"],
  ["Electric Yard Equipment", "Battery Powered String Trimmer", "https://www.amazon.com/s?k=battery+string+trimmer"],
  ["Home Wellness", "Infrared Sauna Blanket", "https://www.amazon.com/s?k=infrared+sauna+blanket"],
  ["Home Wellness", "Red Light Therapy Panel", "https://www.amazon.com/s?k=red+light+therapy+panel"],
  ["Home Wellness", "Whole House Water Filter System", "https://www.amazon.com/s?k=whole+house+water+filter"],
  ["Home Wellness", "Circadian Rhythm Lighting System", "https://www.amazon.com/s?k=circadian+lighting"],
  ["Home Wellness", "Medical Grade HEPA Air Purifier", "https://www.amazon.com/s?k=medical+grade+air+purifier"],
  ["Eco-Friendly Office", "Bamboo Standing Desk", "https://www.amazon.com/s?k=bamboo+desk"],
  ["Eco-Friendly Office", "Electric Standing Desk", "https://www.amazon.com/s?k=standing+desk"],
  ["Eco-Friendly Office", "Energy Efficient Computer Monitor", "https://www.amazon.com/s?k=energy+efficient+monitor"],
  ["Eco-Friendly Office", "LED Energy Saving Desk Lamp", "https://www.amazon.com/s?k=LED+desk+lamp+energy+efficient"],
  ["EV Chargers", "ChargePoint Home Flex Level 2 EV Charger", "https://www.amazon.com/s?k=chargepoint+home+flex"],
  ["EV Chargers", "Emporia Level 2 EV Charger", "https://www.amazon.com/s?k=emporia+ev+charger"],
  ["Air Purifiers", "Levoit Core 400S Smart Air Purifier", "https://www.amazon.com/s?k=levoit+core+400s"],
  ["Air Purifiers", "Coway Airmega Air Purifier", "https://www.amazon.com/s?k=coway+airmega"],
  ["Water Saving Fixtures", "High Sierra Water Saving Showerhead", "https://www.amazon.com/s?k=high+sierra+showerhead"],
  ["Water Saving Fixtures", "Niagara Earth Massage Water Saving Showerhead", "https://www.amazon.com/s?k=niagara+earth+massage+showerhead"],
  ["Indoor Gardening Systems", "AeroGarden Harvest Indoor Garden", "https://www.amazon.com/s?k=aerogarden+harvest"],
  ["Indoor Gardening Systems", "iDOO Hydroponic Garden System", "https://www.amazon.com/s?k=idoo+hydroponic+garden"],
  ["Composting Systems", "FCMP Outdoor Compost Tumbler", "https://www.amazon.com/s?k=fcmp+outdoor+compost+tumbler"],
  ["Composting Systems", "Miracle-Gro Dual Chamber Composter", "https://www.amazon.com/s?k=miracle+gro+composter"],
  ["Solar Products", "Renogy Solar Panel Kit", "https://www.amazon.com/s?k=renogy+solar+panel+kit"],
  ["Solar Products", "Jackery Solar Generator", "https://www.amazon.com/s?k=jackery+solar+generator"],
  ["Eco Paints", "ECOS Low VOC Eco-Friendly Paint", "https://www.amazon.com/s?k=ecos+paint"],
  ["Eco Paints", "Rust-Oleum Low VOC Paint", "https://www.amazon.com/s?k=low+voc+paint"],
];

const categoryToSlug = {
  "Smart Thermostats": "smart-thermostats",
  "Smart Power Management": "smart-home",
  "HVAC & Heat Pumps": "heat-pumps",
  "Energy Efficient Appliances": "smart-home",
  "Water Conservation": "water-fixtures",
  "Sustainable Bathroom": "water-fixtures",
  "Healthy Home": "air-purifiers",
  "Non-Toxic Home": "furniture",
  "Sustainable Kitchen": "composting",
  "Solar & Backup Power": "solar",
  "Smart Home Automation": "smart-home",
  "Smart Garden": "indoor-gardening",
  "Electric Yard Equipment": "smart-home",
  "Home Wellness": "air-purifiers",
  "Eco-Friendly Office": "furniture",
  "EV Chargers": "ev-chargers",
  "Air Purifiers": "air-purifiers",
  "Water Saving Fixtures": "water-fixtures",
  "Indoor Gardening Systems": "indoor-gardening",
  "Composting Systems": "composting",
  "Solar Products": "solar",
  "Eco Paints": "eco-paints",
};

function escapeCsv(value = "") {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const headers = [
  "category",
  "slug",
  "product_name",
  "asin",
  "amazon_url",
  "description",
  "tag",
];

const lines = [headers.join(",")];

for (const row of rows) {
  const [category, name, url = "", asin = "", description = "", tag = ""] = row;
  const slug = categoryToSlug[category] ?? "";
  lines.push(
    [
      escapeCsv(category),
      escapeCsv(slug),
      escapeCsv(name),
      escapeCsv(asin),
      escapeCsv(url),
      escapeCsv(description),
      escapeCsv(tag),
    ].join(",")
  );
}

const outPath = "data/marketplace-products.csv";
fs.mkdirSync("data", { recursive: true });
fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`Wrote ${rows.length} products to ${outPath}`);
