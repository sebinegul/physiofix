import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);

    const exercise = await prisma.exercise.findUnique({
      where: { id: (await params).id },
    });

    if (!exercise) {
      return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
    }

    return NextResponse.json(exercise);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get exercise error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);

    const existingExercise = await prisma.exercise.findUnique({
      where: { id: (await params).id },
    });

    if (!existingExercise) {
      return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, description, category, difficulty, duration, instructions, imageUrl, gifUrl, videoUrl } = body;

    const exercise = await prisma.exercise.update({
      where: { id: (await params).id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(difficulty !== undefined && { difficulty }),
        ...(duration !== undefined && { duration }),
        ...(instructions !== undefined && { instructions }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(gifUrl !== undefined && { gifUrl }),
        ...(videoUrl !== undefined && { videoUrl }),
      },
    });

    return NextResponse.json(exercise);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Update exercise error:", error);
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
    await requireAdmin(request);

    const existingExercise = await prisma.exercise.findUnique({
      where: { id: (await params).id },
    });

    if (!existingExercise) {
      return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
    }

    await prisma.exercise.delete({ where: { id: (await params).id } });

    return NextResponse.json({ message: "Exercise deleted successfully" });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Delete exercise error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
