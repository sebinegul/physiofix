import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isPatient = pathname.startsWith("/patient");

  if (!isDashboard && !isPatient) {
    return NextResponse.next();
  }

  // Statically-protected assets should never reach here
  if (pathname.startsWith("/_next/") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  let payload: { role?: string } | null = null;

  if (token && JWT_SECRET) {
    try {
      const { payload: verified } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET),
        { algorithms: ["HS256"] }
      );
      payload = verified as { role?: string };
    } catch {
      payload = null; // invalid, expired, or tampered
    }
  }

  const loginUrl = new URL("/login", request.url);
  if (!payload) {
    return NextResponse.redirect(loginUrl);
  }

  // Role-based gating
  if (isDashboard && payload.role !== "admin") {
    return NextResponse.redirect(new URL("/patient", request.url));
  }
  if (isPatient && payload.role === "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Note: tokenVersion revocation can't be checked at the edge (no DB).
  // Revoked tokens are rejected by the API layer (authenticateRequest).
  matcher: ["/dashboard/:path*", "/patient/:path*"],
};
