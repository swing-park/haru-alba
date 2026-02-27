# TECH_SPEC.md

## 시스템 아키텍처
- 프론트엔드: Next.js App Router 기반 SSR/CSR 혼합
- 백엔드: NestJS REST API 서버
- DB: MongoDB Atlas
- 인프라: AWS (S3, EC2, CloudFront, Route53, Amplify)
- CI/CD: Github Actions

## 기술 스택 및 선정 이유
- Next.js: SEO 최적화 필요 (공고 페이지 검색 노출), SSR 지원
- TypeScript: 타입 안정성, 협업 효율
- Tailwind CSS: 빠른 UI 개발
- Recoil: 전역 상태관리 (유저 인증 상태, 공고 필터 등)
- NestJS: 모듈화 구조, TypeScript 기반, 확장성
- MongoDB: 비정형 공고 데이터에 유연한 스키마 적합
- AWS: 기존 운영 경험 있음

## 폴더 구조

### 프론트엔드 (apps/web)
```
apps/web/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (employer)/
│   │   ├── dashboard/
│   │   └── jobs/
│   │       ├── new/
│   │       └── [id]/
│   ├── (worker)/
│   │   ├── dashboard/
│   │   └── jobs/
│   │       └── [id]/
│   └── layout.tsx
├── components/
│   ├── common/
│   ├── employer/
│   └── worker/
├── hooks/
├── lib/
├── store/
└── types/
```

### 백엔드 (apps/api)
```
apps/api/
├── src/
│   ├── auth/
│   ├── users/
│   ├── jobs/
│   ├── applications/
│   ├── reviews/
│   ├── notifications/
│   └── common/
└── test/
```

## DB 스키마 설계

### User
```json
{
  "_id": "ObjectId",
  "type": "employer | worker",
  "name": "string",
  "phone": "string",
  "email": "string",
  "passwordHash": "string",
  "verified": "boolean",
  "bizNumber": "string (optional, employer only)",
  "trustScore": "number",
  "attendanceRate": "number (worker only)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Job (공고)
```json
{
  "_id": "ObjectId",
  "employerId": "ObjectId",
  "title": "string",
  "description": "string",
  "category": "string",
  "location": {
    "address": "string",
    "lat": "number",
    "lng": "number"
  },
  "date": "Date",
  "startTime": "string",
  "endTime": "string",
  "pay": "number",
  "headcount": "number",
  "status": "open | closed | completed",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Application (지원)
```json
{
  "_id": "ObjectId",
  "jobId": "ObjectId",
  "workerId": "ObjectId",
  "status": "pending | confirmed | completed | cancelled | noshow",
  "appliedAt": "Date",
  "confirmedAt": "Date (optional)",
  "completedAt": "Date (optional)"
}
```

### Review (후기)
```json
{
  "_id": "ObjectId",
  "applicationId": "ObjectId",
  "fromUserId": "ObjectId",
  "toUserId": "ObjectId",
  "score": "number",
  "comment": "string",
  "createdAt": "Date"
}
```

## API 설계

### 인증 (Auth)
- POST /auth/signup - 회원가입
- POST /auth/login - 로그인
- POST /auth/verify - 본인인증
- POST /auth/refresh - 토큰 갱신

### 공고 (Jobs)
- GET /jobs - 공고 목록 조회 (필터: 지역, 날짜, 시간, 업종)
- POST /jobs - 공고 등록
- GET /jobs/:id - 공고 상세
- PATCH /jobs/:id - 공고 수정
- DELETE /jobs/:id - 공고 삭제

### 지원 (Applications)
- POST /jobs/:id/apply - 지원하기
- GET /jobs/:id/applications - 지원자 목록 (employer)
- PATCH /applications/:id/confirm - 지원 확정
- PATCH /applications/:id/complete - 완료 처리
- PATCH /applications/:id/cancel - 취소

### 후기 (Reviews)
- POST /reviews - 후기 작성
- GET /users/:id/reviews - 유저 후기 목록

### 알림 (Notifications)
- GET /notifications - 알림 목록
- PATCH /notifications/:id/read - 읽음 처리

## 인프라 설계
- EC2: NestJS API 서버
- S3: 이미지 업로드 (프로필, 공고 사진)
- CloudFront: CDN (S3 앞단)
- Route53: 도메인 관리
- Amplify: Next.js 프론트엔드 배포
- Github Actions: CI/CD 파이프라인
