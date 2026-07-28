import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import {
  getWelcomeEmailTemplate,
  getAdminNotificationTemplate,
} from "@/lib/email-templates";
import crypto from "crypto";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "sebi94george@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, notes } = await request.json();

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Full name is required" },
        { status: 400 }
      );
    }
    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }
    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.trim().toLowerCase() },
          ...(phone.trim()
            ? [{ phone: phone.trim() }]
            : []),
        ],
      },
    });
    if (existingUser) {
      if (existingUser.email === email.trim().toLowerCase()) {
        return NextResponse.json(
          {
            error:
              "An account with this email already exists. Please log in instead.",
          },
          { status: 409 }
        );
      }
      if (existingUser.phone === phone.trim()) {
        return NextResponse.json(
          {
            error:
              "An account with this phone number already exists. Please log in instead.",
          },
          { status: 409 }
        );
      }
    }

    // Generate a strong random 10-char password
    const generatedPassword = crypto.randomUUID().replace(/-/g, "").slice(0, 10);

    // Hash the password
    const hashedPassword = await hashPassword(generatedPassword);

    // Create User record
    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        name: name.trim(),
        role: "patient",
        phone: phone.trim(),
      },
    });

    // Create associated Patient record
    const patient = await prisma.patient.create({
      data: {
        userId: user.id,
      },
    });

    // Create Consultation record with notes/pain description
    await prisma.consultation.create({
      data: {
        patientId: patient.id,
        diagnosis: "Initial consultation request",
        treatment: "Pending evaluation",
        notes: notes?.trim() || null,
      },
    });

    // Send welcome email to patient
    const welcomeEmail = getWelcomeEmailTemplate({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: generatedPassword,
    });
    await sendEmail({
      to: [email.trim().toLowerCase()],
      subject: welcomeEmail.subject,
      html: welcomeEmail.html,
    });

    // Send admin notification email
    const adminEmail = getAdminNotificationTemplate({
      patientName: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      notes: notes?.trim(),
    });
    await sendEmail({
      to: [ADMIN_EMAIL],
      subject: adminEmail.subject,
      html: adminEmail.html,
    });

    return NextResponse.json({
      data: {
        success: true,
        user: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          generatedPassword,
        },
      },
    });
  } catch (error) {
    console.error("Book consultation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
