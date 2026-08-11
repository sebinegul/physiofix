import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "sebi94george@gmail.com";

/**
 * Real HTML-entity escaping (the previous implementation used JS escape
 * sequences like "\u003c" which ARE the characters themselves — a no-op).
 */
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-+()]{7,15}$/;

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 submissions per 5 minutes per real IP
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`contact:${ip}`, 5, 300);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

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

    // Escape every field (including email — it previously went out raw)
    const cleanName = escapeHtml(name.trim());
    const cleanPhone = escapeHtml(phone.trim());
    const cleanEmail = escapeHtml(email.trim().toLowerCase());
    const cleanMessage = escapeHtml(message.trim());

    // Save contact submission
    await prisma.contactSubmission.create({
      data: {
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        message: cleanMessage,
      },
    });

    // NOTE: No user/patient account is created from this endpoint anymore.
    // Auto-creating accounts with a default password allowed account
    // pre-registration/takeover of arbitrary victim emails.

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
