import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { StoredUser, UsersDB } from "@/lib/auth/types";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

async function readDB(): Promise<UsersDB> {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf8");
    return JSON.parse(raw) as UsersDB;
  } catch {
    return { users: [] };
  }
}

async function writeDB(db: UsersDB): Promise<void> {
  await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(db, null, 2), "utf8");
}

export async function findUserByEmail(
  email: string
): Promise<StoredUser | null> {
  const db = await readDB();
  const normalized = email.trim().toLowerCase();
  return db.users.find((u) => u.email.toLowerCase() === normalized) ?? null;
}

export async function findUserById(id: string): Promise<StoredUser | null> {
  const db = await readDB();
  return db.users.find((u) => u.id === id) ?? null;
}

export async function createUser(
  name: string,
  email: string,
  passwordHash: string
): Promise<StoredUser> {
  const db = await readDB();
  const normalizedEmail = email.trim().toLowerCase();

  if (db.users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error("EMAIL_EXISTS");
  }

  const user: StoredUser = {
    id: randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  await writeDB(db);
  return user;
}
