import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, authenticateRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    if (all) {
      // Admin: see all gallery items (active + inactive)
      const user = await authenticateRequest(request);
      if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const gallery = await prisma.galleryImage.findMany({
        orderBy: { sortOrder: "asc" },
      });
      return NextResponse.json({ data: gallery });
    }

    // Public: only active gallery items
    const gallery = await prisma.galleryImage.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ data: gallery });
  } catch (error) {
    console.error("Get gallery error:", error);
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
    const { title, description, beforeUrl, afterUrl, category, active, sortOrder } = body;

    if (!title || !beforeUrl || !afterUrl) {
      return NextResponse.json(
        { error: "Title, beforeUrl, and afterUrl are required" },
        { status: 400 }
      );
    }

    const galleryItem = await prisma.galleryImage.create({
      data: {
        title,
        description: description || null,
        beforeUrl,
        afterUrl,
        category: category || "general",
        active: active ?? true,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json({ data: galleryItem }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Create gallery error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
