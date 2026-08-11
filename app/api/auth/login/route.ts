import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken, getClientIp, verifyPasswordForLogin, AUTH_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Rate limit keyed on the real client IP (never a spoofable header):
    // - per-email: 5 attempts / 5 min (blocks brute force on one account)
    // - per-IP: 20 attempts / 5 min (blocks distributed brute force)
    const ip = getClientIp(request);
    const emailCheck = checkRateLimit(`login:email:${cleanEmail}`, 5, 300);
    const ipCheck = checkRateLimit(`login:ip:${ip}`, 20, 300);

    if (!emailCheck.allowed || !ipCheck.allowed) {
      const resetIn = Math.min(emailCheck.resetIn, ipCheck.resetIn);
      return NextResponse.json(
        {
          error: `Too many attempts. Try again in ${Math.ceil(resetIn / 60)} minutes.`,
        },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    // Constant-time-ish compare: unknown emails run a dummy bcrypt compare too
    const isValid = await verifyPasswordForLogin(password, user?.password ?? null);
    if (!user || !isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      tv: user.tokenVersion,
    });

    const isProd = process.env.NODE_ENV === "production";

    // Set the session as an HttpOnly cookie so it survives XSS.
    const response = NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
