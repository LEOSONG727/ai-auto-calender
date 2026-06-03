# Claude Design Prompt

아래 프롬프트를 Claude, v0, 또는 다른 디자인 생성 AI에 입력해 AI Auto Calendar의 고품질 앱 UI 시안을 생성한다.

---

## Prompt

너는 금융 서비스 수준의 신뢰감과 생산성 도구 수준의 정보 밀도를 모두 이해하는 시니어 UX/UI 디자이너다. 아래 제품의 실제 웹/PWA 앱 UI를 설계해줘. 마케팅 랜딩 페이지가 아니라, 사용자가 바로 사용할 수 있는 프로덕트 화면을 만들어야 한다.

## Product

제품명: AI Auto Calendar

AI Auto Calendar는 사용자가 떠오르는 일정과 할 일을 Google Keep처럼 아무렇게나 적으면, 기존 캘린더와 개인 성향을 바탕으로 실제 가능한 시간대에 타임블록을 제안하고, 사용자가 승인하면 캘린더에 반영하는 AI 비서형 스케줄 오퍼레이터다.

이 제품은 일반 캘린더 앱이 아니다. 사용자의 시간을 대신 운영해주는 개인 비서에 가깝다.

사용자는:

- 생각나는 일을 막 적는다.
- AI가 정리한 결과를 본다.
- 추천 시간과 이유를 확인한다.
- 승인, 수정, 미루기 중 하나를 선택한다.
- 제품은 이 행동을 학습해 다음 제안을 더 잘 맞춘다.

## Core Promise

사용자가 느껴야 하는 핵심 감정:

> "생각나는 대로 적었는데, 내 하루가 정리됐다."

이 제품은 "AI가 똑똑해 보이는 앱"이 아니라, "사용자가 하루를 덜 걱정하게 만드는 앱"이어야 한다.

## Target Users

주요 사용자는 일정과 할 일이 동시에 많은 지식 노동자다.

- 스타트업 창업자
- PM
- 팀 리드
- 디자이너/개발자
- 미팅과 실무가 섞여 있는 직장인
- 실제 비서 없이 많은 일정을 처리해야 하는 사람

이 사람들은 할 일 앱을 하나 더 원하는 게 아니다. 지금 있는 시간 안에서 무엇을 언제 해야 할지 대신 정리해주는 서비스를 원한다.

## UX Principles

반드시 지켜야 할 UX 원칙:

1. 앱을 열자마자 입력할 수 있어야 한다.
2. 사용자는 필드를 채우는 것이 아니라 자연어로 막 적을 수 있어야 한다.
3. AI 제안과 확정된 캘린더 일정은 명확히 구분되어야 한다.
4. AI는 제안하고, 사용자는 승인한다.
5. 수정은 승인만큼 쉬워야 한다.
6. 개인화는 별도 설명이 아니라 추천 이유 안에서 자연스럽게 드러나야 한다.
7. 사용자가 미루거나 수정하는 행동도 실패가 아니라 학습 데이터로 느껴져야 한다.
8. 화면은 조용하고 신뢰감 있어야 한다.

## Visual Direction

원하는 분위기:

- calm
- precise
- trustworthy
- focused
- lightweight
- adaptive
- executive assistant
- quiet productivity

피해야 할 분위기:

- 과한 AI 서비스 느낌
- 보라색 그라디언트 중심
- 마케팅용 히어로
- 장식적인 카드 남발
- 캐릭터나 일러스트 중심
- 텍스트 설명이 많은 화면
- 어두운 해커톤 대시보드 느낌

컬러 방향:

- 배경은 neutral 계열
- 텍스트는 고대비 charcoal
- 확정 일정은 muted blue/gray
- AI 제안은 soft teal 또는 green
- 위험/충돌은 restrained red
- 보호 시간은 pale gray 또는 subtle hatch
- 완료 상태는 muted green

UI 밀도:

- SaaS 운영 도구처럼 너무 빽빽하면 안 된다.
- 반대로 마케팅 앱처럼 비어 있어도 안 된다.
- 사용자가 오늘 무엇을 해야 하는지 빠르게 스캔할 수 있어야 한다.

## Required Screens

다음 화면을 모두 설계해줘.

### 1. Desktop Today

목표:

사용자가 오늘 무엇을 해야 하는지 즉시 이해하고, 새 할 일을 바로 입력할 수 있어야 한다.

필수 요소:

- 좌측 내비게이션
- 상단 또는 중앙 Quick Capture 입력창
- 현재 시간 기준 "Next Action"
- 오늘 일정 타임라인
- 기존 캘린더 일정
- 승인된 AI 타임블록
- 승인 대기 AI 제안
- 마감 위험 알림
- 개인화 힌트

권장 레이아웃:

```text
Left Sidebar | Today Timeline | AI Suggestions Panel
```

### 2. Mobile Today

목표:

폰에서 Google Keep처럼 빠르게 입력하고, 오늘 해야 할 일을 확인할 수 있어야 한다.

필수 요소:

- Today header
- Quick Capture
- Next Action
- Compact timeline
- Pending suggestions
- Bottom navigation
- Suggestion detail bottom sheet

모바일에서는 주간 캘린더보다 오늘/내일 중심의 판단이 중요하다.

### 3. Quick Capture States

다음 상태를 보여줘.

- idle
- typing
- saved
- parsing
- parsed
- needs clarification
- failed but saved

중요:

AI 처리가 늦어도 사용자가 불안하지 않아야 한다. 입력은 즉시 저장되고, AI 정제는 비동기로 진행된다는 느낌을 줘야 한다.

문구 예시:

```text
입력은 저장했어요. 일정 형식으로 정리 중입니다.
```

### 4. AI Suggestion Card

목표:

사용자가 AI 제안을 빠르게 이해하고 승인/수정/미루기를 쉽게 선택할 수 있어야 한다.

카드에 포함할 내용:

- 정제된 제목
- 유형: 일정 / 할 일 / 반복 / 메모
- 추천 시간
- 예상 소요시간
- 우선순위
- 추천 이유
- 개인화 근거
- 대안 시간
- 승인 버튼
- 시간 변경 버튼
- 오늘 못함 버튼
- 삭제 버튼

추천 이유 예시:

```text
금요일 마감이고 90분 집중 시간이 필요해요. 내일 오전은 회의가 많아서 오늘 16:00에 배치했어요.
```

개인화 근거 예시:

```text
문서 작업은 보통 예상보다 오래 걸려 90분으로 잡았어요.
```

### 5. Weekly Plan

목표:

사용자가 이번 주 일정을 보고 AI 타임블록을 직접 조정할 수 있어야 한다.

필수 요소:

- 주간 캘린더 그리드
- 기존 일정
- AI 타임블록
- 승인 대기 제안 블록
- 충돌 표시
- 보호 시간
- 드래그/리사이즈 가능한 느낌
- 우선순위 필터

중요:

이 화면은 "일정을 보는 화면"이 아니라 "시간을 운영하는 화면"이다.

### 6. Inbox

목표:

아직 정리되지 않은 입력과 AI가 질문해야 하는 항목을 처리한다.

필수 요소:

- 정리 대기 입력
- 질문 필요 항목
- 일정 후보
- 할 일 후보
- 보류/삭제
- 빠른 정제 결과

Inbox는 부담스러운 할 일 더미처럼 보이면 안 된다. 사용자가 머릿속에서 꺼낸 생각을 제품이 대신 들고 있는 공간처럼 보여야 한다.

### 7. Preferences / Personalization

목표:

사용자가 자신의 시간 운영 선호를 가볍게 조정할 수 있어야 한다.

필수 요소:

- 업무 시간
- 보호 시간
- 집중 시간
- 회의 후 버퍼
- 선호 블록 길이
- 주말 사용 여부
- 자동화 수준
- Google Calendar 연결 상태
- 데이터 삭제/연결 해제

중요:

설정 화면이 복잡해지면 실패다. 개인화는 대부분 행동으로 학습되고, 설정은 최소한의 안전장치여야 한다.

## Required Components

다음 컴포넌트들을 디자인해줘.

- Quick Capture input
- Timeline day view
- Week calendar grid
- Existing event block
- AI suggested block
- Approved AI time block
- Conflict block
- Protected time block
- Suggestion card
- Priority badge
- Duration chip
- Reason text
- Personalization hint
- Approval action bar
- Defer menu
- Inline edit field
- Bottom sheet
- Empty state
- Loading state
- Error state

## Interaction Details

### Approval

승인 후에는 카드가 바로 사라지는 것이 아니라 "캘린더에 추가됨" 상태로 잠깐 남아야 한다.

반드시 undo 액션을 보여줘.

### Edit

시간, 소요시간, 우선순위는 inline 또는 bottom sheet로 가볍게 수정 가능해야 한다.

### Defer

미루기는 실패가 아니다. "오늘 못함"이나 "나중에" 버튼은 부끄럽거나 부정적으로 보이면 안 된다.

옵션:

- 오늘 나중에
- 내일
- 이번 주 안에
- 직접 선택

### Learning Feedback

피드백은 설문처럼 보이면 안 된다.

좋은 예:

```text
비슷한 문서 작업은 앞으로 90분으로 잡을까요?
```

버튼:

- 네
- 이번만
- 아니요

## Copy Tone

문구는 짧고 실용적이어야 한다.

좋은 톤:

- "입력은 저장했어요."
- "가능한 시간 2개를 찾았어요."
- "회의 직후는 피해서 배치했어요."
- "오늘 안에 끝내기 어려울 수 있어요."
- "이 작업은 내일 오전으로 옮길 수 있어요."

나쁜 톤:

- "AI가 최적화된 생산성 경험을 제공합니다."
- "당신의 퍼포먼스를 극대화하세요."
- "스마트한 일정 관리를 시작하세요."

## Layout Requirements

Desktop:

- 1440px 기준
- 좌측 sidebar, 중앙 main, 우측 AI panel
- Today timeline이 가장 넓어야 한다.
- AI panel은 제안과 위험 알림을 담는다.

Mobile:

- 390px 기준
- 하단 navigation
- Quick Capture 우선
- Suggestion detail은 bottom sheet
- 주간 캘린더는 단순화

Responsive:

- 데스크톱에서는 계획 조정
- 모바일에서는 빠른 입력과 오늘 확인
- 태블릿에서는 2열 레이아웃

## Accessibility

다음을 지켜줘.

- 색상만으로 상태를 구분하지 말 것
- 캘린더 블록에는 텍스트 라벨이 있어야 함
- 터치 타겟은 모바일에서 최소 44px
- 작은 시간 라벨도 충분한 대비 확보
- 긴 제목은 말줄임 또는 줄바꿈 기준 필요
- 버튼 문구는 명확해야 함

## Output Format

가능하면 다음 형태로 결과를 제공해줘.

1. 디자인 컨셉 요약
2. 컬러/타이포그래피/간격 토큰
3. 데스크톱 Today 화면
4. 모바일 Today 화면
5. AI Suggestion Card
6. Weekly Plan 화면
7. Inbox 화면
8. Preferences 화면
9. 주요 컴포넌트 상태
10. 구현 시 주의할 UX 디테일

만약 코드를 생성한다면 React + TypeScript 기준으로 작성해줘. UI는 실제 앱 첫 화면처럼 동작 가능한 수준이어야 하고, 랜딩 페이지나 마케팅 히어로는 만들지 마.

## Final Quality Bar

결과물은 다음 질문을 통과해야 한다.

- 앱을 열자마자 바로 입력할 수 있는가?
- 사용자가 AI를 무서워하지 않고 통제할 수 있는가?
- AI 제안과 확정 일정이 명확히 구분되는가?
- 시간 배치 이유가 납득되는가?
- 사용자가 수정/미루기/완료를 부담 없이 할 수 있는가?
- 며칠 쓰면 점점 나에게 맞춰진다는 느낌이 드는가?
- 실제 서비스로 구현 가능한 구조인가?

---

## Optional Short Prompt

짧게 입력해야 할 때는 아래 버전을 사용한다.

```text
AI Auto Calendar라는 웹/PWA 앱 UI를 디자인해줘. 이 제품은 사용자가 일정과 할 일을 Google Keep처럼 막 적으면, 기존 Google Calendar 일정과 개인 성향을 바탕으로 가능한 시간대에 AI가 타임블록을 제안하고, 사용자가 승인하면 캘린더에 반영하는 AI 비서형 스케줄 오퍼레이터야.

마케팅 랜딩 페이지가 아니라 실제 앱 화면을 만들어야 해. 핵심 화면은 Desktop Today, Mobile Today, Quick Capture, AI Suggestion Card, Weekly Plan, Inbox, Preferences야.

디자인 톤은 조용하고 신뢰감 있는 업무 도구, 개인 비서, 시간 운영실 느낌이어야 해. 과한 AI 브랜딩, 보라색 그라디언트, 캐릭터, 설명 많은 화면은 피해야 해.

사용자는 앱을 열자마자 바로 입력할 수 있어야 하고, AI 제안은 확정 일정과 명확히 구분되어야 해. 승인/수정/미루기가 모두 쉬워야 하고, 추천 이유에는 "왜 이 시간인지"와 "사용자 개인 패턴을 어떻게 반영했는지"가 짧게 보여야 해.

데스크톱은 좌측 sidebar + 중앙 Today timeline + 우측 AI suggestions panel 구조, 모바일은 Quick Capture와 Today 중심, 제안 상세는 bottom sheet로 설계해줘.
```
