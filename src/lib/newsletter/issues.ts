import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import {
  airtableCreateRecord,
  airtableFindByIssueId,
  airtableGetRecord,
  airtableListRecords,
  airtableUpdateRecord,
  isAirtableConfigured,
  type AirtableFields,
  type AirtableRecord,
} from "@/lib/airtable";
import { ensureSchema, getSql, isDbConfigured } from "@/lib/db";

export type NewsletterSection = {
  title: string;
  body: string;
  linkLabel?: string;
  linkHref?: string;
};

export type NewsletterIssueStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "sent";

export type NewsletterSourceProduct = {
  name: string;
  description: string;
  asin?: string;
  url?: string;
  slug?: string;
  store?: string;
  imageUrl?: string;
};

export type NewsletterSourcePayload = {
  products: NewsletterSourceProduct[];
  smartHomeProducts: NewsletterSourceProduct[];
  faq?: {
    id: string;
    question: string;
    answer: string;
    link?: string;
  };
  tip?: {
    title: string;
    body: string;
    source?: string;
  };
  usedAsins: string[];
  weekKey: string;
};

export type NewsletterIssue = {
  id: string;
  subject: string;
  previewText: string;
  ecoProductPicks: NewsletterSection;
  aiSmartHomeTrends: NewsletterSection;
  energySavingTips: NewsletterSection;
  passiveHouseEducation: NewsletterSection;
  status: NewsletterIssueStatus;
  sourcePayload?: NewsletterSourcePayload;
  usedAsins?: string[];
  faqId?: string;
  weekKey?: string;
  airtableRecordId?: string;
  scheduledFor?: string;
  sentAt?: string;
  approvedAt?: string;
  createdAt: string;
};

export type NewsletterIssueInput = {
  subject: string;
  previewText?: string;
  ecoProductPicks: NewsletterSection;
  aiSmartHomeTrends: NewsletterSection;
  energySavingTips: NewsletterSection;
  passiveHouseEducation: NewsletterSection;
  scheduledFor?: string | null;
  status?: NewsletterIssueStatus;
  sourcePayload?: NewsletterSourcePayload;
  usedAsins?: string[];
  faqId?: string;
  weekKey?: string;
};

type IssuesDB = {
  issues: NewsletterIssue[];
};

const ISSUES_FILE = path.join(
  process.cwd(),
  "data",
  "newsletter-issues.json"
);

const STATUSES: NewsletterIssueStatus[] = [
  "draft",
  "pending_approval",
  "approved",
  "sent",
];

function normalizeStatus(value: unknown): NewsletterIssueStatus {
  if (typeof value === "string" && STATUSES.includes(value as NewsletterIssueStatus)) {
    return value as NewsletterIssueStatus;
  }
  return "draft";
}

function asIso(value: string | Date | null | undefined): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export function parseSection(value: unknown): NewsletterSection {
  if (typeof value === "string") {
    try {
      return parseSection(JSON.parse(value));
    } catch {
      return { title: "", body: value };
    }
  }
  if (!value || typeof value !== "object") {
    return { title: "", body: "" };
  }
  const s = value as Record<string, unknown>;
  return {
    title: typeof s.title === "string" ? s.title : "",
    body: typeof s.body === "string" ? s.body : "",
    linkLabel: typeof s.linkLabel === "string" ? s.linkLabel : undefined,
    linkHref: typeof s.linkHref === "string" ? s.linkHref : undefined,
  };
}

function parseSourcePayload(value: unknown): NewsletterSourcePayload | undefined {
  if (!value) return undefined;
  let raw: unknown = value;
  if (typeof value === "string") {
    try {
      raw = JSON.parse(value);
    } catch {
      return undefined;
    }
  }
  if (!raw || typeof raw !== "object") return undefined;
  const s = raw as Record<string, unknown>;
  return {
    products: Array.isArray(s.products)
      ? (s.products as NewsletterSourceProduct[])
      : [],
    smartHomeProducts: Array.isArray(s.smartHomeProducts)
      ? (s.smartHomeProducts as NewsletterSourceProduct[])
      : [],
    faq:
      s.faq && typeof s.faq === "object"
        ? (s.faq as NewsletterSourcePayload["faq"])
        : undefined,
    tip:
      s.tip && typeof s.tip === "object"
        ? (s.tip as NewsletterSourcePayload["tip"])
        : undefined,
    usedAsins: Array.isArray(s.usedAsins)
      ? s.usedAsins.filter((x): x is string => typeof x === "string")
      : [],
    weekKey: typeof s.weekKey === "string" ? s.weekKey : "",
  };
}

function normalizeSection(section: NewsletterSection): NewsletterSection {
  return {
    title: section.title.trim(),
    body: section.body.trim(),
    linkLabel: section.linkLabel?.trim() || undefined,
    linkHref: section.linkHref?.trim() || undefined,
  };
}

function sectionToJson(section: NewsletterSection): string {
  return JSON.stringify(normalizeSection(section));
}

async function fsReadDB(): Promise<IssuesDB> {
  try {
    const raw = await fs.readFile(ISSUES_FILE, "utf8");
    return JSON.parse(raw) as IssuesDB;
  } catch {
    return { issues: [] };
  }
}

async function fsWriteDB(db: IssuesDB): Promise<void> {
  await fs.mkdir(path.dirname(ISSUES_FILE), { recursive: true });
  await fs.writeFile(ISSUES_FILE, JSON.stringify(db, null, 2), "utf8");
}

async function ensureIssuesSchema(): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_issues (
      id TEXT PRIMARY KEY,
      subject TEXT NOT NULL,
      preview_text TEXT NOT NULL DEFAULT '',
      eco_product_picks JSONB NOT NULL,
      ai_smart_home_trends JSONB NOT NULL,
      energy_saving_tips JSONB NOT NULL,
      passive_house_education JSONB NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      source_payload JSONB,
      used_asins TEXT,
      faq_id TEXT,
      week_key TEXT,
      scheduled_for TIMESTAMPTZ,
      sent_at TIMESTAMPTZ,
      approved_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`ALTER TABLE newsletter_issues ADD COLUMN IF NOT EXISTS source_payload JSONB`;
  await sql`ALTER TABLE newsletter_issues ADD COLUMN IF NOT EXISTS used_asins TEXT`;
  await sql`ALTER TABLE newsletter_issues ADD COLUMN IF NOT EXISTS faq_id TEXT`;
  await sql`ALTER TABLE newsletter_issues ADD COLUMN IF NOT EXISTS week_key TEXT`;
  await sql`ALTER TABLE newsletter_issues ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ`;
}

function rowToIssue(row: {
  id: string;
  subject: string;
  preview_text: string;
  eco_product_picks: unknown;
  ai_smart_home_trends: unknown;
  energy_saving_tips: unknown;
  passive_house_education: unknown;
  status: string;
  source_payload?: unknown;
  used_asins?: string | null;
  faq_id?: string | null;
  week_key?: string | null;
  scheduled_for: string | Date | null;
  sent_at: string | Date | null;
  approved_at?: string | Date | null;
  created_at: string | Date;
}): NewsletterIssue {
  return {
    id: row.id,
    subject: row.subject,
    previewText: row.preview_text ?? "",
    ecoProductPicks: parseSection(row.eco_product_picks),
    aiSmartHomeTrends: parseSection(row.ai_smart_home_trends),
    energySavingTips: parseSection(row.energy_saving_tips),
    passiveHouseEducation: parseSection(row.passive_house_education),
    status: normalizeStatus(row.status),
    sourcePayload: parseSourcePayload(row.source_payload),
    usedAsins: row.used_asins
      ? row.used_asins.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined,
    faqId: row.faq_id ?? undefined,
    weekKey: row.week_key ?? undefined,
    scheduledFor: asIso(row.scheduled_for),
    sentAt: asIso(row.sent_at),
    approvedAt: asIso(row.approved_at),
    createdAt: asIso(row.created_at) ?? new Date().toISOString(),
  };
}

function airtableToIssue(record: AirtableRecord): NewsletterIssue {
  const f = record.fields;
  const usedAsinsRaw = f["Used ASINs"];
  const usedAsins =
    typeof usedAsinsRaw === "string"
      ? usedAsinsRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : Array.isArray(usedAsinsRaw)
        ? usedAsinsRaw.filter((x): x is string => typeof x === "string")
        : undefined;

  return {
    id: String(f["Issue ID"] ?? record.id),
    subject: String(f.Subject ?? ""),
    previewText: String(f["Preview Text"] ?? ""),
    ecoProductPicks: parseSection(f["Eco Product Picks"]),
    aiSmartHomeTrends: parseSection(f["AI Smart Home Trends"]),
    energySavingTips: parseSection(f["Energy Saving Tips"]),
    passiveHouseEducation: parseSection(f["Passive House Education"]),
    status: normalizeStatus(f.Status),
    sourcePayload: parseSourcePayload(f["Source Payload"]),
    usedAsins,
    faqId: typeof f["FAQ ID"] === "string" ? f["FAQ ID"] : undefined,
    weekKey: typeof f["Week Key"] === "string" ? f["Week Key"] : undefined,
    airtableRecordId: record.id,
    scheduledFor: asIso(
      typeof f["Scheduled For"] === "string" ? f["Scheduled For"] : undefined
    ),
    sentAt: asIso(typeof f["Sent At"] === "string" ? f["Sent At"] : undefined),
    approvedAt: asIso(
      typeof f["Approved At"] === "string" ? f["Approved At"] : undefined
    ),
    createdAt:
      asIso(typeof f["Created At"] === "string" ? f["Created At"] : undefined) ??
      asIso(record.createdTime) ??
      new Date().toISOString(),
  };
}

function issueToAirtableFields(issue: NewsletterIssue): AirtableFields {
  const fields: AirtableFields = {
    "Issue ID": issue.id,
    Subject: issue.subject,
    "Preview Text": issue.previewText,
    Status: issue.status,
    "Eco Product Picks": sectionToJson(issue.ecoProductPicks),
    "AI Smart Home Trends": sectionToJson(issue.aiSmartHomeTrends),
    "Energy Saving Tips": sectionToJson(issue.energySavingTips),
    "Passive House Education": sectionToJson(issue.passiveHouseEducation),
    "Source Payload": issue.sourcePayload
      ? JSON.stringify(issue.sourcePayload)
      : "",
    "Used ASINs": (issue.usedAsins ?? []).join(", "),
    "FAQ ID": issue.faqId ?? "",
    "Week Key": issue.weekKey ?? "",
    "Created At": issue.createdAt,
  };
  if (issue.scheduledFor) fields["Scheduled For"] = issue.scheduledFor;
  if (issue.sentAt) fields["Sent At"] = issue.sentAt;
  if (issue.approvedAt) fields["Approved At"] = issue.approvedAt;
  return fields;
}

export function isoWeekKey(date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export async function listNewsletterIssues(): Promise<NewsletterIssue[]> {
  if (isAirtableConfigured()) {
    const records = await airtableListRecords({ maxRecords: 50 });
    return records
      .map(airtableToIssue)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }

  if (isDbConfigured()) {
    await ensureIssuesSchema();
    const sql = getSql();
    const rows = (await sql`
      SELECT *
      FROM newsletter_issues
      ORDER BY created_at DESC
      LIMIT 50
    `) as Array<Parameters<typeof rowToIssue>[0]>;
    return rows.map(rowToIssue);
  }

  const db = await fsReadDB();
  return [...db.issues].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
  );
}

export async function getNewsletterIssue(
  id: string
): Promise<NewsletterIssue | null> {
  if (isAirtableConfigured()) {
    const byField = await airtableFindByIssueId(id);
    if (byField) return airtableToIssue(byField);
    const record = await airtableGetRecord(id);
    return record ? airtableToIssue(record) : null;
  }

  if (isDbConfigured()) {
    await ensureIssuesSchema();
    const sql = getSql();
    const rows = (await sql`
      SELECT * FROM newsletter_issues WHERE id = ${id} LIMIT 1
    `) as Array<Parameters<typeof rowToIssue>[0]>;
    return rows[0] ? rowToIssue(rows[0]) : null;
  }

  const db = await fsReadDB();
  return db.issues.find((i) => i.id === id) ?? null;
}

export async function createNewsletterIssue(
  input: NewsletterIssueInput
): Promise<NewsletterIssue> {
  const now = new Date().toISOString();
  const issue: NewsletterIssue = {
    id: randomUUID(),
    subject: input.subject.trim(),
    previewText: (input.previewText ?? "").trim(),
    ecoProductPicks: normalizeSection(input.ecoProductPicks),
    aiSmartHomeTrends: normalizeSection(input.aiSmartHomeTrends),
    energySavingTips: normalizeSection(input.energySavingTips),
    passiveHouseEducation: normalizeSection(input.passiveHouseEducation),
    status: input.status ?? "draft",
    sourcePayload: input.sourcePayload,
    usedAsins: input.usedAsins ?? input.sourcePayload?.usedAsins,
    faqId: input.faqId ?? input.sourcePayload?.faq?.id,
    weekKey: input.weekKey ?? input.sourcePayload?.weekKey,
    scheduledFor: input.scheduledFor ? asIso(input.scheduledFor) : undefined,
    createdAt: now,
  };

  if (isAirtableConfigured()) {
    const record = await airtableCreateRecord(issueToAirtableFields(issue));
    return { ...airtableToIssue(record), id: issue.id };
  }

  if (isDbConfigured()) {
    await ensureIssuesSchema();
    const sql = getSql();
    await sql`
      INSERT INTO newsletter_issues (
        id, subject, preview_text,
        eco_product_picks, ai_smart_home_trends,
        energy_saving_tips, passive_house_education,
        status, source_payload, used_asins, faq_id, week_key,
        scheduled_for, created_at
      ) VALUES (
        ${issue.id},
        ${issue.subject},
        ${issue.previewText},
        ${JSON.stringify(issue.ecoProductPicks)}::jsonb,
        ${JSON.stringify(issue.aiSmartHomeTrends)}::jsonb,
        ${JSON.stringify(issue.energySavingTips)}::jsonb,
        ${JSON.stringify(issue.passiveHouseEducation)}::jsonb,
        ${issue.status},
        ${issue.sourcePayload ? JSON.stringify(issue.sourcePayload) : null}::jsonb,
        ${(issue.usedAsins ?? []).join(", ") || null},
        ${issue.faqId ?? null},
        ${issue.weekKey ?? null},
        ${issue.scheduledFor ?? null},
        ${issue.createdAt}
      )
    `;
    return issue;
  }

  const db = await fsReadDB();
  db.issues.unshift(issue);
  await fsWriteDB(db);
  return issue;
}

export type NewsletterIssuePatch = Partial<
  Pick<
    NewsletterIssue,
    | "subject"
    | "previewText"
    | "ecoProductPicks"
    | "aiSmartHomeTrends"
    | "energySavingTips"
    | "passiveHouseEducation"
    | "status"
    | "scheduledFor"
    | "sentAt"
    | "approvedAt"
    | "sourcePayload"
    | "usedAsins"
    | "faqId"
    | "weekKey"
  >
>;

export async function updateNewsletterIssue(
  id: string,
  patch: NewsletterIssuePatch
): Promise<NewsletterIssue | null> {
  const existing = await getNewsletterIssue(id);
  if (!existing) return null;

  const next: NewsletterIssue = {
    ...existing,
    ...patch,
    ecoProductPicks: patch.ecoProductPicks
      ? normalizeSection(patch.ecoProductPicks)
      : existing.ecoProductPicks,
    aiSmartHomeTrends: patch.aiSmartHomeTrends
      ? normalizeSection(patch.aiSmartHomeTrends)
      : existing.aiSmartHomeTrends,
    energySavingTips: patch.energySavingTips
      ? normalizeSection(patch.energySavingTips)
      : existing.energySavingTips,
    passiveHouseEducation: patch.passiveHouseEducation
      ? normalizeSection(patch.passiveHouseEducation)
      : existing.passiveHouseEducation,
  };

  if (isAirtableConfigured()) {
    const recordId =
      existing.airtableRecordId ??
      (await airtableFindByIssueId(id))?.id;
    if (!recordId) return null;
    const record = await airtableUpdateRecord(
      recordId,
      issueToAirtableFields(next)
    );
    return airtableToIssue(record);
  }

  if (isDbConfigured()) {
    await ensureIssuesSchema();
    const sql = getSql();
    await sql`
      UPDATE newsletter_issues SET
        subject = ${next.subject},
        preview_text = ${next.previewText},
        eco_product_picks = ${JSON.stringify(next.ecoProductPicks)}::jsonb,
        ai_smart_home_trends = ${JSON.stringify(next.aiSmartHomeTrends)}::jsonb,
        energy_saving_tips = ${JSON.stringify(next.energySavingTips)}::jsonb,
        passive_house_education = ${JSON.stringify(next.passiveHouseEducation)}::jsonb,
        status = ${next.status},
        source_payload = ${next.sourcePayload ? JSON.stringify(next.sourcePayload) : null}::jsonb,
        used_asins = ${(next.usedAsins ?? []).join(", ") || null},
        faq_id = ${next.faqId ?? null},
        week_key = ${next.weekKey ?? null},
        scheduled_for = ${next.scheduledFor ?? null},
        sent_at = ${next.sentAt ?? null},
        approved_at = ${next.approvedAt ?? null}
      WHERE id = ${id}
    `;
    return next;
  }

  const db = await fsReadDB();
  const idx = db.issues.findIndex((i) => i.id === id);
  if (idx < 0) return null;
  db.issues[idx] = next;
  await fsWriteDB(db);
  return next;
}

export async function markNewsletterIssueSent(id: string): Promise<void> {
  await updateNewsletterIssue(id, {
    status: "sent",
    sentAt: new Date().toISOString(),
  });
}

export async function approveNewsletterIssue(
  id: string
): Promise<NewsletterIssue | null> {
  return updateNewsletterIssue(id, {
    status: "approved",
    approvedAt: new Date().toISOString(),
  });
}

/** Collect ASINs / FAQ ids used in recent issues (rotation window). */
export async function getRecentRotation(lookback = 8): Promise<{
  asins: Set<string>;
  faqIds: Set<string>;
}> {
  const issues = await listNewsletterIssues();
  const recent = issues.slice(0, lookback);
  const asins = new Set<string>();
  const faqIds = new Set<string>();

  for (const issue of recent) {
    for (const asin of issue.usedAsins ?? issue.sourcePayload?.usedAsins ?? []) {
      asins.add(asin.toUpperCase());
    }
    const faqId = issue.faqId ?? issue.sourcePayload?.faq?.id;
    if (faqId) faqIds.add(faqId);
  }

  return { asins, faqIds };
}

export async function findIssueByWeekKey(
  weekKey: string
): Promise<NewsletterIssue | null> {
  const issues = await listNewsletterIssues();
  return (
    issues.find(
      (i) =>
        i.weekKey === weekKey &&
        (i.status === "pending_approval" ||
          i.status === "approved" ||
          i.status === "draft")
    ) ?? null
  );
}

/**
 * Next approved issue for the weekly send cron.
 */
export async function getNextIssueToSend(): Promise<NewsletterIssue | null> {
  const now = Date.now();
  const issues = await listNewsletterIssues();
  const ready = issues
    .filter((i) => i.status === "approved")
    .filter((i) => {
      if (!i.scheduledFor) return true;
      const t = Date.parse(i.scheduledFor);
      return !Number.isNaN(t) && t <= now;
    })
    .sort((a, b) => {
      const aKey = Date.parse(a.scheduledFor ?? a.approvedAt ?? a.createdAt);
      const bKey = Date.parse(b.scheduledFor ?? b.approvedAt ?? b.createdAt);
      return aKey - bKey;
    });
  return ready[0] ?? null;
}
