import { NextRequest, NextResponse } from "next/server";
import { availableSlotsForDate } from "@/lib/availability";

export const dynamic = "force-dynamic";

// Public — the booking modal fetches this per selected date to grey out
// booked and roster-blocked slots.
export async function GET(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get("date") || "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
    const slots = await availableSlotsForDate(date);
    return NextResponse.json({ data: slots });
  } catch (error) {
    console.error("Get available slots error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
