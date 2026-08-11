import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);

    const existingContact = await prisma.contactSubmission.findUnique({
      where: { id: (await params).id },
    });

    if (!existingContact) {
      return NextResponse.json(
        { error: "Contact submission not found" },
        { status: 404 }
      );
    }

    await prisma.contactSubmission.delete({ where: { id: (await params).id } });

    return NextResponse.json({ data: { message: "Deleted" } });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Delete contact error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
