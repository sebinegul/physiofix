import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken, getClientIp, AUTH_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 registrations per 15 minutes per real IP
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`register:${ip}`, 5, 900);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429 }
      );
    }

    const { email, password, name, phone } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Password strength: minimum 8 characters
    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser) {
      // Uniform response: 200 with a generic message instead of 409,
      // so attackers cannot enumerate registered emails via status code.
      return NextResponse.json({
        message: "Registration successful. Please log in with your credentials.",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        password: hashedPassword,
        name,
        role: "patient",
        phone: phone || null,
      },
    });

    // Create associated patient record
    await prisma.patient.create({
      data: {
        userId: user.id,
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      tv: user.tokenVersion,
    });

    const isProd = process.env.NODE_ENV === "production";

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
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
