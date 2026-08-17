import { NextResponse } from "next/server";
import { nextAvailableSlot, isOpenNow } from "@/lib/availability";

export const dynamic = "force-dynamic";

// Public — powers the hero "Next slot" card. Computed server-side so it always
// reflects real bookings + the doctor's roster.
export async function GET() {
  try {
    const next = await nextAvailableSlot();
    return NextResponse.json({
      data: {
        next,
        openNow: isOpenNow(),
      },
    });
  } catch (error) {
    console.error("Get next slot error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
