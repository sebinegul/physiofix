import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request);

    const consultation = await prisma.consultation.findUnique({
      where: { id: params.id },
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
    });

    if (!consultation) {
      return NextResponse.json(
        { error: "Consultation not found" },
        { status: 404 }
      );
    }

    // Patients can only view their own consultations
    if (auth.role !== "admin") {
      const patient = await prisma.patient.findUnique({
        where: { userId: auth.userId },
      });
      if (!patient || consultation.patientId !== patient.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json(consultation);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get consultation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request);

    const existingConsultation = await prisma.consultation.findUnique({
      where: { id: params.id },
    });

    if (!existingConsultation) {
      return NextResponse.json(
        { error: "Consultation not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { diagnosis, treatment, investigation, impressions, medicalHistory, pshx, notes, followUpDate, treatmentPlan } = body;

    const consultation = await prisma.consultation.update({
      where: { id: params.id },
      data: {
        ...(diagnosis !== undefined && { diagnosis }),
        ...(treatment !== undefined && { treatment }),
        ...(investigation !== undefined && { investigation: investigation || null }),
        ...(impressions !== undefined && { impressions: impressions || null }),
        ...(medicalHistory !== undefined && { medicalHistory: medicalHistory || null }),
        ...(pshx !== undefined && { pshx: pshx || null }),
        ...(notes !== undefined && { notes }),
        ...(followUpDate !== undefined && {
          followUpDate: followUpDate ? new Date(followUpDate) : null,
        }),
        ...(treatmentPlan !== undefined && { treatmentPlan: treatmentPlan || null }),
      },
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
    });

    return NextResponse.json(consultation);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Update consultation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request);

    const existingConsultation = await prisma.consultation.findUnique({
      where: { id: params.id },
    });

    if (!existingConsultation) {
      return NextResponse.json(
        { error: "Consultation not found" },
        { status: 404 }
      );
    }

    await prisma.consultation.delete({ where: { id: params.id } });

    return NextResponse.json({ message: "Consultation deleted successfully" });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Delete consultation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
