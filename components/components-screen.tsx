"use client";

import { Check, Info, Plus, Send, Sparkles } from "lucide-react";
import { DurationChip, EventLegend, LoadingDots, PriorityBadge } from "@/components/ui-primitives";

export function ComponentsScreen() {
  const captureStates = [
    { label: "Idle", status: "Enter로 저장 · AI가 시간을 배치해드려요" },
    { label: "Typing", text: "클라이언트 제안서 다음 주 금요일까지", send: true },
    { label: "Saved", icon: Check, status: "저장됐어요. 일정으로 정리 중이에요." },
    { label: "Parsing", loading: true, status: "가능한 시간을 찾고 있어요..." },
    { label: "Parsed", icon: Sparkles, success: true, status: "제안이 생겼어요" },
    { label: "Needs Clarification", icon: Info, warning: true, status: "언제까지인지 알려주세요" },
    { label: "Failed, saved", icon: Check, status: "저장됐어요. 나중에 다시 정리할게요." },
  ];

  const events = [
    { type: "event-confirmed", label: "확정 일정", title: "제품 기획 미팅", time: "11:00 - 12:00" },
    { type: "event-approved", label: "AI 배치 완료", title: "박팀장 메일 답변", time: "15:30 - 16:00" },
    { type: "event-pending", label: "AI 제안 대기", title: "Q3 전략 문서 초안", time: "16:00 - 17:30" },
    { type: "event-protected", label: "보호 시간", title: "집중 작업 시간", time: "09:00 - 11:00" },
    { type: "event-conflict", label: "일정 충돌", title: "팀 교육 충돌", time: "10:30 - 11:30" },
  ];

  return (
    <main className="components-screen" data-screen-label="Components">
      <header className="screen-header stacked">
        <div>
          <h1>컴포넌트 & 상태</h1>
          <p>Quick Capture 상태 · 타임라인 이벤트 · AI Suggestion Card</p>
        </div>
      </header>

      <section className="component-section">
        <h2>Quick Capture 상태</h2>
        <div className="component-grid">
          {captureStates.map((state) => {
            const Icon = state.icon;
            return (
              <article key={state.label} className="component-sample">
                <h3>{state.label}</h3>
                <div className={`capture-sample ${state.warning ? "is-warning" : ""} ${state.success ? "is-success" : ""}`}>
                  <div>
                    <Plus size={14} />
                    <span className={state.text ? "" : "muted"}>{state.text ?? "지금 떠오르는 일을 적어두세요..."}</span>
                    {state.send ? (
                      <button type="button" aria-label="보내기">
                        <Send size={12} />
                      </button>
                    ) : null}
                  </div>
                  <p>
                    {state.loading ? <LoadingDots /> : null}
                    {Icon ? <Icon size={12} /> : null}
                    {state.status}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="component-section">
        <h2>타임라인 이벤트 타입</h2>
        <div className="component-grid compact">
          {events.map((event) => (
            <article key={event.type} className="component-sample">
              <h3>{event.label}</h3>
              <div className={`sample-event ${event.type}`}>
                <i aria-hidden="true" />
                <div>
                  <strong>{event.title}</strong>
                  <span>{event.time}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <EventLegend />
      </section>

      <section className="component-section narrow">
        <h2>AI Suggestion Card</h2>
        <article className="suggestion-card is-static">
          <div className="suggestion-head static">
            <span className="suggestion-title">Q3 전략 문서 초안 작성</span>
            <span className="suggestion-meta">
              <PriorityBadge level="high" />
              <DurationChip duration="90분" />
              <span>오늘 16:00 - 17:30</span>
            </span>
          </div>
          <div className="suggestion-body">
            <div className="reason-block">
              <span>추천 이유</span>
              <p>금요일 마감이고 90분 집중 시간이 필요해요. 내일 오전은 회의가 많아서 오늘 16:00에 배치했어요.</p>
            </div>
            <div className="personalization-block">
              <Sparkles size={14} />
              <p>문서 작업은 보통 예상보다 오래 걸려 90분으로 잡았어요.</p>
            </div>
            <div className="suggestion-actions">
              <button type="button" className="primary-button">
                승인
              </button>
              <button type="button" className="secondary-button">
                오늘 못함
              </button>
              <button type="button" className="ghost-button">
                삭제
              </button>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
