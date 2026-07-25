import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Site content is publicly readable (no auth required for GET)
    const contents = await prisma.siteContent.findMany();

    // Convert to key-value object for easier consumption
    const contentMap: Record<string, string> = {};
    for (const item of contents) {
      contentMap[item.key] = item.value;
    }

    return NextResponse.json({ data: contentMap });
  } catch (error) {
    console.error("Get content error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const { contents } = body;

    if (!contents || typeof contents !== "object") {
      return NextResponse.json(
        { error: "contents object is required" },
        { status: 400 }
      );
    }

    // Upsert each content entry
    const updates = await Promise.all(
      Object.entries(contents).map(([key, value]) =>
        prisma.siteContent.upsert({
          where: { key },
          update: { value: value as string },
          create: { key, value: value as string },
        })
      )
    );

    // Return as key-value map
    const contentMap: Record<string, string> = {};
    for (const item of updates) {
      contentMap[item.key] = item.value;
    }

    return NextResponse.json({ data: contentMap });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Update content error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
