import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { StoredUser, UsersDB } from "@/lib/auth/types";
import { ensureSchema, getSql, isDbConfigured } from "@/lib/db";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

// ---------------------------------------------------------------------------
// Filesystem store (local dev fallback when no database is configured)
// ---------------------------------------------------------------------------
async function fsReadDB(): Promise<UsersDB> {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf8");
    return JSON.parse(raw) as UsersDB;
  } catch {
    return { users: [] };
  }
}

async function fsWriteDB(db: UsersDB): Promise<void> {
  await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(db, null, 2), "utf8");
}

// ---------------------------------------------------------------------------
// Postgres store (production)
// ---------------------------------------------------------------------------
type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string | Date;
};

function rowToUser(row: UserRow): StoredUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : new Date(row.created_at).toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export async function findUserByEmail(
  email: string
): Promise<StoredUser | null> {
  const normalized = email.trim().toLowerCase();

  if (isDbConfigured()) {
    await ensureSchema();
    const sql = getSql();
    const rows = (await sql`
      SELECT id, name, email, password_hash, created_at
      FROM users
      WHERE email = ${normalized}
      LIMIT 1
    `) as UserRow[];
    return rows[0] ? rowToUser(rows[0]) : null;
  }

  const db = await fsReadDB();
  return db.users.find((u) => u.email.toLowerCase() === normalized) ?? null;
}

export async function findUserById(id: string): Promise<StoredUser | null> {
  if (isDbConfigured()) {
    await ensureSchema();
    const sql = getSql();
    const rows = (await sql`
      SELECT id, name, email, password_hash, created_at
      FROM users
      WHERE id = ${id}
      LIMIT 1
    `) as UserRow[];
    return rows[0] ? rowToUser(rows[0]) : null;
  }

  const db = await fsReadDB();
  return db.users.find((u) => u.id === id) ?? null;
}

export async function createUser(
  name: string,
  email: string,
  passwordHash: string
): Promise<StoredUser> {
  const normalizedEmail = email.trim().toLowerCase();
  const user: StoredUser = {
    id: randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  if (isDbConfigured()) {
    await ensureSchema();
    const sql = getSql();
    const existing = (await sql`
      SELECT id FROM users WHERE email = ${normalizedEmail} LIMIT 1
    `) as { id: string }[];
    if (existing.length > 0) {
      throw new Error("EMAIL_EXISTS");
    }
    await sql`
      INSERT INTO users (id, name, email, password_hash, created_at)
      VALUES (${user.id}, ${user.name}, ${user.email}, ${user.passwordHash}, ${user.createdAt})
    `;
    return user;
  }

  const db = await fsReadDB();
  if (db.users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error("EMAIL_EXISTS");
  }
  db.users.push(user);
  await fsWriteDB(db);
  return user;
}
