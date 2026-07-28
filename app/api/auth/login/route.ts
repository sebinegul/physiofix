import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateToken } from "@/lib/auth";
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

    // Rate limit: 5 attempts per email per 5 minutes
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateKey = `login:${email.toLowerCase().trim()}:${ip}`;
    const rateCheck = checkRateLimit(rateKey, 5, 300);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many attempts. Try again in ${Math.ceil(rateCheck.resetIn / 60)} minutes.`,
        },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
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
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
