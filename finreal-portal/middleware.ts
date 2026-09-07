import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE, type SessionPayload } from "@/lib/auth";

const PUBLIC_PATHS = ["/login", "/signup"];

/**
 * Route guard for the admin dashboard. Anything outside /login, /signup and
 * /api is treated as protected: no valid session -> redirect to /login.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic =
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) || pathname.startsWith("/api");
  if (isPublic) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  let session: SessionPayload | null = null;
  if (token) {
    if (process.env.MOCK_API === "true") {
      // In mock mode, only accept JWT-looking tokens (3 parts), not arbitrary strings
      if (token.split(".").length === 3) {
        const verified = verifySession(token);
        session = verified ?? { sub: "mock", email: "mock@finreal.com", role: "STAFF", status: "ACTIVE" } as SessionPayload;
      } else {
        session = null;
      }
    } else {
      session = verifySession(token);
    }
  }

  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
