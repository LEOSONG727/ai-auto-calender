import { NextResponse } from "next/server";
import { mutateCalendarState } from "@/lib/calendar-store";
import { createId } from "@/lib/scheduler";

export const dynamic = "force-dynamic";

export async function DELETE(
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

    state.suggestions = state.suggestions.filter((item) => item.id !== id);

    if (suggestion.taskId) {
      state.tasks = state.tasks.map((task) =>
        task.id === suggestion.taskId
          ? { ...task, status: "dismissed", lastDecision: "dismissed" }
          : task,
      );
    }

    state.feedback.unshift({
      id: createId("feedback"),
      taskId: suggestion.taskId,
      suggestionId: suggestion.id,
      decision: "dismissed",
      decidedAt: new Date().toISOString(),
      originalTime: suggestion.suggestedTime,
    });

    return { state };
  });

  return NextResponse.json(result, { status });
}
