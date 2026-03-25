# 하루알바

> 퇴근길에 10만원 벌고 가기

초단기 부수입 전용 인력 매칭 플랫폼입니다. 기존 알바 플랫폼들이 장기 취업에 초점을 맞춘 것과 달리, 하루알바는 처음부터 "오늘 몇 시간만 일하고 싶다"는 수요를 겨냥해 만들었습니다.

이력서 쓰고, 면접 보고, 결과 기다리는 과정 없이 — 지원하면 구인자가 바로 확정할 수 있는 구조입니다.

---

## 왜 만들었나

알바 플랫폼을 쓰다 보면 단순히 "오늘 저녁 2시간 일하고 싶다"는 게 생각보다 번거롭습니다. 이력서를 올리고, 면접 일정 잡고, 합격 통보 기다리는 건 장기 취업도 아닌데 너무 무겁다고 느꼈습니다.

그래서 플로우 자체를 완전히 단순하게 만들었습니다. 구직자는 공고 보고 버튼 하나로 지원, 구인자는 지원자 목록에서 바로 확정. 끝입니다.

---

## 주요 기능

**구직자 (알바)**
- 오늘 날짜 기준 공고 목록 확인
- 업종별 필터 (카페, 행사, 배달 등)
- 원터치 지원 및 지원 현황 관리

**구인자 (사업자 / 개인)**
- 공고 등록 (날짜, 시간, 급여, 인원 설정)
- 지원자 목록 확인 및 즉시 확정
- 공고 마감 / 완료 처리

---

## 기술 스택

| 영역 | 사용 기술 |
|------|----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4, Zustand |
| Backend | NestJS, Mongoose |
| Database | MongoDB Atlas |
| 배포 | Vercel (프론트), Railway (백엔드) |
| 모노레포 | Turborepo + pnpm workspace |

---

## 로컬 실행

```bash
# 패키지 설치
pnpm install

# 환경변수 설정
cp .env.example .env
# .env에 MONGODB_URI 입력

# 개발 서버 실행 (프론트 + 백엔드 동시)
pnpm dev
```

프론트엔드: http://localhost:3000
백엔드 API: http://localhost:4000/api

### 테스트 데이터 세팅

```bash
pnpm seed
```

계정 6개 (고용주 3 / 워커 3)와 공고 8개가 생성됩니다.

| 이메일 | 비밀번호 | 유형 |
|--------|----------|------|
| kim.employer@test.com | test1234 | 고용주 |
| lee.employer@test.com | test1234 | 고용주 |
| park.employer@test.com | test1234 | 고용주 |
| choi.worker@test.com | test1234 | 워커 |
| jung.worker@test.com | test1234 | 워커 |
| han.worker@test.com | test1234 | 워커 |

---

## 환경변수

루트 `.env` (시드 스크립트용)

```
MONGODB_URI=mongodb+srv://...
```

`apps/api` (Railway에 직접 설정)

```
MONGODB_URI=
JWT_SECRET=
PORT=4000
```

`apps/web` (Vercel에 직접 설정)

```
NEXT_PUBLIC_API_URL=https://your-api.railway.app/api
```

---

## 프로젝트 구조

```
haru-alba/
├── apps/
│   ├── web/          # Next.js 프론트엔드
│   └── api/          # NestJS 백엔드
├── scripts/
│   └── seed.mjs      # 테스트 데이터 생성
└── docs/
    ├── TECH_SPEC.md
    └── TASK_PLAN.md
```

---

## 개발 현황

현재 MVP 단계입니다. 핵심 매칭 플로우(공고 등록 → 지원 → 확정 → 완료)는 동작하고, 이후 신뢰 시스템(후기, 출근율)과 정산 기능을 붙일 예정입니다.
