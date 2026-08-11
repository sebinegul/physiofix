import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/auth";
import { getAdminNotificationTemplate } from "@/lib/email-templates";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "sebi94george@gmail.com";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-+()]{7,15}$/;

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 requests per 5 minutes per real IP
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`book-consultation:${ip}`, 5, 300);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { name, phone, email, notes } = await request.json();

    // Validate required fields
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Full name is required" },
        { status: 400 }
      );
    }
    if (!phone || typeof phone !== "string" || !PHONE_REGEX.test(phone.trim())) {
      return NextResponse.json(
        { error: "Please provide a valid phone number" },
        { status: 400 }
      );
    }
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanNotes = typeof notes === "string" ? notes.trim() : "";

    // Link to an existing patient account if one matches the email,
    // otherwise store contact info directly on the consultation.
    // NOTE: No account is ever created here. Previously this endpoint
    // fabricated accounts with a generated password returned in the HTTP
    // response (account takeover + user enumeration via 409).
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: { id: true },
    });

    let linkedPatientId: string | null = null;
    if (existingUser) {
      const patient = await prisma.patient.findUnique({
        where: { userId: existingUser.id },
        select: { id: true },
      });
      linkedPatientId = patient?.id ?? null;
    }

    // Create Consultation record with the request details
    await prisma.consultation.create({
      data: {
        patientId: linkedPatientId,
        patientName: cleanName,
        patientEmail: cleanEmail,
        patientPhone: cleanPhone,
        diagnosis: "Initial consultation request",
        treatment: "Pending evaluation",
        notes: cleanNotes || undefined,
      },
    });

    // Send admin notification email
    const adminEmail = getAdminNotificationTemplate({
      patientName: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      notes: cleanNotes || undefined,
    });
    await sendEmail({
      to: [ADMIN_EMAIL],
      subject: adminEmail.subject,
      html: adminEmail.html,
    });

    return NextResponse.json({
      data: {
        success: true,
        message:
          "Your consultation request has been received. We will contact you shortly to confirm your appointment.",
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
