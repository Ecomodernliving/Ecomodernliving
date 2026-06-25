/**
 * Extract text snippets from Passive House course PDFs for content audit.
 * Usage: node scripts/extract-course-pdfs.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, basename } from "path";
import { PDFParse } from "pdf-parse";

const COURSE_DIR =
  "C:\\Users\\segar\\Downloads\\PassiveHouseCourse\\PassiveHouseCourse";
const OUT = join(process.cwd(), "data", "course-extracts.json");

function walk(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else if (name.toLowerCase().endsWith(".pdf")) files.push(full);
  }
  return files;
}

const priority = [
  "PHN-Exam-Cheat-Sheet",
  "Module-1-update",
  "Module-2-update",
  "Module-3-update",
  "Module-4-update",
  "Module-5-update",
  "Module-6-update",
  "Module-7-update",
  "Module-8-Cooling",
  "Module-9-Passive-House-Certification",
  "M10_Day-5-1-Economics",
  "M11_Day-5-2-Quality-Assurance",
  "Introduction M1",
  "Insulated Envelope",
  "Airtightness",
  "Thermal Bridging",
  "Windows M5",
  "Ventilation M6",
  "Heating",
  "Cooling M8",
  "Certification M9",
  "Economics M10",
  "QA_QC",
];

const allPdfs = walk(COURSE_DIR);
const sorted = [
  ...priority.flatMap((p) => allPdfs.filter((f) => basename(f).includes(p))),
  ...allPdfs.filter((f) => !priority.some((p) => basename(f).includes(p))),
];

const results = [];

for (const file of sorted.slice(0, 20)) {
  try {
    const buf = readFileSync(file);
    const parser = new PDFParse({ data: buf });
    const info = await parser.getInfo();
    const textResult = await parser.getText({ partial: [1, 2, 3, 4, 5, 6, 7, 8] });
    await parser.destroy();
    const text = textResult.text.replace(/\s+/g, " ").trim().slice(0, 8000);
    results.push({
      file: basename(file),
      pages: info.total,
      excerpt: text,
    });
    console.log(`✓ ${basename(file)} (${info.total} pages)`);
  } catch (e) {
    results.push({ file: basename(file), error: String(e) });
    console.log(`✗ ${basename(file)}: ${e.message}`);
  }
}

writeFileSync(OUT, JSON.stringify(results, null, 2));
console.log(`\nWrote ${results.length} extracts to ${OUT}`);
