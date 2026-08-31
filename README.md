# Study Planner

할 일 체크, 목표 관리, 시험 일정과 성적을 한곳에서 관리하는 개인용 학습 플래너입니다.
백엔드 없이 브라우저 `localStorage`에만 저장하는 MVP 구성입니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
```

## 구조

```
src/
  app/                    라우트 (App Router)
    page.tsx              대시보드
    schedule/page.tsx     시험 일정
    grades/page.tsx       시험 성적
  components/
    layout/               사이드바, 페이지 헤더
    ui/                   Card, EmptyState, ProgressBar
    dashboard/            목표 카드, 할 일 체크리스트
    calendar/             월간 달력, 일정 폼/리스트
    grades/               성적 폼, 필터, 표, 추이 차트
  hooks/                  useLocalStorage 및 기능별 훅
  lib/                    타입, 날짜 유틸, storage 헬퍼
```

## 데이터 저장 키

| 키 | 내용 |
| --- | --- |
| `planner:todos` | `{ "YYYY-MM-DD": Todo[] }` — 날짜별 할 일 |
| `planner:goals` | 목표 대학 / 주 / 월 / 연 목표 |
| `planner:events` | 시험·일정 목록 |
| `planner:grades` | 성적 기록 |

날짜 키는 로컬 타임존 기준으로 만들어지며, 자정이 지나면 대시보드가 새 날짜의
빈 리스트로 넘어갑니다. 과거 날짜는 대시보드 상단의 화살표로 되돌아가 조회할 수 있습니다.
