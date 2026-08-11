import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const galleryItem = await prisma.galleryImage.findUnique({
      where: { id: (await params).id },
    });

    if (!galleryItem) {
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: galleryItem });
  } catch (error) {
    console.error("Get gallery item error:", error);
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

    const existing = await prisma.galleryImage.findUnique({
      where: { id: (await params).id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, description, beforeUrl, afterUrl, category, active, sortOrder } = body;

    const galleryItem = await prisma.galleryImage.update({
      where: { id: (await params).id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(beforeUrl !== undefined && { beforeUrl }),
        ...(afterUrl !== undefined && { afterUrl }),
        ...(category !== undefined && { category }),
        ...(active !== undefined && { active }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json({ data: galleryItem });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Update gallery item error:", error);
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

    const existing = await prisma.galleryImage.findUnique({
      where: { id: (await params).id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 }
      );
    }

    await prisma.galleryImage.delete({ where: { id: (await params).id } });

    return NextResponse.json({ data: { message: "Gallery item deleted" } });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Delete gallery item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
