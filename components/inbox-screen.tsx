"use client";

import { useState } from "react";
import { Info, Sparkles, X } from "lucide-react";
import { initialInboxItems } from "@/lib/calendar-data";
import type { InboxItem } from "@/lib/calendar-data";
import { LoadingDots } from "@/components/ui-primitives";

export function InboxScreen() {
  const [items, setItems] = useState<InboxItem[]>(initialInboxItems);

  const remove = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <main className="inbox-screen" data-screen-label="Inbox">
      <header className="screen-header stacked">
        <div>
          <h1>인박스</h1>
          <p>{items.length}개 처리 대기 · 머릿속에서 꺼낸 생각을 AI가 정리 중이에요</p>
        </div>
      </header>

      <section className="inbox-list" aria-label="인박스 항목">
        {items.length === 0 ? (
          <div className="empty-panel wide">
            <strong>인박스가 비어있어요</strong>
            <span>새로운 일을 입력하면 여기서 정리해드려요</span>
          </div>
        ) : (
          items.map((item) => (
            <article key={item.id} className="inbox-item">
              <div className="inbox-raw">
                <div>
                  <p>&quot;{item.raw}&quot;</p>
                  <time>{item.time}</time>
                </div>
                <button type="button" className="icon-button" onClick={() => remove(item.id)} aria-label="항목 삭제">
                  <X size={15} />
                </button>
              </div>

              {item.state === "parsing" ? (
                <div className="inbox-state">
                  <LoadingDots />
                  <span>AI가 일정으로 정리 중이에요...</span>
                </div>
              ) : null}

              {item.state === "clarification" ? (
                <div className="clarification">
                  <div>
                    <Info size={14} aria-hidden="true" />
                    <strong>확인이 필요해요</strong>
                    <span>{item.question}</span>
                  </div>
                  <div className="inbox-actions">
                    <button type="button">이번 주 안에</button>
                    <button type="button">다음 주에</button>
                    <button type="button" onClick={() => remove(item.id)}>
                      보류
                    </button>
                  </div>
                </div>
              ) : null}

              {item.state === "parsed" && item.parsed ? (
                <div className="parsed-result">
                  <div className="parsed-status">
                    <Sparkles size={14} aria-hidden="true" />
                    제안 준비됨
                  </div>
                  <div className="parsed-main">
                    <div>
                      <strong>{item.parsed.title}</strong>
                      <span>{item.parsed.when}</span>
                    </div>
                    <b>{item.parsed.type === "recurring" ? "반복" : "할 일"}</b>
                  </div>
                  <div className="inbox-actions">
                    <button type="button" className="primary-button compact">
                      제안 보기
                    </button>
                    <button type="button" onClick={() => remove(item.id)}>
                      보류
                    </button>
                    <button type="button" onClick={() => remove(item.id)} aria-label="삭제">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : null}
            </article>
          ))
        )}
      </section>
    </main>
  );
}
