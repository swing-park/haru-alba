#!/bin/bash
# EC2 초기 세팅 스크립트 (Ubuntu 22.04 기준)
# 사용법: EC2 접속 후 bash ec2-setup.sh 실행

set -e

echo "=== Node.js 20 설치 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "=== pnpm 설치 ==="
npm install -g pnpm

echo "=== PM2 설치 ==="
npm install -g pm2

echo "=== Git 클론 ==="
cd ~
git clone https://github.com/<YOUR_GITHUB_USERNAME>/haru-alba.git
cd haru-alba

echo "=== .env 생성 (직접 입력 필요) ==="
cat > apps/api/.env << 'EOF'
MONGODB_URI=<YOUR_MONGODB_URI>
JWT_SECRET=<YOUR_JWT_SECRET>
JWT_EXPIRES_IN=7d
PORT=4000
FRONTEND_URL=<YOUR_FRONTEND_URL>
EOF
echo "⚠️  apps/api/.env 파일을 실제 값으로 수정해주세요!"

echo "=== 의존성 설치 및 빌드 ==="
pnpm install --frozen-lockfile
pnpm --filter api build

echo "=== PM2로 서버 시작 ==="
cd apps/api
pm2 start dist/main.js --name haru-alba-api
pm2 startup
pm2 save

echo "=== 완료! ==="
echo "API 서버가 포트 4000에서 실행 중입니다."
echo "pm2 status 명령으로 상태를 확인하세요."
