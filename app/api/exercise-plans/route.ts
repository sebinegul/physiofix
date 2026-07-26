import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";

// GET: Fetch exercise plans
// Admin sees all plans; Patient sees their own plans
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);

    if (auth.role === "admin") {
      const plans = await prisma.exercisePlan.findMany({
        include: {
          consultation: {
            select: { id: true, date: true, diagnosis: true },
          },
          patient: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
          dailyPlans: {
            include: {
              items: {
                include: { exercise: true },
              },
            },
            orderBy: { dayNumber: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ data: plans });
    } else {
      // Patient: find their patient profile
      const patient = await prisma.patient.findUnique({
        where: { userId: auth.userId },
      });
      if (!patient) {
        return NextResponse.json(
          { error: "Patient profile not found" },
          { status: 404 }
        );
      }

      const plans = await prisma.exercisePlan.findMany({
        where: { patientId: patient.id },
        include: {
          consultation: {
            select: { id: true, date: true, diagnosis: true },
          },
          dailyPlans: {
            include: {
              items: {
                include: { exercise: true },
              },
            },
            orderBy: { dayNumber: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ data: plans });
    }
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get exercise plans error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create an exercise plan with daily plans and items
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const { patientId, consultationId, totalDays, title, dailyPlans } = body;

    if (!patientId || !totalDays || !dailyPlans || !Array.isArray(dailyPlans)) {
      return NextResponse.json(
        { error: "patientId, totalDays, and dailyPlans array are required" },
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

    // Create the plan
    const plan = await prisma.exercisePlan.create({
      data: {
        patientId,
        consultationId: consultationId || null,
        totalDays: parseInt(totalDays),
        title: title || null,
      },
    });

    // Create daily plans and items (no transactions on Neon HTTP)
    for (const day of dailyPlans) {
      const dailyPlan = await prisma.dailyPlan.create({
        data: {
          exercisePlanId: plan.id,
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

    // Re-fetch the complete plan with all relations
    const completePlan = await prisma.exercisePlan.findUnique({
      where: { id: plan.id },
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

    return NextResponse.json(completePlan, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Create exercise plan error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete an exercise plan
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    // Delete in order: items -> daily plans -> plan
    const plan = await prisma.exercisePlan.findUnique({
      where: { id },
      include: { dailyPlans: { include: { items: true } } },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    for (const day of plan.dailyPlans) {
      for (const item of day.items) {
        await prisma.exercisePlanItem.delete({ where: { id: item.id } });
      }
      await prisma.dailyPlan.delete({ where: { id: day.id } });
    }
    await prisma.exercisePlan.delete({ where: { id } });

    return NextResponse.json({ message: "Plan deleted" });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Delete exercise plan error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
