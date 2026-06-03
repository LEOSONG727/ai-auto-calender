import { NextResponse } from "next/server";
import { readCalendarState } from "@/lib/calendar-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = await readCalendarState();
  return NextResponse.json({ state });
}
