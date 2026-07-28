import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !token.trim()) {
      return NextResponse.json(
        { error: "Reset token is required" },
        { status: 400 }
      );
    }

    if (!newPassword || !newPassword.trim()) {
      return NextResponse.json(
        { error: "New password is required" },
        { status: 400 }
      );
    }

    if (newPassword.trim().length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Find the reset token
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token: token.trim() },
      include: { user: true },
    });

    if (!resetRecord) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (new Date() > resetRecord.expiresAt) {
      // Delete expired token
      await prisma.passwordReset.delete({
        where: { id: resetRecord.id },
      });
      return NextResponse.json(
        { error: "Reset token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Hash the new password and update
    const hashedPassword = await hashPassword(newPassword.trim());

    // Update password and delete all reset tokens for this user
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordReset.deleteMany({
        where: { userId: resetRecord.userId },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
