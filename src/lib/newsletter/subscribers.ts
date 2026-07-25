import fs from "fs/promises";
import path from "path";
import { ensureSchema, getSql, isDbConfigured } from "@/lib/db";

export type SubscriberStatus = "subscribed" | "unsubscribed";

export type NewsletterSubscriber = {
  email: string;
  status: SubscriberStatus;
  subscribedAt: string;
  unsubscribedAt?: string;
};

type SubscribersDB = {
  subscribers: NewsletterSubscriber[];
};

const SUBSCRIBERS_FILE = path.join(
  process.cwd(),
  "data",
  "newsletter-subscribers.json"
);

async function fsReadDB(): Promise<SubscribersDB> {
  try {
    const raw = await fs.readFile(SUBSCRIBERS_FILE, "utf8");
    return JSON.parse(raw) as SubscribersDB;
  } catch {
    return { subscribers: [] };
  }
}

async function fsWriteDB(db: SubscribersDB): Promise<void> {
  await fs.mkdir(path.dirname(SUBSCRIBERS_FILE), { recursive: true });
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(db, null, 2), "utf8");
}

async function ensureNewsletterSchema(): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      email TEXT PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'subscribed',
      subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      unsubscribed_at TIMESTAMPTZ
    )
  `;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function getSubscriber(
  email: string
): Promise<NewsletterSubscriber | null> {
  const normalized = normalizeEmail(email);

  if (isDbConfigured()) {
    await ensureNewsletterSchema();
    const sql = getSql();
    const rows = (await sql`
      SELECT email, status, subscribed_at, unsubscribed_at
      FROM newsletter_subscribers
      WHERE email = ${normalized}
      LIMIT 1
    `) as Array<{
      email: string;
      status: string;
      subscribed_at: string | Date;
      unsubscribed_at: string | Date | null;
    }>;

    const row = rows[0];
    if (!row) return null;

    return {
      email: row.email,
      status: row.status === "unsubscribed" ? "unsubscribed" : "subscribed",
      subscribedAt:
        row.subscribed_at instanceof Date
          ? row.subscribed_at.toISOString()
          : new Date(row.subscribed_at).toISOString(),
      unsubscribedAt: row.unsubscribed_at
        ? row.unsubscribed_at instanceof Date
          ? row.unsubscribed_at.toISOString()
          : new Date(row.unsubscribed_at).toISOString()
        : undefined,
    };
  }

  const db = await fsReadDB();
  return db.subscribers.find((s) => s.email === normalized) ?? null;
}

/**
 * Persist a new or reactivated subscription.
 * Returns `alreadySubscribed` when the address is already active.
 */
export async function subscribeEmail(
  email: string
): Promise<{ alreadySubscribed: boolean }> {
  const normalized = normalizeEmail(email);
  const existing = await getSubscriber(normalized);

  if (existing?.status === "subscribed") {
    return { alreadySubscribed: true };
  }

  const now = new Date().toISOString();

  if (isDbConfigured()) {
    await ensureNewsletterSchema();
    const sql = getSql();
    await sql`
      INSERT INTO newsletter_subscribers (email, status, subscribed_at, unsubscribed_at)
      VALUES (${normalized}, 'subscribed', now(), NULL)
      ON CONFLICT (email) DO UPDATE SET
        status = 'subscribed',
        subscribed_at = now(),
        unsubscribed_at = NULL
    `;
    return { alreadySubscribed: false };
  }

  const db = await fsReadDB();
  const idx = db.subscribers.findIndex((s) => s.email === normalized);
  const record: NewsletterSubscriber = {
    email: normalized,
    status: "subscribed",
    subscribedAt: now,
  };

  if (idx >= 0) db.subscribers[idx] = record;
  else db.subscribers.push(record);

  await fsWriteDB(db);
  return { alreadySubscribed: false };
}

export async function unsubscribeEmail(email: string): Promise<void> {
  const normalized = normalizeEmail(email);
  const now = new Date().toISOString();

  if (isDbConfigured()) {
    await ensureNewsletterSchema();
    const sql = getSql();
    await sql`
      INSERT INTO newsletter_subscribers (email, status, subscribed_at, unsubscribed_at)
      VALUES (${normalized}, 'unsubscribed', now(), now())
      ON CONFLICT (email) DO UPDATE SET
        status = 'unsubscribed',
        unsubscribed_at = now()
    `;
    return;
  }

  const db = await fsReadDB();
  const idx = db.subscribers.findIndex((s) => s.email === normalized);
  if (idx >= 0) {
    db.subscribers[idx] = {
      ...db.subscribers[idx],
      status: "unsubscribed",
      unsubscribedAt: now,
    };
  } else {
    db.subscribers.push({
      email: normalized,
      status: "unsubscribed",
      subscribedAt: now,
      unsubscribedAt: now,
    });
  }
  await fsWriteDB(db);
}
