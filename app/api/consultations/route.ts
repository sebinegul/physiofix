import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import {
  getConsultationSummaryTemplate,
  getConsultationAdminTemplate,
} from "@/lib/email-templates";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);

    if (auth.role === "admin") {
      const consultations = await prisma.consultation.findMany({
        include: {
          patient: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  phone: true,
                },
              },
            },
          },
        },
        orderBy: { date: "desc" },
      });
      return NextResponse.json({ data: consultations });
    } else {
      // Patient sees their own consultations
      const patient = await prisma.patient.findUnique({
        where: { userId: auth.userId },
      });

      if (!patient) {
        return NextResponse.json(
          { error: "Patient profile not found" },
          { status: 404 }
        );
      }

      const consultations = await prisma.consultation.findMany({
        where: { patientId: patient.id },
        orderBy: { date: "desc" },
      });

      return NextResponse.json({ data: consultations });
    }
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get consultations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();
    const { patientId, diagnosis, treatment, investigation, impressions, medicalHistory, pshx, notes, followUpDate, treatmentPlan } = body;

    if (!patientId || !diagnosis || !treatment) {
      return NextResponse.json(
        { error: "patientId, diagnosis, and treatment are required" },
        { status: 400 }
      );
    }

    // Verify patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const consultation = await prisma.consultation.create({
      data: {
        patientId,
        diagnosis,
        treatment,
        investigation: investigation || null,
        impressions: impressions || null,
        medicalHistory: medicalHistory || null,
        pshx: pshx || null,
        notes: notes || null,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        treatmentPlan: treatmentPlan || null,
      },
    });

    // Fetch patient + user info separately (Neon HTTP doesn't support include on create)
    const patientWithUser = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    // Send emails asynchronously (fire-and-forget)
    const adminEmail = process.env.ADMIN_EMAIL || "sebi94george@gmail.com";
    const patientName = patientWithUser?.user.name || "Patient";
    const patientEmail = patientWithUser?.user.email || "";

    // Patient consultation summary email
    sendEmail({
      to: [patientEmail],
      ...getConsultationSummaryTemplate({
        patientName,
        diagnosis: consultation.diagnosis,
        treatment: consultation.treatment,
        followUpDate: consultation.followUpDate
          ? consultation.followUpDate.toISOString()
          : undefined,
      }),
      category: "Consultation",
    }).catch((err) => console.error("Failed to send consultation summary email:", err));

    // Admin notification email
    sendEmail({
      to: [adminEmail],
      ...getConsultationAdminTemplate({
        patientName,
        diagnosis: consultation.diagnosis,
        treatment: consultation.treatment,
      }),
      category: "Consultation",
    }).catch((err) => console.error("Failed to send consultation admin email:", err));

    return NextResponse.json(consultation, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Create consultation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
