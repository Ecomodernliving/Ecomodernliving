import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Postgres persistence layer (Neon / Vercel Postgres).
 *
 * When a connection string is present (production on Vercel, or local .env with
 * a DATABASE_URL), data is stored in Postgres. Otherwise callers fall back to
 * the local filesystem so `npm run dev` works without a database.
 *
 * The Neon–Vercel integration provisions several env vars; we accept the common
 * ones so it works regardless of which the dashboard sets.
 */
function resolveConnectionString(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    undefined
  );
}

export function isDbConfigured(): boolean {
  return Boolean(resolveConnectionString());
}

let cachedSql: NeonQueryFunction<false, false> | null = null;

export function getSql(): NeonQueryFunction<false, false> {
  if (cachedSql) return cachedSql;
  const connectionString = resolveConnectionString();
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }
  cachedSql = neon(connectionString);
  return cachedSql;
}

let schemaReady: Promise<void> | null = null;

/**
 * Lazily create tables on first use. Safe to call repeatedly — runs once per
 * serverless instance.
 */
export function ensureSchema(): Promise<void> {
  if (schemaReady) return schemaReady;
  const sql = getSql();
  schemaReady = (async () => {
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
  })().catch((err) => {
    // Reset so a later request can retry schema creation.
    schemaReady = null;
    throw err;
  });
  return schemaReady;
}
