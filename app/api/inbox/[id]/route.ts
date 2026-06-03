import { NextResponse } from "next/server";
import { mutateCalendarState } from "@/lib/calendar-store";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const result = await mutateCalendarState((state) => {
    state.inboxItems = state.inboxItems.filter((item) => item.id !== id);
    return { state };
  });

  return NextResponse.json(result);
}
