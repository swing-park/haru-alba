FROM node:20-alpine

WORKDIR /app

# pnpm 설치
RUN npm install -g pnpm

# 워크스페이스 설정 파일 복사
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/

# 의존성 설치
RUN pnpm install --frozen-lockfile

# 소스 복사
COPY apps/api ./apps/api

# 빌드
RUN pnpm --filter api build

EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]
