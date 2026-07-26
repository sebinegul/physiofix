import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";
import { getResetPasswordTemplate } from "@/lib/email-templates";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5167";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    // Always return success to avoid email enumeration
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (user) {
      // Generate a secure random token
      const token = crypto.randomUUID();

      // Delete any existing reset tokens for this user
      await prisma.passwordReset.deleteMany({
        where: { userId: user.id },
      });

      // Save new reset token with 1-hour expiry
      await prisma.passwordReset.create({
        data: {
          token,
          userId: user.id,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });

      // Send reset email
      const resetLink = `${BASE_URL}/reset-password?token=${token}`;
      const emailTemplate = getResetPasswordTemplate({
        name: user.name,
        resetLink,
      });

      await sendEmail({
        to: [user.email],
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
    }

    // Always return success — don't reveal whether the email exists
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
