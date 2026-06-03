"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Plus,
  Send,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import type {
  CalendarEvent,
  DeadlineItem,
  ScheduleSuggestion,
} from "@/lib/calendar-data";
import {
  DeferMenu,
  DurationChip,
  eventStyle,
  eventTypeConfig,
  LoadingDots,
  PriorityBadge,
} from "@/components/ui-primitives";

const timelineStart = 8;
const pxPerMinute = 1;
const hours = Array.from({ length: 12 }, (_, index) => timelineStart + index);

function TimelineEventBlock({ event }: { event: CalendarEvent }) {
  const config = eventTypeConfig[event.type];
  const compact = event.duration < 44;

  return (
    <button
      type="button"
      className={`timeline-event ${config.className} ${compact ? "is-compact" : ""}`}
      style={eventStyle(event.start, event.duration, timelineStart, pxPerMinute)}
      aria-label={`${event.title}, ${event.start}부터 ${event.end}까지, ${config.label}`}
    >
      <span className="event-bar" aria-hidden="true" />
      <span className="event-content">
        <span className="event-title">
          {event.type === "aiPending" ? <Sparkles size={12} aria-hidden="true" /> : null}
          {event.type === "aiApproved" ? <Check size={12} aria-hidden="true" /> : null}
          {event.type === "protected" ? <Shield size={12} aria-hidden="true" /> : null}
          {event.title}
        </span>
        <span className="event-meta">
          {event.start} - {event.end}
          {event.type === "aiPending" ? " · 승인 대기" : ""}
          {event.type === "aiApproved" ? " · AI 배치" : ""}
          {event.type === "protected" ? " · 보호 시간" : ""}
        </span>
      </span>
    </button>
  );
}

function DayTimeline({ events }: { events: CalendarEvent[] }) {
  return (
    <div className="day-timeline" style={{ height: 12 * 60 * pxPerMinute }}>
      {hours.map((hour) => {
        const top = (hour - timelineStart) * 60 * pxPerMinute;
        const label = hour < 12 ? `${hour}AM` : hour === 12 ? "12PM" : `${hour - 12}PM`;
        return (
          <div key={hour}>
            <span className="time-label" style={{ top: top - 8 }}>
              {label}
            </span>
            <span className="hour-line" style={{ top }} />
            <span className="half-hour-line" style={{ top: top + 30 * pxPerMinute }} />
          </div>
        );
      })}
      {events.map((event) => (
        <TimelineEventBlock key={event.id} event={event} />
      ))}
      <div className="current-time" style={{ top: 165 }}>
        <span />
      </div>
    </div>
  );
}

function NextActionCard({ event }: { event?: CalendarEvent }) {
  if (!event) return null;

  return (
    <section className="next-action" aria-label="다음 일정">
      <div className="next-icon" aria-hidden="true">
        <ArrowRight size={16} />
      </div>
      <div className="next-copy">
        <span>다음 일정</span>
        <strong>{event.title}</strong>
        <small>
          {event.start} 시작 · {event.timeUntil}
        </small>
      </div>
      <time>{event.start}</time>
    </section>
  );
}

function QuickCapture({ onCapture }: { onCapture: (text: string) => void }) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<"idle" | "typing" | "saved" | "parsing" | "parsed">("idle");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, []);

  const submit = useCallback(() => {
    const text = value.trim();
    if (!text) return;

    setValue("");
    setState("saved");
    window.setTimeout(() => setState("parsing"), 650);
    window.setTimeout(() => {
      setState("parsed");
      onCapture(text);
    }, 2200);
    window.setTimeout(() => setState("idle"), 4600);
  }, [onCapture, value]);

  const active = state !== "idle" && state !== "typing";

  return (
    <section className={`quick-capture ${active ? "is-active" : ""}`} aria-label="빠른 입력">
      <div className="quick-input-row">
        <Plus size={16} aria-hidden="true" />
        <textarea
          ref={inputRef}
          value={value}
          rows={1}
          onChange={(event) => {
            setValue(event.target.value);
            setState(event.target.value ? "typing" : "idle");
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          placeholder="지금 떠오르는 일을 적어두세요..."
          aria-label="일정이나 할 일 입력"
        />
        {value.trim() ? (
          <button type="button" className="send-button" onClick={submit} aria-label="입력 저장">
            <Send size={14} />
          </button>
        ) : null}
      </div>
      <div className="quick-state">
        {state === "idle" ? <span>Enter로 저장 · AI가 시간을 배치해드려요</span> : null}
        {state === "saved" ? (
          <span>
            <Check size={13} aria-hidden="true" />
            저장됐어요. 일정으로 정리 중이에요.
          </span>
        ) : null}
        {state === "parsing" ? (
          <span>
            <LoadingDots />
            가능한 시간을 찾고 있어요...
          </span>
        ) : null}
        {state === "parsed" ? (
          <span className="state-success">
            <Sparkles size={13} aria-hidden="true" />
            제안이 생겼어요
          </span>
        ) : null}
      </div>
    </section>
  );
}

function SuggestionCard({
  suggestion,
  isExpanded,
  onToggle,
  onApprove,
  onDefer,
  onDelete,
}: {
  suggestion: ScheduleSuggestion;
  isExpanded: boolean;
  onToggle: () => void;
  onApprove: (id: string) => void;
  onDefer: (id: string, when: "later_today" | "tomorrow" | "this_week" | "pick") => void;
  onDelete: (id: string) => void;
}) {
  const [approving, setApproving] = useState(false);
  const [deferOpen, setDeferOpen] = useState(false);

  const handleApprove = () => {
    setApproving(true);
    window.setTimeout(() => onApprove(suggestion.id), 620);
  };

  if (approving) {
    return (
      <article className="suggestion-card is-approved" aria-live="polite">
        <Check size={16} aria-hidden="true" />
        <strong>캘린더에 추가됨</strong>
      </article>
    );
  }

  return (
    <article className="suggestion-card">
      <button type="button" className="suggestion-head" onClick={onToggle}>
        <span className="suggestion-title">{suggestion.title}</span>
        <ChevronDown size={15} className={isExpanded ? "is-open" : ""} aria-hidden="true" />
        <span className="suggestion-meta">
          <PriorityBadge level={suggestion.priority} />
          <DurationChip duration={suggestion.duration} />
          <span>{suggestion.suggestedTime}</span>
        </span>
      </button>

      {isExpanded ? (
        <div className="suggestion-body">
          <div className="reason-block">
            <span>추천 이유</span>
            <p>{suggestion.reason}</p>
          </div>
          {suggestion.personalization ? (
            <div className="personalization-block">
              <Sparkles size={14} aria-hidden="true" />
              <p>{suggestion.personalization}</p>
            </div>
          ) : null}
          <div className="alternatives">
            <span>대안 시간</span>
            <div>
              {suggestion.alternatives.map((time) => (
                <button key={time} type="button">
                  {time}
                </button>
              ))}
            </div>
          </div>
          <div className="suggestion-actions">
            <button type="button" className="primary-button" onClick={handleApprove}>
              승인
            </button>
            <div className="defer-wrap">
              <button type="button" className="secondary-button" onClick={() => setDeferOpen((open) => !open)}>
                오늘 못함
              </button>
              {deferOpen ? (
                <DeferMenu
                  onSelect={(value) => {
                    setDeferOpen(false);
                    onDefer(suggestion.id, value);
                  }}
                />
              ) : null}
            </div>
            <button type="button" className="ghost-button" onClick={() => onDelete(suggestion.id)}>
              삭제
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}

function DeadlineAlert({ items }: { items: DeadlineItem[] }) {
  if (!items.length) return null;

  return (
    <section className="deadline-alert" aria-label="마감 주의">
      <AlertTriangle size={15} aria-hidden="true" />
      <div>
        <strong>마감 주의</strong>
        {items.map((item) => (
          <span key={item.title}>
            {item.title} · {item.deadline}
          </span>
        ))}
      </div>
    </section>
  );
}

function AIPanel({
  suggestions,
  deadlines,
  onApprove,
  onDefer,
  onDelete,
}: {
  suggestions: ScheduleSuggestion[];
  deadlines: DeadlineItem[];
  onApprove: (id: string) => void;
  onDefer: (id: string, when: "later_today" | "tomorrow" | "this_week" | "pick") => void;
  onDelete: (id: string) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(suggestions[0]?.id ?? null);

  useEffect(() => {
    if (suggestions.length && !suggestions.some((suggestion) => suggestion.id === expandedId)) {
      setExpandedId(suggestions[0].id);
    }
  }, [expandedId, suggestions]);

  return (
    <aside className="ai-panel" aria-label="AI 제안">
      <div className="panel-title">
        <Sparkles size={15} aria-hidden="true" />
        <strong>AI 제안</strong>
        {suggestions.length ? <b>{suggestions.length}</b> : null}
      </div>
      <div className="panel-scroll">
        <DeadlineAlert items={deadlines} />
        {suggestions.length ? (
          suggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              isExpanded={expandedId === suggestion.id}
              onToggle={() => setExpandedId(expandedId === suggestion.id ? null : suggestion.id)}
              onApprove={onApprove}
              onDefer={onDefer}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="empty-panel">
            <Check size={28} aria-hidden="true" />
            <strong>오늘 처리할 제안이 없어요</strong>
            <span>할 일을 입력하면 AI가 시간을 배치해드려요</span>
          </div>
        )}
        {suggestions.length ? (
          <section className="learning-card">
            <p>비슷한 문서 작업은 앞으로 90분으로 잡을까요?</p>
            <div>
              {["네", "이번만", "아니요"].map((option) => (
                <button key={option} type="button">
                  {option}
                </button>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </aside>
  );
}

export function TodayScreen({
  events,
  suggestions,
  deadlines,
  onCapture,
  onApprove,
  onDefer,
  onDelete,
}: {
  events: CalendarEvent[];
  suggestions: ScheduleSuggestion[];
  deadlines: DeadlineItem[];
  onCapture: (text: string) => void;
  onApprove: (id: string) => void;
  onDefer: (id: string, when: "later_today" | "tomorrow" | "this_week" | "pick") => void;
  onDelete: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextEvent = events.find((event) => event.upcoming);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 150;
    }
  }, []);

  return (
    <main className="today-screen" data-screen-label="Today">
      <section className="today-main">
        <header className="today-header">
          <div>
            <span>수요일</span>
            <h1>6월 3일</h1>
          </div>
          <div className="today-stats">
            <time>오전 10:45</time>
            <span>일정 4개 · 집중 2시간 확보</span>
          </div>
        </header>
        <QuickCapture onCapture={onCapture} />
        <NextActionCard event={nextEvent} />
        <div ref={scrollRef} className="timeline-scroll">
          <DayTimeline events={events} />
        </div>
      </section>
      <AIPanel
        suggestions={suggestions}
        deadlines={deadlines}
        onApprove={onApprove}
        onDefer={onDefer}
        onDelete={onDelete}
      />
    </main>
  );
}
