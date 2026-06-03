"use client";

import { useState } from "react";
import { EventLegend, eventTypeConfig, positionFromTime } from "@/components/ui-primitives";
import { weeklyDays } from "@/lib/calendar-data";
import type { CalendarEventType } from "@/lib/calendar-data";

const weekStartHour = 8;
const weekPxPerMinute = 0.62;
const weekHours = Array.from({ length: 12 }, (_, index) => weekStartHour + index);

type Filter = "all" | "ai" | "confirmed";

export function WeeklyScreen() {
  const [filter, setFilter] = useState<Filter>("all");
  const totalHeight = 12 * 60 * weekPxPerMinute;

  const shouldShowEvent = (type: CalendarEventType) => {
    if (filter === "ai") return type === "aiPending" || type === "aiApproved";
    if (filter === "confirmed") return type === "confirmed" || type === "conflict";
    return true;
  };

  return (
    <main className="weekly-screen" data-screen-label="Weekly Plan">
      <header className="screen-header">
        <div>
          <h1>6월 1일 - 6월 5일</h1>
          <p>회의 14시간 · 집중 7시간 · AI 배치 6개</p>
        </div>
        <div className="segmented-control" aria-label="주간 일정 필터">
          {[
            { id: "all", label: "전체" },
            { id: "ai", label: "AI 블록" },
            { id: "confirmed", label: "확정 일정" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              className={filter === item.id ? "is-active" : ""}
              onClick={() => setFilter(item.id as Filter)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <div className="week-day-header">
        <div className="time-spacer" />
        {weeklyDays.map((day) => (
          <div key={day.date} className={day.today ? "is-today" : ""}>
            <span>{day.day}</span>
            <strong>{day.date}</strong>
          </div>
        ))}
      </div>

      <div className="week-grid-scroll">
        <div className="week-time-column">
          {weekHours.map((hour) => (
            <div key={hour} style={{ height: 60 * weekPxPerMinute }}>
              <span>{hour < 12 ? `${hour}AM` : hour === 12 ? "12PM" : `${hour - 12}PM`}</span>
            </div>
          ))}
        </div>
        {weeklyDays.map((day) => (
          <div key={day.date} className={`week-day-column ${day.today ? "is-today" : ""}`} style={{ height: totalHeight }}>
            {weekHours.map((hour) => {
              const top = (hour - weekStartHour) * 60 * weekPxPerMinute;
              return (
                <span key={hour} className="week-grid-line" style={{ top }} aria-hidden="true">
                  <i style={{ top: 30 * weekPxPerMinute }} />
                </span>
              );
            })}
            {day.events.filter((event) => shouldShowEvent(event.type)).map((event) => {
              const config = eventTypeConfig[event.type];
              return (
                <button
                  key={event.id}
                  type="button"
                  className={`week-event ${config.className}`}
                  style={{
                    top: positionFromTime(event.start, weekStartHour, weekPxPerMinute),
                    height: Math.max(event.dur * weekPxPerMinute, 18),
                  }}
                  aria-label={`${event.title}, ${config.label}`}
                >
                  {event.title}
                </button>
              );
            })}
            {day.today ? (
              <span
                className="week-current-time"
                style={{ top: positionFromTime("10:45", weekStartHour, weekPxPerMinute) }}
                aria-hidden="true"
              />
            ) : null}
          </div>
        ))}
      </div>

      <EventLegend />
    </main>
  );
}
