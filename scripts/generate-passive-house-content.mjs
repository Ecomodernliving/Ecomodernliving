/**
 * Generates FAQ entries and SEO article stubs from passive-house knowledge base.
 * Usage: node scripts/generate-passive-house-content.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const kb = JSON.parse(
  readFileSync(join(process.cwd(), "data/passive-house-knowledge-base.json"), "utf8")
);
const seoList = JSON.parse(
  readFileSync(join(process.cwd(), "data/passive-house-seo-articles-list.json"), "utf8")
);
kb.seoArticles = seoList;

const faqs = [];
let id = 1;

function add(category, question, answer, links = []) {
  faqs.push({ id: `ph-faq-${id++}`, category, question, answer, relatedLinks: links });
}

// Generate from definitions
for (const d of kb.definitions) {
  add("Definitions", `What is ${d.term}?`, d.definition, d.relatedPages ?? []);
}

// Generate from topics
for (const topic of kb.topics) {
  for (const q of topic.faqs ?? []) {
    add(topic.name, q.question, q.answer, q.links ?? topic.relatedPages ?? []);
  }
  for (const bp of topic.bestPractices ?? []) {
    add(topic.name, `Why is ${bp.title.toLowerCase()} important in Passive House design?`, bp.description, topic.relatedPages ?? []);
  }
}

// Generate from formulas
for (const f of kb.formulas) {
  add(
    "Calculations",
    `How do you calculate ${f.name}?`,
    `${f.description} Formula: ${f.expression}. Units: ${f.units}. ${f.notes ?? ""}`.trim(),
  ["/passive-house-calculators", "/passive-house-principles"]
  );
}

const docsDir = join(process.cwd(), "docs");
if (!existsSync(docsDir)) mkdirSync(docsDir, { recursive: true });

writeFileSync(
  join(process.cwd(), "docs/passive-house-faq.md"),
  `# Passive House FAQ\n\n> ${faqs.length} original FAQs for EcoModernLiving.ai — derived from CPHD training concepts, rewritten for web and AI use.\n\n`,
  "utf8"
);

let md = readFileSync(join(process.cwd(), "docs/passive-house-faq.md"), "utf8");
const byCat = {};
for (const f of faqs) {
  if (!byCat[f.category]) byCat[f.category] = [];
  byCat[f.category].push(f);
}
for (const [cat, items] of Object.entries(byCat)) {
  md += `## ${cat}\n\n`;
  for (const f of items) {
    md += `### ${f.question}\n\n${f.answer}\n\n`;
    if (f.relatedLinks?.length) {
      md += `**Related:** ${f.relatedLinks.map((l) => `[${l}](${l})`).join(" · ")}\n\n`;
    }
  }
}
writeFileSync(join(process.cwd(), "docs/passive-house-faq.md"), md);

// Website FAQ data
const faqDataPath = join(process.cwd(), "src/config/passive-house-faq-data.json");
writeFileSync(faqDataPath, JSON.stringify(faqs, null, 2));
console.log(`Wrote ${faqs.length} FAQs to ${faqDataPath}`);

// SEO articles
const articlesDir = join(process.cwd(), "data/passive-house-seo-articles");
if (!existsSync(articlesDir)) mkdirSync(articlesDir, { recursive: true });

const articles = [];
let slugId = 1;
for (const a of kb.seoArticles) {
  const slug = a.slug || `passive-house-article-${slugId++}`;
  const article = {
    slug,
    title: a.title,
    metaDescription: a.metaDescription,
    targetKeyword: a.keyword,
    category: a.category,
    wordCountTarget: 1500,
    internalLinks: a.internalLinks ?? [],
    affiliateCategories: a.affiliateCategories ?? [],
    faqSchema: (a.faq ?? []).slice(0, 3),
    outline: a.outline ?? [],
  };
  articles.push(article);
  writeFileSync(join(articlesDir, `${slug}.json`), JSON.stringify(article, null, 2));
}

writeFileSync(join(articlesDir, "index.json"), JSON.stringify(articles, null, 2));
console.log(`Generated ${faqs.length} FAQs and ${articles.length} SEO article stubs.`);
