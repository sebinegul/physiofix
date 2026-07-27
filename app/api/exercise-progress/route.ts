import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET: Fetch exercise progress for the current patient
// Query params: planId (optional) to filter by plan
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);

    const patient = await prisma.patient.findUnique({
      where: { userId: auth.userId },
    });
    if (!patient) {
      return NextResponse.json(
        { error: "Patient profile not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const planId = searchParams.get("planId");

    const where: any = { patientId: patient.id };
    if (planId) {
      where.exercisePlanId = planId;
    }

    const progress = await prisma.exerciseProgress.findMany({
      where,
      select: {
        exercisePlanItemId: true,
        dayNumber: true,
        sortOrder: true,
        completedAt: true,
      },
      orderBy: { completedAt: "desc" },
    });

    return NextResponse.json({ data: progress });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get exercise progress error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Mark an exercise as completed
// Body: { exercisePlanId, dailyPlanId, exercisePlanItemId, dayNumber, sortOrder }
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);

    const patient = await prisma.patient.findUnique({
      where: { userId: auth.userId },
    });
    if (!patient) {
      return NextResponse.json(
        { error: "Patient profile not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { exercisePlanId, dailyPlanId, exercisePlanItemId, dayNumber, sortOrder } =
      body;

    if (!exercisePlanId || !dailyPlanId || !exercisePlanItemId) {
      return NextResponse.json(
        { error: "exercisePlanId, dailyPlanId, and exercisePlanItemId are required" },
        { status: 400 }
      );
    }

    // Upsert: if already completed, just return it; otherwise create
    const progress = await prisma.exerciseProgress.upsert({
      where: {
        patientId_exercisePlanItemId: {
          patientId: patient.id,
          exercisePlanItemId,
        },
      },
      update: {
        completedAt: new Date(),
      },
      create: {
        patientId: patient.id,
        exercisePlanId,
        dailyPlanId,
        exercisePlanItemId,
        dayNumber: dayNumber || 0,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json({ data: progress });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Save exercise progress error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Remove progress for an exercise (undo completion)
export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAuth(request);

    const patient = await prisma.patient.findUnique({
      where: { userId: auth.userId },
    });
    if (!patient) {
      return NextResponse.json(
        { error: "Patient profile not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const exercisePlanItemId = searchParams.get("exercisePlanItemId");

    if (!exercisePlanItemId) {
      return NextResponse.json(
        { error: "exercisePlanItemId is required" },
        { status: 400 }
      );
    }

    await prisma.exerciseProgress.deleteMany({
      where: {
        patientId: patient.id,
        exercisePlanItemId,
      },
    });

    return NextResponse.json({ message: "Progress removed" });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete exercise progress error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
