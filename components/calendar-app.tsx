"use client";

import { useCallback, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { TodayScreen } from "@/components/today-screen";
import { WeeklyScreen } from "@/components/weekly-screen";
import { InboxScreen } from "@/components/inbox-screen";
import { PreferencesScreen } from "@/components/preferences-screen";
import { MobileToday } from "@/components/mobile-today";
import { ComponentsScreen } from "@/components/components-screen";
import { Toast } from "@/components/ui-primitives";
import {
  deadlines,
  initialEvents,
  initialSuggestions,
} from "@/lib/calendar-data";
import type {
  CalendarEvent,
  ScheduleSuggestion,
  ScreenId,
} from "@/lib/calendar-data";

interface ToastState {
  message: string;
  action?: string;
  onAction?: () => void;
}

export function CalendarApp() {
  const [screen, setScreen] = useState<ScreenId>("today");
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [suggestions, setSuggestions] = useState<ScheduleSuggestion[]>(initialSuggestions);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, action?: string, onAction?: () => void) => {
    setToast({ message, action, onAction });
    window.setTimeout(() => setToast(null), 3800);
  }, []);

  const handleCapture = useCallback((text: string) => {
    const id = `s-${Date.now()}`;
    const title = text.length > 26 ? `${text.slice(0, 26)}...` : text;

    setSuggestions((current) => [
      {
        id,
        title,
        type: "task",
        priority: "medium",
        suggestedTime: "내일 오전 10:00",
        duration: "30분",
        reason: "오늘 일정이 꽉 차 있어서 내일 오전으로 배치했어요. 15분 회의 버퍼 이후 슬롯이에요.",
        personalization: null,
        alternatives: ["모레 오전", "이번 주 내"],
        status: "pending",
      },
      ...current,
    ]);
  }, []);

  const handleApprove = useCallback(
    (id: string) => {
      const suggestion = suggestions.find((item) => item.id === id);
      setSuggestions((current) => current.filter((item) => item.id !== id));

      if (suggestion?.linkedEventId) {
        setEvents((current) =>
          current.map((event) =>
            event.id === suggestion.linkedEventId ? { ...event, type: "aiApproved" } : event,
          ),
        );
      }

      showToast("캘린더에 추가됐어요", "되돌리기", () => {
        if (!suggestion) return;
        setSuggestions((current) => [{ ...suggestion, status: "pending" }, ...current]);
        if (suggestion.linkedEventId) {
          setEvents((current) =>
            current.map((event) =>
              event.id === suggestion.linkedEventId ? { ...event, type: "aiPending" } : event,
            ),
          );
        }
      });
    },
    [showToast, suggestions],
  );

  const handleDefer = useCallback(
    (id: string, when: "later_today" | "tomorrow" | "this_week" | "pick") => {
      const labels = {
        later_today: "오늘 나중에",
        tomorrow: "내일",
        this_week: "이번 주 안에",
        pick: "선택한 날",
      };

      setSuggestions((current) => current.filter((item) => item.id !== id));
      showToast(`${labels[when]}로 미뤘어요`);
    },
    [showToast],
  );

  const handleDelete = useCallback((id: string) => {
    setSuggestions((current) => current.filter((item) => item.id !== id));
  }, []);

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
        return <InboxScreen />;
      case "preferences":
        return <PreferencesScreen />;
      case "mobile":
        return <MobileToday events={events} suggestions={suggestions} />;
      case "components":
        return <ComponentsScreen />;
      default:
        return null;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar active={screen} onNavigate={setScreen} />
      <div className="app-content">{renderScreen()}</div>
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
