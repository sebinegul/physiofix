import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET: Fetch a single exercise plan with full details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const plan = await prisma.exercisePlan.findUnique({
      where: { id: params.id },
      include: {
        patient: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        dailyPlans: {
          include: {
            items: {
              include: { exercise: true },
              orderBy: { sortOrder: "asc" },
            },
          },
          orderBy: { dayNumber: "asc" },
        },
      },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({ data: plan });
  } catch (error) {
    console.error("Get exercise plan error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: Edit an exercise plan (replace daily plans and items)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const { title, totalDays, dailyPlans } = body;

    if (!totalDays || !dailyPlans || !Array.isArray(dailyPlans)) {
      return NextResponse.json(
        { error: "totalDays and dailyPlans array are required" },
        { status: 400 }
      );
    }

    // Verify plan exists
    const existing = await prisma.exercisePlan.findUnique({
      where: { id: params.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Delete existing daily plans and items (cascade handles items)
    const existingDays = await prisma.dailyPlan.findMany({
      where: { exercisePlanId: params.id },
      select: { id: true },
    });
    for (const day of existingDays) {
      await prisma.exercisePlanItem.deleteMany({
        where: { dailyPlanId: day.id },
      });
      await prisma.dailyPlan.delete({ where: { id: day.id } });
    }

    // Update plan metadata
    await prisma.exercisePlan.update({
      where: { id: params.id },
      data: {
        title: title || existing.title,
        totalDays: parseInt(totalDays),
      },
    });

    // Recreate daily plans and items
    for (const day of dailyPlans) {
      const dailyPlan = await prisma.dailyPlan.create({
        data: {
          exercisePlanId: params.id,
          dayNumber: day.dayNumber,
          label: day.label || `Day ${day.dayNumber}`,
        },
      });

      if (day.items && Array.isArray(day.items)) {
        for (let i = 0; i < day.items.length; i++) {
          const item = day.items[i];
          await prisma.exercisePlanItem.create({
            data: {
              dailyPlanId: dailyPlan.id,
              exerciseId: item.exerciseId,
              sets: item.sets || 3,
              durationSeconds: item.durationSeconds || 30,
              sortOrder: item.sortOrder ?? i,
              notes: item.notes || null,
            },
          });
        }
      }
    }

    // Re-fetch the complete plan
    const updatedPlan = await prisma.exercisePlan.findUnique({
      where: { id: params.id },
      include: {
        dailyPlans: {
          include: {
            items: {
              include: { exercise: true },
            },
          },
          orderBy: { dayNumber: "asc" },
        },
      },
    });

    return NextResponse.json(updatedPlan);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Update exercise plan error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
