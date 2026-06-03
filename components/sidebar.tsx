"use client";

import {
  CalendarDays,
  Check,
  Grid2X2,
  Inbox,
  LayoutList,
  MonitorSmartphone,
  Settings,
} from "lucide-react";
import type { ComponentType } from "react";
import type { ScreenId } from "@/lib/calendar-data";

const navItems: Array<{
  id: ScreenId;
  label: string;
  badge?: number;
  icon: ComponentType<{ size?: number }>;
}> = [
  { id: "today", label: "오늘", icon: CalendarDays },
  { id: "weekly", label: "주간", icon: LayoutList },
  { id: "inbox", label: "인박스", badge: 4, icon: Inbox },
  { id: "preferences", label: "설정", icon: Settings },
  { id: "mobile", label: "모바일", icon: MonitorSmartphone },
  { id: "components", label: "컴포넌트", icon: Grid2X2 },
];

export function Sidebar({
  active,
  onNavigate,
}: {
  active: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">AC</div>
        <div>
          <div className="brand-name">AI Calendar</div>
          <div className="brand-sub">Smart Schedule</div>
        </div>
      </div>

      <nav className="nav-list" aria-label="주요 화면">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${isActive ? "is-active" : ""}`}
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={15} />
              <span>{item.label}</span>
              {item.badge && !isActive ? <b>{item.badge}</b> : null}
            </button>
          );
        })}

        <div className="mini-calendar" aria-label="2026년 6월 첫째 주">
          <div className="mini-title">6월 2026</div>
          <div className="mini-grid">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <span key={day} className="mini-weekday">
                {day}
              </span>
            ))}
            {Array.from({ length: 7 }, (_, index) => {
              const date = index + 1;
              return (
                <button
                  key={date}
                  type="button"
                  className={`mini-date ${date === 3 ? "is-today" : ""}`}
                  aria-label={`6월 ${date}일`}
                >
                  {date}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="user-card">
        <div className="avatar">지</div>
        <div>
          <div className="user-name">김지수</div>
          <div className="connected">
            <Check size={11} />
            Google 연결됨
          </div>
        </div>
      </div>
    </aside>
  );
}
