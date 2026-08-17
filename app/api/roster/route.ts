import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

function parseBody(body: any): { date: string; startTime: string; endTime: string; reason?: string } | null {
  const date = typeof body?.date === "string" ? body.date : "";
  const startTime = typeof body?.startTime === "string" ? body.startTime : "";
  const endTime = typeof body?.endTime === "string" ? body.endTime : "";
  const reason = typeof body?.reason === "string" ? body.reason.trim() || undefined : undefined;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  if (!/^\d{1,2}:\d{2}$/.test(startTime) || !/^\d{1,2}:\d{2}$/.test(endTime)) return null;
  const toMin = (v: string) => {
    const [h, m] = v.split(":").map(Number);
    return h * 60 + m;
  };
  if (toMin(endTime) <= toMin(startTime)) return null;

  return { date, startTime: startTime.padStart(5, "0"), endTime: endTime.padStart(5, "0"), reason };
}

// Admin: list roster blocks (upcoming first).
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const blocks = await prisma.rosterBlock.findMany({
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      include: { createdBy: { select: { name: true } } },
    });
    return NextResponse.json({ data: blocks });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("List roster error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Admin: create a roster block.
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    const body = await request.json().catch(() => null);
    const parsed = parseBody(body);
    if (!parsed) {
      return NextResponse.json(
        { error: "date (YYYY-MM-DD), startTime and endTime (HH:MM, end after start) are required" },
        { status: 400 }
      );
    }

    const block = await prisma.rosterBlock.create({
      data: {
        date: new Date(`${parsed.date}T00:00:00.000Z`),
        startTime: parsed.startTime,
        endTime: parsed.endTime,
        reason: parsed.reason,
        createdById: auth.userId,
      },
    });
    return NextResponse.json({ data: block }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Create roster block error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
