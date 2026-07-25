/**
 * Airtable REST helpers for newsletter issues.
 *
 * Required env:
 *   AIRTABLE_API_KEY          Personal access token (data.records:read/write)
 *   AIRTABLE_BASE_ID          appXXXXXXXX
 *   AIRTABLE_NEWSLETTER_TABLE Table name (default: "Newsletter Issues")
 *
 * Create a table with these fields (exact names):
 *   Issue ID, Subject, Preview Text, Status,
 *   Eco Product Picks, AI Smart Home Trends, Energy Saving Tips, Passive House Education,
 *   Source Payload, Used ASINs, FAQ ID, Week Key,
 *   Scheduled For, Sent At, Approved At, Created At
 *
 * Status options: draft | pending_approval | approved | sent
 * JSON section fields are Long text. Dates are Date (include time) or ISO strings in text.
 */

const AIRTABLE_API = "https://api.airtable.com/v0";

export function isAirtableConfigured(): boolean {
  return Boolean(
    process.env.AIRTABLE_API_KEY?.trim() &&
      process.env.AIRTABLE_BASE_ID?.trim()
  );
}

function apiKey(): string {
  const key = process.env.AIRTABLE_API_KEY?.trim();
  if (!key) throw new Error("AIRTABLE_API_KEY is not configured");
  return key;
}

/** Accepts `appXXX` or a pasted URL path like `appXXX/tblYYY/viwZZZ`. */
function baseId(): string {
  const raw = process.env.AIRTABLE_BASE_ID?.trim();
  if (!raw) throw new Error("AIRTABLE_BASE_ID is not configured");
  const match = raw.match(/app[a-zA-Z0-9]+/);
  if (!match) {
    throw new Error(
      "AIRTABLE_BASE_ID must look like appXXXXXXXX (only the app… part from the URL)"
    );
  }
  return match[0];
}

/** Table display name or `tblXXX` id from the Airtable URL. */
function tableName(): string {
  const raw =
    process.env.AIRTABLE_NEWSLETTER_TABLE?.trim() || "Newsletter Issues";
  const tblMatch = raw.match(/tbl[a-zA-Z0-9]+/);
  return tblMatch ? tblMatch[0] : raw;
}

function tableUrl(recordId?: string): string {
  const encoded = encodeURIComponent(tableName());
  const base = `${AIRTABLE_API}/${baseId()}/${encoded}`;
  return recordId ? `${base}/${recordId}` : base;
}

export type AirtableFields = Record<string, unknown>;

export type AirtableRecord = {
  id: string;
  createdTime?: string;
  fields: AirtableFields;
};

type ListResponse = {
  records: AirtableRecord[];
  offset?: string;
};

async function airtableFetch<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Airtable ${response.status}: ${detail.slice(0, 300) || response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}

export async function airtableListRecords(options?: {
  filterByFormula?: string;
  maxRecords?: number;
  sortField?: string;
  sortDirection?: "asc" | "desc";
}): Promise<AirtableRecord[]> {
  const params = new URLSearchParams();
  params.set("pageSize", "100");
  if (options?.maxRecords) params.set("maxRecords", String(options.maxRecords));
  if (options?.filterByFormula) {
    params.set("filterByFormula", options.filterByFormula);
  }
  if (options?.sortField) {
    params.set("sort[0][field]", options.sortField);
    params.set(
      "sort[0][direction]",
      options.sortDirection === "asc" ? "asc" : "desc"
    );
  }

  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    if (offset) params.set("offset", offset);
    const data = await airtableFetch<ListResponse>(
      `${tableUrl()}?${params.toString()}`
    );
    records.push(...data.records);
    offset = data.offset;
    params.delete("offset");
  } while (offset);

  return records;
}

export async function airtableGetRecord(
  recordId: string
): Promise<AirtableRecord | null> {
  const response = await fetch(tableUrl(recordId), {
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Airtable ${response.status}: ${detail.slice(0, 300) || response.statusText}`
    );
  }
  return response.json() as Promise<AirtableRecord>;
}

export async function airtableCreateRecord(
  fields: AirtableFields
): Promise<AirtableRecord> {
  const data = await airtableFetch<{ records: AirtableRecord[] }>(tableUrl(), {
    method: "POST",
    body: JSON.stringify({ records: [{ fields }], typecast: true }),
  });
  const record = data.records[0];
  if (!record) throw new Error("Airtable create returned no record");
  return record;
}

export async function airtableUpdateRecord(
  recordId: string,
  fields: AirtableFields
): Promise<AirtableRecord> {
  return airtableFetch<AirtableRecord>(tableUrl(recordId), {
    method: "PATCH",
    body: JSON.stringify({ fields, typecast: true }),
  });
}

export async function airtableFindByIssueId(
  issueId: string
): Promise<AirtableRecord | null> {
  const safe = issueId.replace(/'/g, "\\'");
  const records = await airtableListRecords({
    filterByFormula: `{Issue ID}='${safe}'`,
    maxRecords: 1,
  });
  return records[0] ?? null;
}
