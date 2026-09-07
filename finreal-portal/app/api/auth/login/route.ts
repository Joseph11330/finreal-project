import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signSession, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";

/**
 * POST /api/auth/login
 * Verifies credentials and, only for ACTIVE accounts, issues a signed
 * httpOnly session cookie. Deliberately returns the same generic error
 * message for "no such user" and "wrong password" to avoid user enumeration.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { email, password } = parsed.data;

  if (process.env.MOCK_API === "true") {
    const token = signSession({
      sub: "mock-123",
      email,
      role: "STAFF",
      status: "ACTIVE",
    });
    setSessionCookie(token);
    return NextResponse.json({
      message: "Signed in successfully (mock).",
      user: { id: "mock-123", email, role: "STAFF" },
    });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const genericError = { error: "Invalid email or password." };

  if (!user) {
    return NextResponse.json(genericError, { status: 401 });
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    return NextResponse.json(genericError, { status: 401 });
  }

  if (user.status === "PENDING_REVIEW") {
    return NextResponse.json(
      { error: "Your account is awaiting administrator approval." },
      { status: 403 }
    );
  }
  if (user.status === "SUSPENDED" || user.status === "REJECTED") {
    return NextResponse.json(
      { error: "This account is not authorized to sign in. Contact the Helpdesk." },
      { status: 403 }
    );
  }

  const token = signSession({
    sub: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
  });
  setSessionCookie(token);

  return NextResponse.json({
    message: "Signed in successfully.",
    user: { id: user.id, email: user.email, role: user.role },
  });
}
