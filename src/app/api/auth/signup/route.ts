import { NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/auth/users";
import { hashPassword } from "@/lib/auth/password";
import {
  createSessionToken,
  sessionCookieOptions,
  toSessionUser,
} from "@/lib/auth/session";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "@/lib/auth/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "");
    const email = String(body.email ?? "");
    const password = String(body.password ?? "");

    const nameError = validateName(name);
    if (nameError) {
      return NextResponse.json({ error: nameError }, { status: 400 });
    }

    const emailError = validateEmail(email);
    if (emailError) {
      return NextResponse.json({ error: emailError }, { status: 400 });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    let user;
    try {
      user = await createUser(name, email, passwordHash);
    } catch (err) {
      if (err instanceof Error && err.message === "EMAIL_EXISTS") {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }
      throw err;
    }

    const sessionUser = toSessionUser(user);
    const token = await createSessionToken(sessionUser);

    const response = NextResponse.json({ user: sessionUser });
    response.cookies.set(sessionCookieOptions.name, token, sessionCookieOptions);
    return response;
  } catch {
    return NextResponse.json(
      { error: "Unable to create account. Please try again." },
      { status: 500 }
    );
  }
}
