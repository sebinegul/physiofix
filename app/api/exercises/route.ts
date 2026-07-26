import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Exercises are viewable by all authenticated users
    await requireAuth(request);

    const exercises = await prisma.exercise.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ data: exercises });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get exercises error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const { name, description, category, difficulty, duration, instructions, imageUrl, gifUrl, videoUrl } = body;

    if (!name || !description || !category || !difficulty || !duration || !instructions) {
      return NextResponse.json(
        { error: "Name, description, category, difficulty, duration, and instructions are required" },
        { status: 400 }
      );
    }

    const exercise = await prisma.exercise.create({
      data: {
        name,
        description,
        category,
        difficulty,
        duration,
        instructions,
        imageUrl: imageUrl || null,
        gifUrl: gifUrl || null,
        videoUrl: videoUrl || null,
      },
    });

    return NextResponse.json(exercise, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Create exercise error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
