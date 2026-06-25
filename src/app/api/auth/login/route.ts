import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/auth/users";
import { verifyPassword } from "@/lib/auth/password";
import {
  createSessionToken,
  sessionCookieOptions,
  toSessionUser,
} from "@/lib/auth/session";
import { validateEmail, validatePassword } from "@/lib/auth/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "");
    const password = String(body.password ?? "");

    const emailError = validateEmail(email);
    if (emailError) {
      return NextResponse.json({ error: emailError }, { status: 400 });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const sessionUser = toSessionUser(user);
    const token = await createSessionToken(sessionUser);

    const response = NextResponse.json({ user: sessionUser });
    response.cookies.set(sessionCookieOptions.name, token, sessionCookieOptions);
    return response;
  } catch {
    return NextResponse.json(
      { error: "Unable to sign in. Please try again." },
      { status: 500 }
    );
  }
}
