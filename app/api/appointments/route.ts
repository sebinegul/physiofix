import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";

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

    const appointment = await prisma.appointment.create({
      data: {
        userId: targetUserId,
        date: new Date(date),
        time,
        type,
        status: "pending",
        notes: notes || null,
      },
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

    return NextResponse.json(appointment, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create appointment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
