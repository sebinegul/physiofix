import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (token) {
      const payload = verifyToken(token);
      if (payload?.tv !== undefined) {
        // Revoke ALL sessions for this user by bumping the token version.
        // Existing JWTs (including the Authorization-header ones) stop working.
        // (raw SQL: updateMany needs interactive transactions, unsupported by Neon HTTP)
        await prisma.$executeRaw`UPDATE "User" SET "tokenVersion" = "tokenVersion" + 1 WHERE "id" = ${payload.userId} AND "tokenVersion" = ${payload.tv}`;
      }
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ success: true });
  }
}
