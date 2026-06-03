import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { initialCalendarState } from "@/lib/calendar-data";
import type { CalendarState } from "@/lib/calendar-data";

const dataDirectory = path.join(process.cwd(), ".data");
const storePath = path.join(dataDirectory, "calendar-store.json");

let mutationQueue: Promise<unknown> = Promise.resolve();

function cloneState(state: CalendarState): CalendarState {
  return JSON.parse(JSON.stringify(state)) as CalendarState;
}

function ensureStateShape(state: Partial<CalendarState>): CalendarState {
  const seed = cloneState(initialCalendarState);

  return {
    ...seed,
    ...state,
    events: state.events ?? seed.events,
    suggestions: state.suggestions ?? seed.suggestions,
    deadlines: state.deadlines ?? seed.deadlines,
    inboxItems: state.inboxItems ?? seed.inboxItems,
    tasks: state.tasks ?? seed.tasks,
    feedback: state.feedback ?? seed.feedback,
    preferences: {
      ...seed.preferences,
      ...(state.preferences ?? {}),
    },
  };
}

export async function readCalendarState(): Promise<CalendarState> {
  try {
    const content = await readFile(storePath, "utf8");
    return ensureStateShape(JSON.parse(content) as Partial<CalendarState>);
  } catch {
    const seeded = cloneState(initialCalendarState);
    await writeCalendarState(seeded);
    return seeded;
  }
}

export async function writeCalendarState(state: CalendarState) {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(storePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

export async function mutateCalendarState<T>(
  mutator: (state: CalendarState) => T | Promise<T>,
): Promise<T> {
  const run = async () => {
    const current = await readCalendarState();
    const result = await mutator(current);
    await writeCalendarState(current);
    return result;
  };

  const next = mutationQueue.then(run, run);
  mutationQueue = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}
