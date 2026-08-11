import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request);

    const appointment = await prisma.appointment.findUnique({
      where: { id: (await params).id },
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

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Patients can only view their own appointments
    if (auth.role !== "admin" && appointment.userId !== auth.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(appointment);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get appointment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

const ALLOWED_STATUSES = ["pending", "confirmed", "completed", "cancelled"];
const PATIENT_ALLOWED_STATUSES = ["cancelled"];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request);

    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: (await params).id },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Patients can only update their own appointments
    if (auth.role !== "admin" && existingAppointment.userId !== auth.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { date, time, type, status, notes } = body;

    // Role-gated status: only admins may move an appointment between
    // pending/confirmed/completed. Patients may only cancel their own.
    let newStatus: string | undefined;
    if (status !== undefined) {
      if (!ALLOWED_STATUSES.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      if (auth.role !== "admin" && !PATIENT_ALLOWED_STATUSES.includes(status)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      newStatus = status;
    }

    // Slot-conflict re-check when the slot is being changed
    if ((date !== undefined || time !== undefined) && newStatus !== "cancelled") {
      const newDate = date !== undefined ? date : existingAppointment.date.toISOString().slice(0, 10);
      const newTime = time !== undefined ? time : existingAppointment.time;
      const dayStart = new Date(`${newDate}T00:00:00.000Z`);
      const dayEnd = new Date(`${newDate}T23:59:59.999Z`);
      const conflicting = await prisma.appointment.findFirst({
        where: {
          id: { not: (await params).id },
          time: newTime,
          date: { gte: dayStart, lte: dayEnd },
          status: { not: "cancelled" },
        },
        select: { id: true },
      });
      if (conflicting) {
        return NextResponse.json(
          { error: "That time slot is already booked. Please choose another." },
          { status: 409 }
        );
      }
    }

    // Neon HTTP adapter doesn't support include on update — update first,
    // then fetch the user separately.
    await prisma.appointment.update({
      where: { id: (await params).id },
      data: {
        ...(date !== undefined && { date: new Date(date) }),
        ...(time !== undefined && { time }),
        ...(type !== undefined && { type }),
        ...(newStatus !== undefined && { status: newStatus }),
        ...(notes !== undefined && { notes }),
      },
    });

    const updated = await prisma.appointment.findUnique({
      where: { id: (await params).id },
    });
    const user = await prisma.user.findUnique({
      where: { id: existingAppointment.userId },
      select: { id: true, email: true, name: true, phone: true },
    });

    return NextResponse.json({ ...updated, user });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Update appointment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH: Partial update (e.g. cancel by patient)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request);

    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: (await params).id },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Patients can only update their own appointments
    if (auth.role !== "admin" && existingAppointment.userId !== auth.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { status, notes } = body;

    // Role-gated status: patients may only cancel, admin may set any status
    if (status !== undefined) {
      if (!ALLOWED_STATUSES.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      if (auth.role !== "admin" && !PATIENT_ALLOWED_STATUSES.includes(status)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Neon HTTP adapter doesn't support include on update
    await prisma.appointment.update({
      where: { id: (await params).id },
      data: {
        ...(status !== undefined && { status }),
        ...(notes !== undefined && { notes }),
      },
    });

    const updated = await prisma.appointment.findUnique({
      where: { id: (await params).id },
    });
    const user = await prisma.user.findUnique({
      where: { id: existingAppointment.userId },
      select: { id: true, email: true, name: true, phone: true },
    });

    return NextResponse.json({ ...updated, user });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Patch appointment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request);

    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: (await params).id },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Only admin or the owning user can delete
    if (auth.role !== "admin" && existingAppointment.userId !== auth.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.appointment.delete({ where: { id: (await params).id } });

    return NextResponse.json({ message: "Appointment deleted successfully" });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete appointment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
