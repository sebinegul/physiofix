import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "sebi94george@gmail.com";
const DEFAULT_PASSWORD = "welcome123";

function sanitize(input: string): string {
  return input
    .replace(/&/g, "\u0026")
    .replace(/</g, "\u003c")
    .replace(/>/g, "\u003e")
    .replace(/"/g, "\u0022")
    .replace(/'/g, "\u0027");
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-+()]{7,15}$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, message } = body;

    // Validate
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters." }, { status: 400 });
    }
    if (!phone || typeof phone !== "string" || !PHONE_REGEX.test(phone.trim())) {
      return NextResponse.json({ error: "Please provide a valid phone number." }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json({ error: "Please describe your concern in at least 10 characters." }, { status: 400 });
    }

    const cleanName = sanitize(name.trim());
    const cleanPhone = sanitize(phone.trim());
    const cleanEmail = email.trim().toLowerCase();
    const cleanMessage = sanitize(message.trim());

    // Save contact submission
    await prisma.contactSubmission.create({
      data: {
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        message: cleanMessage,
      },
    });

    // Create user + patient if email doesn't exist yet
    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (!existingUser) {
      const hashedPassword = await hashPassword(DEFAULT_PASSWORD);
      const user = await prisma.user.create({
        data: {
          email: cleanEmail,
          password: hashedPassword,
          name: cleanName,
          role: "patient",
          phone: cleanPhone,
        },
      });
      await prisma.patient.create({
        data: {
          userId: user.id,
          medicalHistory: cleanMessage,
        },
      });
    }

    // Send email to admin
    await sendEmail({
      to: [ADMIN_EMAIL],
      subject: `New Contact Enquiry from ${cleanName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">New Contact Enquiry</h2>
          <p>A new enquiry has been submitted through the PhysioFix contact form.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px; font-weight: bold; color: #475569;">Name</td><td style="padding: 8px;">${cleanName}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #475569;">Phone</td><td style="padding: 8px;">${cleanPhone}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #475569;">Email</td><td style="padding: 8px;">${cleanEmail}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #475569;">Message</td><td style="padding: 8px;">${cleanMessage}</td></tr>
          </table>
          ${!existingUser ? '<p style="color: #059669;"><strong>A new patient account has been created</strong> with the email above. Default password: welcome123</p>' : '<p style="color: #64748b;">This email is already registered as a patient.</p>'}
        </div>
      `,
      category: "Contact Form",
    });

    return NextResponse.json({
      message: "Your enquiry has been received. We will get back to you shortly.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
