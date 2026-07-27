import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, authenticateRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    if (all) {
      // Admin: see all testimonials (active + inactive)
      const user = await authenticateRequest(request);
      if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const testimonials = await prisma.testimonial.findMany({
        orderBy: { sortOrder: "asc" },
      });
      return NextResponse.json({ data: testimonials });
    }

    // Public: only active testimonials
    const testimonials = await prisma.testimonial.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ data: testimonials });
  } catch (error) {
    console.error("Get testimonials error:", error);
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
    const { name, location, rating, text, condition, duration, img, active, sortOrder } = body;

    if (!name || !text || !condition) {
      return NextResponse.json(
        { error: "Name, text, and condition are required" },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        location: location || "",
        rating: rating ?? 5,
        text,
        condition,
        duration: duration || "",
        img: img || null,
        active: active ?? true,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json({ data: testimonial }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Create testimonial error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
