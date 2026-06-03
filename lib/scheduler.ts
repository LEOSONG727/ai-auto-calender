import type {
  CalendarEvent,
  CalendarTask,
  Priority,
  ScheduleSuggestion,
  SchedulerPreferences,
  TaskEnergy,
} from "@/lib/calendar-data";

export const PROTOTYPE_TODAY = "2026-06-03";

interface TimeSlot {
  date: string;
  start: string;
  end: string;
  score: number;
}

const prototypeNow = "10:45";
const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function toMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

export function fromMinutes(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function addDays(date: string, offset: number) {
  const [year, month, day] = date.split("-").map(Number);
  const value = new Date(Date.UTC(year, month - 1, day));
  value.setUTCDate(value.getUTCDate() + offset);
  return value.toISOString().slice(0, 10);
}

function dayOffset(date: string) {
  const today = new Date(`${PROTOTYPE_TODAY}T00:00:00.000Z`).getTime();
  const target = new Date(`${date}T00:00:00.000Z`).getTime();
  return Math.round((target - today) / 86_400_000);
}

function formatDayLabel(date: string) {
  const offset = dayOffset(date);
  if (offset === 0) return "오늘";
  if (offset === 1) return "내일";
  if (offset === 2) return "모레";

  const [year, month, day] = date.split("-").map(Number);
  const weekday = weekdays[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  return `${month}/${day}(${weekday})`;
}

function clampDuration(minutes: number) {
  return Math.min(Math.max(minutes, 15), 240);
}

function inferDuration(raw: string, preferences: SchedulerPreferences) {
  const hourMatch = raw.match(/(\d+(?:\.\d+)?)\s*(시간|hour|hours|h)/i);
  const minuteMatch = raw.match(/(\d+)\s*(분|minute|minutes|min|m)/i);

  if (hourMatch) return clampDuration(Math.round(Number(hourMatch[1]) * 60));
  if (minuteMatch) return clampDuration(Number(minuteMatch[1]));

  if (/보고서|제안서|전략|문서|기획|초안|자료/.test(raw)) return 90;
  if (/검토|리뷰|정리|분석|작성/.test(raw)) return 60;
  if (/미팅|회의|콜|통화/.test(raw)) return 45;
  if (/메일|답장|연락|예약|확인/.test(raw)) return 30;

  return preferences.defaultTaskDurationMinutes;
}

function inferPriority(raw: string): Priority {
  if (/긴급|급함|중요|마감|오늘|내일|까지|asap/i.test(raw)) return "high";
  if (/이번 주|이번주|다음 주|다음주|검토|회의|미팅/.test(raw)) return "medium";
  return "low";
}

function inferEnergy(raw: string, durationMinutes: number): TaskEnergy {
  if (/집중|전략|기획|문서|보고서|제안서|분석|초안/.test(raw) || durationMinutes >= 75) return "high";
  if (/메일|답장|확인|예약|연락/.test(raw) || durationMinutes <= 30) return "low";
  return "medium";
}

function inferDeadline(raw: string): Pick<CalendarTask, "deadlineLabel" | "deadlineDayOffset"> {
  if (/오늘/.test(raw)) return { deadlineLabel: "오늘", deadlineDayOffset: 0 };
  if (/내일/.test(raw)) return { deadlineLabel: "내일", deadlineDayOffset: 1 };
  if (/모레/.test(raw)) return { deadlineLabel: "모레", deadlineDayOffset: 2 };
  if (/이번 주|이번주/.test(raw)) return { deadlineLabel: "이번 주", deadlineDayOffset: 4 };
  if (/다음 주|다음주/.test(raw)) return { deadlineLabel: "다음 주", deadlineDayOffset: 9 };
  if (/금요일|금욜/.test(raw)) return { deadlineLabel: "금요일", deadlineDayOffset: 2 };
  if (/월요일/.test(raw)) return { deadlineLabel: "월요일", deadlineDayOffset: 5 };
  return {};
}

function inferTitle(raw: string) {
  const cleaned = raw
    .replace(/(\d+(?:\.\d+)?)\s*(시간|분|hour|hours|minute|minutes|min|h|m)/gi, "")
    .replace(/오늘|내일|모레|이번 주|이번주|다음 주|다음주|금요일|월요일/g, "")
    .replace(/까지|해야 함|해야함|해야 됨|해야됨|할 것|하기|중요|긴급|급함/gi, "")
    .replace(/[“”"']/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "새 할 일";
  return cleaned.length > 34 ? `${cleaned.slice(0, 34)}...` : cleaned;
}

function formatDuration(minutes: number) {
  if (minutes >= 60 && minutes % 60 === 0) return `${minutes / 60}시간`;
  if (minutes > 60) return `${Math.floor(minutes / 60)}시간 ${minutes % 60}분`;
  return `${minutes}분`;
}

export function createTaskFromText(raw: string, preferences: SchedulerPreferences): CalendarTask {
  const text = raw.trim();
  const durationMinutes = inferDuration(text, preferences);
  const deadline = inferDeadline(text);

  return {
    id: createId("task"),
    raw: text,
    title: inferTitle(text),
    durationMinutes,
    priority: inferPriority(text),
    energy: inferEnergy(text, durationMinutes),
    status: "suggested",
    createdAt: new Date().toISOString(),
    ...deadline,
  };
}

function mergeIntervals(intervals: Array<{ start: number; end: number }>) {
  const sorted = intervals
    .filter((interval) => interval.end > interval.start)
    .sort((a, b) => a.start - b.start);

  return sorted.reduce<Array<{ start: number; end: number }>>((merged, interval) => {
    const previous = merged[merged.length - 1];
    if (!previous || interval.start > previous.end) {
      merged.push({ ...interval });
      return merged;
    }

    previous.end = Math.max(previous.end, interval.end);
    return merged;
  }, []);
}

function scoreSlot(slotStart: number, task: CalendarTask, preferences: SchedulerPreferences) {
  const focusStart = toMinutes(preferences.focusStart);
  const focusEnd = toMinutes(preferences.focusEnd);
  let score = 1000 - slotStart / 10;

  if (task.priority === "high") score += 80;
  if (task.priority === "low" && slotStart >= toMinutes("16:00")) score += 20;

  if (task.energy === "high") {
    if (slotStart >= focusStart && slotStart + task.durationMinutes <= focusEnd) score += 120;
    if (slotStart >= toMinutes("17:00")) score -= 60;
  }

  if (slotStart >= toMinutes("13:00") && slotStart < toMinutes("15:00")) score += 16;
  return score;
}

function getSlotsForDate(
  date: string,
  events: CalendarEvent[],
  task: CalendarTask,
  preferences: SchedulerPreferences,
) {
  const workStart = toMinutes(preferences.workdayStart);
  const workEnd = toMinutes(preferences.workdayEnd);
  const datePenalty = Math.max(0, dayOffset(date)) * 160;
  const earliest =
    date === PROTOTYPE_TODAY
      ? Math.max(workStart, toMinutes(prototypeNow) + preferences.bufferMinutes)
      : workStart;

  const blocking = events
    .filter((event) => !event.date || event.date === date)
    .map((event) => ({
      start: Math.max(workStart, toMinutes(event.start) - preferences.bufferMinutes),
      end: Math.min(workEnd, toMinutes(event.end) + preferences.bufferMinutes),
    }));

  blocking.push({
    start: Math.max(workStart, toMinutes(preferences.lunchStart) - preferences.bufferMinutes),
    end: Math.min(workEnd, toMinutes(preferences.lunchEnd) + preferences.bufferMinutes),
  });

  const merged = mergeIntervals(blocking);
  const slots: TimeSlot[] = [];
  let cursor = earliest;

  for (const block of merged) {
    if (cursor + task.durationMinutes <= block.start) {
      slots.push({
        date,
        start: fromMinutes(cursor),
        end: fromMinutes(cursor + task.durationMinutes),
        score: scoreSlot(cursor, task, preferences) - datePenalty,
      });
    }

    cursor = Math.max(cursor, block.end);
  }

  if (cursor + task.durationMinutes <= workEnd) {
    slots.push({
      date,
      start: fromMinutes(cursor),
      end: fromMinutes(cursor + task.durationMinutes),
      score: scoreSlot(cursor, task, preferences) - datePenalty,
    });
  }

  return slots;
}

function candidateDayOffsets(task: CalendarTask) {
  const due = task.deadlineDayOffset;
  if (due === 0) return [0, 1, 2, 3, 4, 5, 6, 7];
  if (due === 1) return [0, 1, 2, 3, 4, 5, 6, 7];
  if (typeof due === "number") return [0, 1, 2, Math.max(0, due - 2), Math.max(0, due - 1), due, 7];
  return [0, 1, 2, 3, 4, 5, 6, 7];
}

export function planTask(
  task: CalendarTask,
  events: CalendarEvent[],
  preferences: SchedulerPreferences,
): ScheduleSuggestion {
  const slots = Array.from(new Set(candidateDayOffsets(task)))
    .flatMap((offset) => getSlotsForDate(addDays(PROTOTYPE_TODAY, offset), events, task, preferences))
    .sort((a, b) => b.score - a.score);

  const best = slots[0] ?? {
    date: addDays(PROTOTYPE_TODAY, 1),
    start: preferences.focusStart,
    end: fromMinutes(toMinutes(preferences.focusStart) + task.durationMinutes),
    score: 0,
  };

  const alternatives = slots
    .filter((slot) => slot.date !== best.date || slot.start !== best.start)
    .slice(0, 2)
    .map((slot) => `${formatDayLabel(slot.date)} ${slot.start}`);

  return {
    id: createId("s"),
    taskId: task.id,
    title: task.title,
    type: /미팅|회의|콜|통화/.test(task.raw) ? "meeting" : "task",
    priority: task.priority,
    scheduledDate: best.date,
    scheduledStart: best.start,
    scheduledEnd: best.end,
    confidence: Math.max(0.55, Math.min(0.94, best.score / 1200)),
    suggestedTime: `${formatDayLabel(best.date)} ${best.start} - ${best.end}`,
    duration: formatDuration(task.durationMinutes),
    reason: buildReason(task, best, preferences),
    personalization: buildPersonalization(task),
    alternatives: alternatives.length ? alternatives : ["내일 오전", "이번 주 안에"],
    status: "pending",
  };
}

function buildReason(task: CalendarTask, slot: TimeSlot, preferences: SchedulerPreferences) {
  const day = formatDayLabel(slot.date);
  const base = `${day} ${slot.start}에 ${formatDuration(task.durationMinutes)}짜리 빈 시간이 있어요. 확정 일정과 ${preferences.bufferMinutes}분 버퍼를 피해서 배치했어요.`;

  if (task.deadlineLabel) {
    return `${task.deadlineLabel} 마감 힌트가 있어서 가능한 빠른 슬롯을 우선으로 봤어요. ${base}`;
  }

  if (task.energy === "high") {
    return `집중도가 필요한 일로 판단했어요. ${base}`;
  }

  return base;
}

function buildPersonalization(task: CalendarTask) {
  if (task.energy === "high") return "긴 작업은 앞으로 집중 시간대와 너무 늦지 않은 오후 슬롯을 우선 추천할게요.";
  if (task.energy === "low") return "짧은 처리성 업무는 회의 사이 작은 빈 시간에도 넣을 수 있게 학습해둘게요.";
  return null;
}
