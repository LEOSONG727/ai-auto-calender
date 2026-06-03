"use client";

import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Inbox,
  LayoutList,
  Plus,
  Settings,
  Sparkles,
} from "lucide-react";
import type { CalendarEvent, ScheduleSuggestion } from "@/lib/calendar-data";
import { DurationChip, LoadingDots, PriorityBadge, eventTypeConfig } from "@/components/ui-primitives";

export function MobileToday({
  events,
  suggestions,
}: {
  events: CalendarEvent[];
  suggestions: ScheduleSuggestion[];
}) {
  const [sheet, setSheet] = useState<ScheduleSuggestion | null>(null);
  const [captureState, setCaptureState] = useState<"idle" | "typing" | "saved" | "parsing" | "parsed">("idle");
  const [captureValue, setCaptureValue] = useState("");
  const pending = suggestions.filter((suggestion) => suggestion.status === "pending");
  const visibleEvents = events.filter((event) => !event.pastEvent).slice(0, 5);

  const handleCapture = () => {
    if (!captureValue.trim()) return;
    setCaptureValue("");
    setCaptureState("saved");
    window.setTimeout(() => setCaptureState("parsing"), 500);
    window.setTimeout(() => setCaptureState("parsed"), 1900);
    window.setTimeout(() => setCaptureState("idle"), 3600);
  };

  return (
    <main className="mobile-stage" data-screen-label="Mobile Today">
      <div className="phone-frame">
        <div className="phone-status">
          <span>10:45</span>
          <span>LTE · 84%</span>
        </div>

        <div className="phone-content">
          <header className="mobile-header">
            <span>오늘 · 6월 3일 수요일</span>
            <h1>안녕하세요</h1>
            <p>일정 4개 · AI 제안 {pending.length}개</p>
          </header>

          <section className={`mobile-capture ${captureState !== "idle" ? "is-active" : ""}`} aria-label="모바일 빠른 입력">
            <Plus size={15} aria-hidden="true" />
            <input
              value={captureValue}
              onChange={(event) => {
                setCaptureValue(event.target.value);
                setCaptureState(event.target.value ? "typing" : "idle");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleCapture();
              }}
              placeholder="생각나는 대로 적어두세요..."
              aria-label="모바일 일정 입력"
            />
          </section>

          <div className="mobile-state">
            {captureState === "saved" ? (
              <span>
                <Check size={12} /> 저장됨
              </span>
            ) : null}
            {captureState === "parsing" ? (
              <span>
                <LoadingDots /> 정리 중...
              </span>
            ) : null}
            {captureState === "parsed" ? (
              <span className="state-success">
                <Sparkles size={12} /> 제안이 생겼어요
              </span>
            ) : null}
          </div>

          <section className="mobile-next">
            <div>
              <ArrowRight size={15} />
            </div>
            <div>
              <span>다음 일정</span>
              <strong>제품 기획 미팅</strong>
              <small>11:00 시작 · 15분 후</small>
            </div>
          </section>

          <section className="mobile-list">
            <h2>오늘 일정</h2>
            {visibleEvents.map((event) => {
              const config = eventTypeConfig[event.type];
              return (
                <article key={event.id} className="mobile-event">
                  <i className={config.className} aria-hidden="true" />
                  <div>
                    <strong>{event.title}</strong>
                    <span>
                      {event.start} - {event.end}
                      {event.type === "aiPending" ? " · 승인 대기" : ""}
                    </span>
                  </div>
                  {event.type === "aiPending" ? (
                    <button type="button" onClick={() => setSheet(suggestions[0])}>
                      확인
                    </button>
                  ) : null}
                </article>
              );
            })}
          </section>

          {pending.length ? (
            <section className="mobile-list">
              <h2>
                AI 제안 <b>{pending.length}</b>
              </h2>
              {pending.slice(0, 2).map((suggestion) => (
                <button key={suggestion.id} type="button" className="mobile-suggestion" onClick={() => setSheet(suggestion)}>
                  <i aria-hidden="true" />
                  <span>
                    <strong>{suggestion.title}</strong>
                    <small>
                      {suggestion.suggestedTime} · {suggestion.duration}
                    </small>
                  </span>
                </button>
              ))}
            </section>
          ) : null}
        </div>

        <nav className="phone-nav" aria-label="모바일 하단 내비게이션">
          {[
            { icon: CalendarDays, label: "오늘", active: true },
            { icon: LayoutList, label: "주간" },
            { icon: Inbox, label: "인박스" },
            { icon: Settings, label: "설정" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.label} type="button" className={item.active ? "is-active" : ""}>
                <Icon size={21} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {sheet ? (
          <div className="bottom-sheet-wrap" role="dialog" aria-modal="true" aria-label="AI 제안 상세">
            <button type="button" className="sheet-backdrop" onClick={() => setSheet(null)} aria-label="제안 닫기" />
            <div className="bottom-sheet">
              <span className="sheet-handle" aria-hidden="true" />
              <div className="sheet-badges">
                <PriorityBadge level={sheet.priority} />
                <DurationChip duration={sheet.duration} />
              </div>
              <h2>{sheet.title}</h2>
              <p className="sheet-time">
                <Clock size={14} />
                {sheet.suggestedTime}
              </p>
              <div className="reason-block">
                <span>추천 이유</span>
                <p>{sheet.reason}</p>
              </div>
              {sheet.personalization ? (
                <div className="personalization-block">
                  <Sparkles size={14} />
                  <p>{sheet.personalization}</p>
                </div>
              ) : null}
              <button type="button" className="primary-button sheet-primary" onClick={() => setSheet(null)}>
                승인
              </button>
              <div className="sheet-actions">
                <button type="button" onClick={() => setSheet(null)}>
                  오늘 못함
                </button>
                <button type="button" onClick={() => setSheet(null)}>
                  시간 변경
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
