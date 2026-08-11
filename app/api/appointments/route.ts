import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import {
  getAppointmentConfirmationTemplate,
  getAppointmentAdminTemplate,
} from "@/lib/email-templates";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);

    if (auth.role === "admin") {
      const appointments = await prisma.appointment.findMany({
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
        orderBy: { date: "desc" },
      });
      return NextResponse.json({ data: appointments });
    } else {
      const appointments = await prisma.appointment.findMany({
        where: { userId: auth.userId },
        orderBy: { date: "desc" },
      });
      return NextResponse.json({ data: appointments });
    }
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get appointments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const body = await request.json();
    const { date, time, type, notes, userId } = body;

    if (!date || !time || !type) {
      return NextResponse.json(
        { error: "Date, time, and type are required" },
        { status: 400 }
      );
    }

    // Admin can create for any user; patients create for themselves
    const targetUserId = auth.role === "admin" && userId ? userId : auth.userId;

    // Verify the target user exists
    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Slot-conflict check: prevent double-booking the same date + time.
    // Cancelled appointments do not block the slot.
    const bookingDate = new Date(`${date}T00:00:00.000Z`);
    const dayEnd = new Date(`${date}T23:59:59.999Z`);
    const conflicting = await prisma.appointment.findFirst({
      where: {
        time,
        date: { gte: bookingDate, lte: dayEnd },
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

    const appointment = await prisma.appointment.create({
      data: {
        userId: targetUserId,
        date: new Date(date),
        time,
        type,
        status: "pending",
        notes: notes || null,
      },
    });

    // Fetch user info separately (Neon HTTP doesn't support include on create)
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, email: true, name: true, phone: true },
    });

    // Send emails asynchronously (fire-and-forget)
    const adminEmail = process.env.ADMIN_EMAIL || "sebi94george@gmail.com";
    const dateStr = appointment.date.toISOString();

    if (user) {
      // Patient confirmation email
      sendEmail({
        to: [user.email],
        ...getAppointmentConfirmationTemplate({
          patientName: user.name,
          date: dateStr,
          time: appointment.time,
          type: appointment.type,
          notes: appointment.notes || undefined,
        }),
        category: "Appointment",
      }).catch((err) => console.error("Failed to send appointment confirmation email:", err));

      // Admin notification email
      sendEmail({
        to: [adminEmail],
        ...getAppointmentAdminTemplate({
          patientName: user.name,
          patientEmail: user.email,
          date: dateStr,
          time: appointment.time,
          type: appointment.type,
        }),
        category: "Appointment",
      }).catch((err) => console.error("Failed to send appointment admin email:", err));
    }

    return NextResponse.json({ ...appointment, user }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create appointment error:", error.message, error.stack);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
