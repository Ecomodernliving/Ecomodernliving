/**
 * One-time migration: copy local JSON data into Postgres (Neon / Vercel Postgres).
 *
 * Moves:
 *   - data/admin-catalog.json  -> admin_products table
 *   - data/users.json          -> users table (if present)
 *
 * Usage (PowerShell):
 *   $env:DATABASE_URL="postgres://..."; node scripts/migrate-to-postgres.mjs
 *
 * Get the connection string from the Vercel dashboard (Storage → your Postgres
 * store → .env.local tab), or run `vercel env pull` and copy DATABASE_URL.
 *
 * Safe to run multiple times — uses upserts.
 */
import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  console.error(
    "ERROR: Set DATABASE_URL (or POSTGRES_URL) before running this script."
  );
  process.exit(1);
}

const sql = neon(connectionString);

function readJson(relPath) {
  const file = path.join(process.cwd(), relPath);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    console.error(`Could not parse ${relPath}:`, err.message);
    return null;
  }
}

function productKey(p) {
  return `${p.store ?? "Amazon"}::${p.name}`;
}

async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS admin_products (
      slug TEXT NOT NULL,
      product_key TEXT NOT NULL,
      data JSONB NOT NULL,
      position SERIAL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (slug, product_key)
    )
  `;
}

async function migrateAdminProducts() {
  const catalog = readJson("data/admin-catalog.json");
  if (!catalog) {
    console.log("No data/admin-catalog.json — skipping products.");
    return;
  }
  let count = 0;
  for (const [slug, products] of Object.entries(catalog)) {
    for (const product of products ?? []) {
      const key = productKey(product);
      await sql`
        INSERT INTO admin_products (slug, product_key, data, updated_at)
        VALUES (${slug}, ${key}, ${JSON.stringify(product)}::jsonb, now())
        ON CONFLICT (slug, product_key)
        DO UPDATE SET data = EXCLUDED.data, updated_at = now()
      `;
      count++;
    }
  }
  console.log(`Migrated ${count} admin product(s).`);
}

async function migrateUsers() {
  const db = readJson("data/users.json");
  if (!db || !Array.isArray(db.users)) {
    console.log("No data/users.json — skipping users.");
    return;
  }
  let count = 0;
  for (const u of db.users) {
    await sql`
      INSERT INTO users (id, name, email, password_hash, created_at)
      VALUES (${u.id}, ${u.name}, ${u.email.toLowerCase()}, ${u.passwordHash}, ${u.createdAt})
      ON CONFLICT (email) DO NOTHING
    `;
    count++;
  }
  console.log(`Migrated ${count} user(s).`);
}

await ensureSchema();
await migrateAdminProducts();
await migrateUsers();
console.log("Migration complete.");
