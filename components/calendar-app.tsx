"use client";

import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { TodayScreen } from "@/components/today-screen";
import { WeeklyScreen } from "@/components/weekly-screen";
import { InboxScreen } from "@/components/inbox-screen";
import { PreferencesScreen } from "@/components/preferences-screen";
import { MobileToday } from "@/components/mobile-today";
import { ComponentsScreen } from "@/components/components-screen";
import { Toast } from "@/components/ui-primitives";
import { initialCalendarState } from "@/lib/calendar-data";
import type {
  CalendarEvent,
  CalendarState,
  DeadlineItem,
  InboxItem,
  ScheduleSuggestion,
  ScreenId,
} from "@/lib/calendar-data";

interface ToastState {
  message: string;
  action?: string;
  onAction?: () => void;
}

interface CalendarApiResponse {
  state?: CalendarState;
  [key: string]: unknown;
}

export function CalendarApp() {
  const [screen, setScreen] = useState<ScreenId>("today");
  const [events, setEvents] = useState<CalendarEvent[]>(initialCalendarState.events);
  const [suggestions, setSuggestions] = useState<ScheduleSuggestion[]>(initialCalendarState.suggestions);
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>(initialCalendarState.deadlines);
  const [inboxItems, setInboxItems] = useState<InboxItem[]>(initialCalendarState.inboxItems);
  const [syncState, setSyncState] = useState<"loading" | "ready" | "error">("loading");
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, action?: string, onAction?: () => void) => {
    setToast({ message, action, onAction });
    window.setTimeout(() => setToast(null), 3800);
  }, []);

  const applyState = useCallback((state: CalendarState) => {
    setEvents(state.events);
    setSuggestions(state.suggestions);
    setDeadlines(state.deadlines);
    setInboxItems(state.inboxItems);
  }, []);

  const requestJson = useCallback(
    async (url: string, init?: RequestInit) => {
      const response = await fetch(url, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init?.headers ?? {}),
        },
      });
      const payload = (await response.json()) as CalendarApiResponse;

      if (!response.ok) {
        throw new Error(typeof payload.error === "string" ? payload.error : "request failed");
      }

      if (payload.state) {
        applyState(payload.state);
      }

      return payload;
    },
    [applyState],
  );

  useEffect(() => {
    let alive = true;

    requestJson("/api/calendar-state")
      .then(() => {
        if (alive) setSyncState("ready");
      })
      .catch(() => {
        if (!alive) return;
        setSyncState("error");
        showToast("저장된 데이터를 불러오지 못했어요");
      });

    return () => {
      alive = false;
    };
  }, [requestJson, showToast]);

  const handleCapture = useCallback(
    async (text: string) => {
      try {
        const payload = await requestJson("/api/capture", {
          method: "POST",
          body: JSON.stringify({ text }),
        });
        const task = payload.task as { title?: string } | undefined;
        showToast(task?.title ? `${task.title} 제안이 생겼어요` : "새 제안이 생겼어요");
      } catch {
        showToast("입력을 저장하지 못했어요");
        throw new Error("capture failed");
      }
    },
    [requestJson, showToast],
  );

  const handleApprove = useCallback(
    async (id: string) => {
      try {
        const payload = await requestJson(`/api/suggestions/${id}/approve`, {
          method: "POST",
        });
        showToast(payload.event ? "캘린더에 추가됐어요" : "제안을 승인했어요");
      } catch {
        showToast("승인하지 못했어요");
      }
    },
    [requestJson, showToast],
  );

  const handleDefer = useCallback(
    async (id: string, when: "later_today" | "tomorrow" | "this_week" | "pick") => {
      try {
        const payload = await requestJson(`/api/suggestions/${id}/defer`, {
          method: "POST",
          body: JSON.stringify({ when }),
        });
        showToast(`${payload.deferredTo ?? "나중"}로 미뤘어요`);
      } catch {
        showToast("미루지 못했어요");
      }
    },
    [requestJson, showToast],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await requestJson(`/api/suggestions/${id}`, {
          method: "DELETE",
        });
        showToast("제안을 삭제했어요");
      } catch {
        showToast("삭제하지 못했어요");
      }
    },
    [requestJson, showToast],
  );

  const handleDeleteInboxItem = useCallback(
    async (id: string) => {
      try {
        await requestJson(`/api/inbox/${id}`, {
          method: "DELETE",
        });
      } catch {
        showToast("인박스 항목을 삭제하지 못했어요");
      }
    },
    [requestJson, showToast],
  );

  const renderScreen = () => {
    switch (screen) {
      case "today":
        return (
          <TodayScreen
            events={events}
            suggestions={suggestions}
            deadlines={deadlines}
            onCapture={handleCapture}
            onApprove={handleApprove}
            onDefer={handleDefer}
            onDelete={handleDelete}
          />
        );
      case "weekly":
        return <WeeklyScreen />;
      case "inbox":
        return <InboxScreen items={inboxItems} onDelete={handleDeleteInboxItem} />;
      case "preferences":
        return <PreferencesScreen />;
      case "mobile":
        return <MobileToday events={events} suggestions={suggestions} onCapture={handleCapture} />;
      case "components":
        return <ComponentsScreen />;
      default:
        return null;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar active={screen} onNavigate={setScreen} />
      <div className="app-content" aria-busy={syncState === "loading"}>
        {syncState === "error" ? <div className="sync-banner">로컬 저장소 연결을 확인해주세요</div> : null}
        {renderScreen()}
      </div>
      {toast ? (
        <Toast
          message={toast.message}
          action={toast.action}
          onAction={() => {
            toast.onAction?.();
            setToast(null);
          }}
          onClose={() => setToast(null)}
        />
      ) : null}
    </div>
  );
}
