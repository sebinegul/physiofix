import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// Admin: update (PATCH) or delete (DELETE) a roster block.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin(request);
    const id = (await params).id;
    const body = await request.json().catch(() => null);

    const existing = await prisma.rosterBlock.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Roster block not found" }, { status: 404 });
    }

    const date = typeof body?.date === "string" ? body.date : undefined;
    const startTime = typeof body?.startTime === "string" ? body.startTime : undefined;
    const endTime = typeof body?.endTime === "string" ? body.endTime : undefined;
    const reason = typeof body?.reason === "string" ? body.reason.trim() || null : body?.reason === null ? null : undefined;

    if (date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
    const toMin = (v: string) => {
      const [h, m] = v.split(":").map(Number);
      return h * 60 + m;
    };
    const newStart = startTime ?? existing.startTime;
    const newEnd = endTime ?? existing.endTime;
    if ((startTime && !/^\d{1,2}:\d{2}$/.test(startTime)) || (endTime && !/^\d{1,2}:\d{2}$/.test(endTime)) || toMin(newEnd) <= toMin(newStart)) {
      return NextResponse.json(
        { error: "startTime and endTime (HH:MM, end after start) are required" },
        { status: 400 }
      );
    }

    const block = await prisma.rosterBlock.update({
      where: { id },
      data: {
        date: date !== undefined ? new Date(`${date}T00:00:00.000Z`) : undefined,
        startTime: startTime ? startTime.padStart(5, "0") : undefined,
        endTime: endTime ? endTime.padStart(5, "0") : undefined,
        reason: reason !== undefined ? reason : undefined,
      },
    });
    return NextResponse.json({ data: block });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Update roster block error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const id = (await params).id;

    const existing = await prisma.rosterBlock.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Roster block not found" }, { status: 404 });
    }

    await prisma.rosterBlock.delete({ where: { id } });
    return NextResponse.json({ data: { id, deleted: true } });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Delete roster block error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
