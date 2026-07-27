import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);

    const [patients, appointments, exercises, consultations, contacts, pendingAppointments] =
      await Promise.all([
        prisma.patient.count(),
        prisma.appointment.count(),
        prisma.exercise.count(),
        prisma.consultation.count(),
        prisma.contactSubmission.count(),
        prisma.appointment.count({ where: { status: "pending" } }),
      ]);

    return NextResponse.json({
      data: {
        patients,
        appointments,
        exercises,
        consultations,
        contacts,
        pendingAppointments,
      },
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
