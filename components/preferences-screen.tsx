"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Check } from "lucide-react";
import { Toggle } from "@/components/ui-primitives";

function SettingRow({
  label,
  sub,
  children,
}: {
  label: string;
  sub: string;
  children: ReactNode;
}) {
  return (
    <div className="setting-row">
      <div>
        <strong>{label}</strong>
        <span>{sub}</span>
      </div>
      {children}
    </div>
  );
}

function SelectInline({
  label,
  options,
  defaultValue,
}: {
  label: string;
  options: string[];
  defaultValue: string;
}) {
  return (
    <label className="select-inline">
      <span className="sr-only">{label}</span>
      <select defaultValue={defaultValue}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

export function PreferencesScreen() {
  const [prefs, setPrefs] = useState({
    weekendWork: false,
    focusProtect: true,
    bufferAfterMeeting: true,
    learnDefer: true,
  });

  const toggle = (key: keyof typeof prefs) => {
    setPrefs((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <main className="preferences-screen" data-screen-label="Preferences">
      <section className="settings-panel">
        <header>
          <h1>설정</h1>
          <p>시간 운영 방식을 조정해요. 대부분은 사용 패턴으로 자동 학습돼요.</p>
        </header>

        <h2>업무 시간</h2>
        <SettingRow label="업무 시작" sub="이 시간 이후로 일정을 배치해요">
          <SelectInline label="업무 시작" options={["오전 9:00", "오전 8:00", "오전 8:30", "오전 10:00"]} defaultValue="오전 9:00" />
        </SettingRow>
        <SettingRow label="업무 종료" sub="이 시간 이후로는 일정 배치를 피해요">
          <SelectInline label="업무 종료" options={["오후 6:00", "오후 5:00", "오후 5:30", "오후 7:00"]} defaultValue="오후 6:00" />
        </SettingRow>
        <SettingRow label="주말 사용" sub="주말에도 일정을 배치할 수 있어요">
          <Toggle checked={prefs.weekendWork} onChange={() => toggle("weekendWork")} label="주말 사용" />
        </SettingRow>

        <h2>집중 시간</h2>
        <SettingRow label="오전 집중 보호" sub="매일 09:00-11:00은 회의 없는 집중 시간으로 보호해요">
          <Toggle checked={prefs.focusProtect} onChange={() => toggle("focusProtect")} label="오전 집중 보호" />
        </SettingRow>
        <SettingRow label="선호 블록 길이" sub="한 번에 집중할 수 있는 최적 시간">
          <SelectInline label="선호 블록 길이" options={["90분", "60분", "45분", "120분"]} defaultValue="90분" />
        </SettingRow>

        <h2>버퍼 및 전환</h2>
        <SettingRow label="회의 후 버퍼" sub="회의 직후 15분 여유 시간을 자동으로 확보해요">
          <Toggle checked={prefs.bufferAfterMeeting} onChange={() => toggle("bufferAfterMeeting")} label="회의 후 버퍼" />
        </SettingRow>
        <SettingRow label="이동 시간 버퍼" sub="오프라인 미팅 전후 이동 시간 추가">
          <SelectInline label="이동 시간 버퍼" options={["30분", "15분", "사용 안 함"]} defaultValue="30분" />
        </SettingRow>

        <h2>자동화 수준</h2>
        <section className="automation-card" aria-label="자동화 수준">
          <div className="automation-options">
            <button type="button">보수적</button>
            <button type="button" className="is-active">
              균형잡힌
            </button>
            <button type="button">적극적</button>
          </div>
          <p>AI가 여러 대안을 제시하고, 사용자가 선택해요. 자동으로 확정하지 않아요.</p>
        </section>
        <SettingRow label="미루기 패턴 학습" sub="오늘 못함 선택 시 자동으로 패턴을 학습해요">
          <Toggle checked={prefs.learnDefer} onChange={() => toggle("learnDefer")} label="미루기 패턴 학습" />
        </SettingRow>

        <h2>연결</h2>
        <section className="connection-card">
          <div className="google-mark">G</div>
          <div>
            <strong>Google Calendar</strong>
            <span>
              <Check size={12} />
              연결됨 · kim.jisu@gmail.com
            </span>
            <small>캘린더 4개 동기화 중 · 마지막 동기화 2분 전</small>
          </div>
          <button type="button">연결 해제</button>
        </section>

        <h2>데이터</h2>
        <div className="danger-actions">
          <button type="button">모든 데이터 삭제</button>
          <button type="button">학습 데이터만 초기화</button>
        </div>
      </section>
    </main>
  );
}
