"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  Check,
  Clock,
  MoreHorizontal,
  X,
} from "lucide-react";
import type { CalendarEventType, Priority } from "@/lib/calendar-data";

export const eventTypeConfig: Record<
  CalendarEventType,
  {
    label: string;
    className: string;
  }
> = {
  confirmed: { label: "확정 일정", className: "event-confirmed" },
  protected: { label: "보호 시간", className: "event-protected" },
  aiApproved: { label: "AI 배치 완료", className: "event-approved" },
  aiPending: { label: "AI 제안 대기", className: "event-pending" },
  conflict: { label: "충돌", className: "event-conflict" },
};

export function PriorityBadge({ level }: { level: Priority }) {
  const labels: Record<Priority, string> = {
    high: "높음",
    medium: "중간",
    low: "낮음",
  };

  return (
    <span className={`priority-badge priority-${level}`}>
      <span aria-hidden="true" />
      {labels[level]}
    </span>
  );
}

export function DurationChip({ duration }: { duration: string }) {
  return (
    <span className="duration-chip">
      <Clock size={12} aria-hidden="true" />
      {duration}
    </span>
  );
}

export function LoadingDots() {
  return (
    <span className="loading-dots" aria-label="처리 중">
      <span />
      <span />
      <span />
    </span>
  );
}

export function Toast({
  message,
  action,
  onAction,
  onClose,
}: {
  message: string;
  action?: string;
  onAction?: () => void;
  onClose: () => void;
}) {
  return (
    <div className="toast" role="status">
      <span>{message}</span>
      {action ? (
        <button type="button" className="toast-action" onClick={onAction}>
          {action}
        </button>
      ) : null}
      <button type="button" className="icon-button toast-close" onClick={onClose} aria-label="토스트 닫기">
        <X size={14} />
      </button>
    </div>
  );
}

export function DeferMenu({
  onSelect,
}: {
  onSelect: (value: "later_today" | "tomorrow" | "this_week" | "pick") => void;
}) {
  const options = [
    { value: "later_today", label: "오늘 나중에" },
    { value: "tomorrow", label: "내일" },
    { value: "this_week", label: "이번 주 안에" },
    { value: "pick", label: "날짜 직접 선택" },
  ] as const;

  return (
    <div className="defer-menu">
      {options.map((option) => (
        <button key={option.value} type="button" onClick={() => onSelect(option.value)}>
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className={`toggle ${checked ? "is-on" : ""}`}
      onClick={onChange}
      aria-pressed={checked}
      aria-label={label}
    >
      <span />
    </button>
  );
}

export function IconMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="metric">
      <div className="metric-icon" aria-hidden="true">
        {icon}
      </div>
      <div>
        <div className="metric-label">{label}</div>
        <div className="metric-value">{value}</div>
      </div>
    </div>
  );
}

export function EventLegend() {
  return (
    <div className="event-legend" aria-label="일정 타입 범례">
      {(Object.entries(eventTypeConfig) as Array<[CalendarEventType, (typeof eventTypeConfig)[CalendarEventType]]>).map(
        ([type, config]) => (
          <span key={type}>
            <i className={`legend-line ${config.className}`} aria-hidden="true" />
            {config.label}
          </span>
        ),
      )}
    </div>
  );
}

export function positionFromTime(time: string, startHour = 8, pxPerMinute = 1) {
  const [hour, minute] = time.split(":").map(Number);
  return ((hour - startHour) * 60 + minute) * pxPerMinute;
}

export function eventStyle(
  start: string,
  duration: number,
  startHour = 8,
  pxPerMinute = 1,
): CSSProperties {
  return {
    top: positionFromTime(start, startHour, pxPerMinute),
    height: Math.max(duration * pxPerMinute, 24),
  };
}

export function MoreButton({ label }: { label: string }) {
  return (
    <button type="button" className="icon-button" aria-label={label}>
      <MoreHorizontal size={16} />
    </button>
  );
}

export function SavedState() {
  return (
    <span className="state-line">
      <Check size={12} aria-hidden="true" />
      저장됐어요. 일정으로 정리 중이에요.
    </span>
  );
}
