export type CalendarEventType =
  | "confirmed"
  | "protected"
  | "aiApproved"
  | "aiPending"
  | "conflict";

export type SuggestionType = "task" | "meeting" | "recurring" | "note";
export type Priority = "high" | "medium" | "low";
export type ScreenId =
  | "today"
  | "weekly"
  | "inbox"
  | "preferences"
  | "mobile"
  | "components";

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  start: string;
  end: string;
  duration: number;
  pastEvent?: boolean;
  upcoming?: boolean;
  timeUntil?: string;
}

export interface ScheduleSuggestion {
  id: string;
  linkedEventId?: string;
  title: string;
  type: SuggestionType;
  priority: Priority;
  suggestedTime: string;
  duration: string;
  reason: string;
  personalization?: string | null;
  alternatives: string[];
  status: "pending" | "approved" | "deferred";
}

export interface DeadlineItem {
  title: string;
  deadline: string;
}

export interface WeeklyEvent {
  id: string;
  title: string;
  start: string;
  dur: number;
  type: CalendarEventType;
}

export interface WeeklyDay {
  day: string;
  date: string;
  today?: boolean;
  events: WeeklyEvent[];
}

export type InboxState = "parsed" | "clarification" | "parsing";

export interface InboxItem {
  id: string;
  raw: string;
  state: InboxState;
  time: string;
  question?: string;
  parsed?: {
    title: string;
    type: SuggestionType;
    when: string;
  };
}

export const initialEvents: CalendarEvent[] = [
  {
    id: "e1",
    title: "팀 스탠드업",
    type: "confirmed",
    start: "08:30",
    end: "09:00",
    duration: 30,
    pastEvent: true,
  },
  {
    id: "e2",
    title: "집중 작업 시간",
    type: "protected",
    start: "09:00",
    end: "11:00",
    duration: 120,
  },
  {
    id: "e3",
    title: "제품 기획 미팅",
    type: "confirmed",
    start: "11:00",
    end: "12:00",
    duration: 60,
    upcoming: true,
    timeUntil: "15분 후",
  },
  {
    id: "e4",
    title: "점심",
    type: "confirmed",
    start: "12:00",
    end: "13:00",
    duration: 60,
  },
  {
    id: "e5",
    title: "디자인 리뷰",
    type: "confirmed",
    start: "14:00",
    end: "15:30",
    duration: 90,
  },
  {
    id: "e6",
    title: "박팀장 메일 답변",
    type: "aiApproved",
    start: "15:30",
    end: "16:00",
    duration: 30,
  },
  {
    id: "ep1",
    title: "Q3 전략 문서 초안",
    type: "aiPending",
    start: "16:00",
    end: "17:30",
    duration: 90,
  },
];

export const initialSuggestions: ScheduleSuggestion[] = [
  {
    id: "s1",
    linkedEventId: "ep1",
    title: "Q3 전략 문서 초안 작성",
    type: "task",
    priority: "high",
    suggestedTime: "오늘 16:00 - 17:30",
    duration: "90분",
    reason:
      "금요일 마감이고 90분 집중 시간이 필요해요. 내일 오전은 회의가 많아서 오늘 16:00에 배치했어요.",
    personalization: "문서 작업은 보통 예상보다 오래 걸려 90분으로 잡았어요.",
    alternatives: ["내일 09:00", "내일 15:00"],
    status: "pending",
  },
  {
    id: "s2",
    title: "마케팅팀 협업 일정 조율",
    type: "meeting",
    priority: "medium",
    suggestedTime: "내일 10:00 - 10:30",
    duration: "30분",
    reason:
      "이번 주 안에 잡는 게 좋아요. 내일 오전 슬롯이 비어있어요. 회의 전 15분 버퍼도 확보했어요.",
    alternatives: ["내일 14:00", "목요일 오전"],
    status: "pending",
  },
  {
    id: "s3",
    title: "클라이언트 A 제안서 검토",
    type: "task",
    priority: "high",
    suggestedTime: "목요일 09:00 - 10:00",
    duration: "60분",
    reason: "다음 주 월요일 전달 마감이에요. 목요일 오전 집중 시간에 배치했어요.",
    personalization: "검토 작업은 오전에 하실 때 더 빠르게 끝나는 편이에요.",
    alternatives: ["금요일 오전"],
    status: "pending",
  },
];

export const deadlines: DeadlineItem[] = [
  { title: "Q3 전략 문서", deadline: "금요일 마감" },
];

export const weeklyDays: WeeklyDay[] = [
  {
    day: "월",
    date: "6/1",
    events: [
      { id: "w1a", title: "마케팅 리뷰", start: "10:00", dur: 60, type: "confirmed" },
      { id: "w1b", title: "집중 작업", start: "13:30", dur: 120, type: "protected" },
      { id: "w1c", title: "채용 피드백 정리", start: "17:00", dur: 45, type: "aiApproved" },
    ],
  },
  {
    day: "화",
    date: "6/2",
    events: [
      { id: "w2a", title: "디자인 리뷰", start: "09:30", dur: 90, type: "confirmed" },
      { id: "w2b", title: "집중 시간", start: "11:30", dur: 90, type: "protected" },
      { id: "w2c", title: "채용 인터뷰", start: "15:00", dur: 60, type: "confirmed" },
      { id: "w2d", title: "마케팅 자료 준비", start: "17:00", dur: 60, type: "aiPending" },
    ],
  },
  {
    day: "수",
    date: "6/3",
    today: true,
    events: [
      { id: "w3a", title: "팀 스탠드업", start: "08:30", dur: 30, type: "confirmed" },
      { id: "w3b", title: "집중 작업 시간", start: "09:00", dur: 120, type: "protected" },
      { id: "w3c", title: "제품 기획 미팅", start: "11:00", dur: 60, type: "confirmed" },
      { id: "w3d", title: "점심", start: "12:00", dur: 60, type: "confirmed" },
      { id: "w3e", title: "디자인 리뷰", start: "14:00", dur: 90, type: "confirmed" },
      { id: "w3f", title: "박팀장 메일 답변", start: "15:30", dur: 30, type: "aiApproved" },
      { id: "w3g", title: "Q3 전략 문서 초안", start: "16:00", dur: 90, type: "aiPending" },
    ],
  },
  {
    day: "목",
    date: "6/4",
    events: [
      { id: "w4a", title: "투자자 미팅", start: "10:00", dur: 120, type: "confirmed" },
      { id: "w4b", title: "팀 교육 충돌", start: "10:30", dur: 60, type: "conflict" },
      { id: "w4c", title: "집중 시간", start: "14:00", dur: 90, type: "protected" },
      { id: "w4d", title: "클라이언트 검토", start: "16:00", dur: 60, type: "aiPending" },
    ],
  },
  {
    day: "금",
    date: "6/5",
    events: [
      { id: "w5a", title: "올인원 미팅", start: "09:00", dur: 90, type: "confirmed" },
      { id: "w5b", title: "Q3 마감 작업", start: "11:00", dur: 180, type: "aiApproved" },
      { id: "w5c", title: "주간 리뷰", start: "14:30", dur: 60, type: "confirmed" },
    ],
  },
];

export const initialInboxItems: InboxItem[] = [
  {
    id: "i1",
    raw: "다음 주까지 분기 보고서 완성해야 함",
    state: "parsed",
    parsed: { title: "분기 보고서 작성", type: "task", when: "다음 주 금요일" },
    time: "2분 전",
  },
  {
    id: "i2",
    raw: "마케팅팀이랑 언제 미팅 잡지",
    state: "clarification",
    question: "이번 주 안에 잡을까요, 다음 주로 할까요?",
    time: "10분 전",
  },
  {
    id: "i3",
    raw: "헬스장 주 3회 습관으로",
    state: "parsed",
    parsed: { title: "헬스장 반복", type: "recurring", when: "매주 화, 목, 토 저녁" },
    time: "어제",
  },
  {
    id: "i4",
    raw: "클라이언트 A 미팅 이번 주 안에",
    state: "parsing",
    time: "방금",
  },
];
