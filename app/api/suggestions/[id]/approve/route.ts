import { NextResponse } from "next/server";
import { mutateCalendarState } from "@/lib/calendar-store";
import { createId, PROTOTYPE_TODAY, toMinutes } from "@/lib/scheduler";
import type { CalendarEvent } from "@/lib/calendar-data";

export const dynamic = "force-dynamic";

function getDuration(start?: string, end?: string) {
  if (!start || !end) return 30;
  return Math.max(15, toMinutes(end) - toMinutes(start));
}

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  let status = 200;

  const result = await mutateCalendarState((state) => {
    const suggestion = state.suggestions.find((item) => item.id === id);

    if (!suggestion) {
      status = 404;
      return { error: "suggestion not found", state };
    }

    let event: CalendarEvent | null = null;
    const duration = getDuration(suggestion.scheduledStart, suggestion.scheduledEnd);

    if (suggestion.linkedEventId) {
      state.events = state.events.map((item) =>
        item.id === suggestion.linkedEventId ? { ...item, type: "aiApproved" } : item,
      );
      event = state.events.find((item) => item.id === suggestion.linkedEventId) ?? null;
    } else if (!suggestion.scheduledDate || suggestion.scheduledDate === PROTOTYPE_TODAY) {
      event = {
        id: createId("event"),
        title: suggestion.title,
        type: "aiApproved",
        date: suggestion.scheduledDate ?? PROTOTYPE_TODAY,
        start: suggestion.scheduledStart ?? "16:00",
        end: suggestion.scheduledEnd ?? "16:30",
        duration,
      };

      state.events.push(event);
      state.events.sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
    }

    if (suggestion.taskId) {
      state.tasks = state.tasks.map((task) =>
        task.id === suggestion.taskId
          ? {
              ...task,
              status: "scheduled",
              scheduledDate: suggestion.scheduledDate,
              scheduledStart: suggestion.scheduledStart,
              scheduledEnd: suggestion.scheduledEnd,
              lastDecision: "approved",
            }
          : task,
      );
    }

    state.suggestions = state.suggestions.filter((item) => item.id !== id);
    state.feedback.unshift({
      id: createId("feedback"),
      taskId: suggestion.taskId,
      suggestionId: suggestion.id,
      decision: "approved",
      decidedAt: new Date().toISOString(),
      originalTime: suggestion.suggestedTime,
      selectedTime: suggestion.suggestedTime,
    });

    return { state, event };
  });

  return NextResponse.json(result, { status });
}
