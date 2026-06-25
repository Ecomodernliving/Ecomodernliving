import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { isAdminEmail } from "@/lib/auth/admin";
import type { SessionUser } from "@/lib/auth/types";

export async function requireAdmin(): Promise<
  SessionUser | NextResponse
> {
  const session = await getSession();
  if (!session || !isAdminEmail(session.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

export function isAdminResponse(
  result: SessionUser | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}
