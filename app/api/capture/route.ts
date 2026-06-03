import { NextResponse } from "next/server";
import { mutateCalendarState } from "@/lib/calendar-store";
import { createId, createTaskFromText, planTask } from "@/lib/scheduler";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { text?: string } | null;
  const text = body?.text?.trim();

  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const result = await mutateCalendarState((state) => {
    const task = createTaskFromText(text, state.preferences);
    const suggestion = planTask(task, state.events, state.preferences);

    task.scheduledDate = suggestion.scheduledDate;
    task.scheduledStart = suggestion.scheduledStart;
    task.scheduledEnd = suggestion.scheduledEnd;

    state.tasks.unshift(task);
    state.suggestions.unshift(suggestion);
    state.inboxItems.unshift({
      id: createId("inbox"),
      raw: text,
      state: "parsed",
      time: "방금",
      parsed: {
        title: task.title,
        type: suggestion.type,
        when: suggestion.suggestedTime,
      },
    });

    return { state, task, suggestion };
  });

  return NextResponse.json(result);
}
