import { NextResponse } from "next/server";
import { mutateCalendarState } from "@/lib/calendar-store";
import { createId } from "@/lib/scheduler";

export const dynamic = "force-dynamic";

const deferLabels = {
  later_today: "오늘 나중에",
  tomorrow: "내일",
  this_week: "이번 주 안에",
  pick: "선택한 날",
} as const;

type DeferValue = keyof typeof deferLabels;

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { when?: DeferValue } | null;
  const when = body?.when && body.when in deferLabels ? body.when : "tomorrow";
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
          ? { ...task, status: "deferred", lastDecision: "deferred" }
          : task,
      );
    }

    state.feedback.unshift({
      id: createId("feedback"),
      taskId: suggestion.taskId,
      suggestionId: suggestion.id,
      decision: "deferred",
      decidedAt: new Date().toISOString(),
      originalTime: suggestion.suggestedTime,
      note: deferLabels[when],
    });

    return { state, deferredTo: deferLabels[when] };
  });

  return NextResponse.json(result, { status });
}
