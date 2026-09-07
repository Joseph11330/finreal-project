import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

const PUBLIC_PATHS = ["/login", "/signup"];
const SESSION_COOKIE = "finreal_session";

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
  // In frontend-only mock mode, accept any non-empty cookie as valid session (Edge runtime cannot use jsonwebtoken)
  const session = token ? (process.env.MOCK_API === "true" ? { sub: "mock", email: "mock@finreal.com", role: "STAFF", status: "ACTIVE" } as any : verifySession(token)) : null;

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
