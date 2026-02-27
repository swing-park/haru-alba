import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => l.split('=').map((v, i) => i === 0 ? v.trim() : l.slice(l.indexOf('=') + 1).trim()))
);

const MONGODB_URI = env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('.env 파일에 MONGODB_URI가 없습니다.');

const client = new MongoClient(MONGODB_URI);

async function seed() {
  await client.connect();
  const db = client.db('haru-alba');

  // 기존 데이터 초기화
  await db.collection('users').deleteMany({});
  await db.collection('jobs').deleteMany({});
  await db.collection('applications').deleteMany({});
  console.log('기존 데이터 초기화 완료');

  // 비밀번호 해시 (모두 password1234!)
  const pw = await bcrypt.hash('password1234!', 10);

  // 구인자 3명
  const employers = await db.collection('users').insertMany([
    {
      type: 'employer',
      name: '홍길동 사장님',
      phone: '010-1111-1111',
      email: 'employer1@test.com',
      passwordHash: pw,
      verified: true,
      bizNumber: '123-45-67890',
      trustScore: 92,
      attendanceRate: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      type: 'employer',
      name: '김민수 대표',
      phone: '010-2222-2222',
      email: 'employer2@test.com',
      passwordHash: pw,
      verified: true,
      bizNumber: '234-56-78901',
      trustScore: 85,
      attendanceRate: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      type: 'employer',
      name: '이수진 점장',
      phone: '010-3333-3333',
      email: 'employer3@test.com',
      passwordHash: pw,
      verified: true,
      bizNumber: '345-67-89012',
      trustScore: 78,
      attendanceRate: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // 구직자 3명
  await db.collection('users').insertMany([
    {
      type: 'worker',
      name: '박알바',
      phone: '010-4444-4444',
      email: 'worker1@test.com',
      passwordHash: pw,
      verified: true,
      trustScore: 88,
      attendanceRate: 97,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      type: 'worker',
      name: '최투잡',
      phone: '010-5555-5555',
      email: 'worker2@test.com',
      passwordHash: pw,
      verified: true,
      trustScore: 75,
      attendanceRate: 90,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      type: 'worker',
      name: '정부수입',
      phone: '010-6666-6666',
      email: 'worker3@test.com',
      passwordHash: pw,
      verified: true,
      trustScore: 95,
      attendanceRate: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [e1, e2, e3] = Object.values(employers.insertedIds);

  // 오늘 날짜 기준
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);
  const threeDays = new Date(today); threeDays.setDate(today.getDate() + 3);

  // 공고 8개
  await db.collection('jobs').insertMany([
    {
      employerId: e1,
      title: '강남 카페 서빙 도우미 (당일)',
      description: '바쁜 저녁 시간대 서빙 도우미를 구합니다.\n\n업무: 음료 서빙, 테이블 정리\n복장: 깔끔한 캐주얼\n경험 무관, 친절한 분 환영!\n\n주차 불가, 지하철 2호선 강남역 도보 3분',
      category: '서빙/홀',
      location: { address: '서울시 강남구 테헤란로 123', lat: 37.4979, lng: 127.0276 },
      date: today,
      startTime: '18:00',
      endTime: '22:00',
      pay: 60000,
      headcount: 2,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      employerId: e2,
      title: '홍대 행사 스태프 모집',
      description: '신제품 론칭 팝업스토어 운영 스태프를 모집합니다.\n\n업무: 제품 안내, 시연 보조, 방문객 응대\n복장: 캐주얼 (블랙 계열)\n말씀 잘 하시는 분 우대\n\n홍대입구역 3번 출구 도보 5분',
      category: '행사진행',
      location: { address: '서울시 마포구 와우산로 29', lat: 37.5519, lng: 126.9245 },
      date: today,
      startTime: '13:00',
      endTime: '20:00',
      pay: 98000,
      headcount: 4,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      employerId: e1,
      title: '역삼동 식당 주방 보조',
      description: '점심/저녁 피크타임 주방 보조 구합니다.\n\n업무: 설거지, 재료 손질, 주방 정리\n경험 없어도 됩니다. 성실한 분 환영\n\n식사 제공 (점심/저녁)\n2호선 역삼역 1번 출구',
      category: '주방보조',
      location: { address: '서울시 강남구 역삼로 456', lat: 37.5006, lng: 127.0368 },
      date: tomorrow,
      startTime: '10:00',
      endTime: '15:00',
      pay: 65000,
      headcount: 1,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      employerId: e3,
      title: '신촌 전단지 배포 알바',
      description: '헬스장 오픈 기념 전단지 배포 도우미를 구합니다.\n\n업무: 신촌 일대 전단지 배포\n복장: 자유\n날씨 무관 실외 작업입니다.\n\n2호선 신촌역 1번 출구 집합',
      category: '전단지배포',
      location: { address: '서울시 서대문구 신촌로 78', lat: 37.5554, lng: 126.9368 },
      date: tomorrow,
      startTime: '14:00',
      endTime: '18:00',
      pay: 44000,
      headcount: 3,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      employerId: e2,
      title: '이사짐 운반 도우미 (당일)',
      description: '1톤 트럭 이사 도우미를 구합니다.\n\n업무: 짐 운반, 포장 보조\n체력 좋으신 분 환영\n작업 완료 후 즉시 현금 지급\n\n7호선 건대입구역 2번 출구 집합',
      category: '이사/청소',
      location: { address: '서울시 광진구 능동로 123', lat: 37.5388, lng: 127.0703 },
      date: today,
      startTime: '09:00',
      endTime: '14:00',
      pay: 80000,
      headcount: 2,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      employerId: e3,
      title: '성수동 팝업스토어 안내 스태프',
      description: '주말 팝업스토어 안내 및 포토존 운영 스태프 모집\n\n업무: 방문객 안내, 포토존 촬영 보조, 굿즈 판매\n복장: 흰 티셔츠 + 청바지\n밝고 활발한 분 우대!\n\n2호선 성수역 4번 출구',
      category: '행사진행',
      location: { address: '서울시 성동구 성수일로 77', lat: 37.5444, lng: 127.0557 },
      date: dayAfter,
      startTime: '11:00',
      endTime: '19:00',
      pay: 96000,
      headcount: 5,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      employerId: e1,
      title: '배달 라이더 보조 (오토바이 없어도 됨)',
      description: '음식점 배달 픽업 및 포장 보조 알바\n\n업무: 포장 확인, 배달앱 주문 확인, 라이더 보조\n오토바이 면허 불필요\n주방 내 작업\n\n4호선 혜화역 1번 출구',
      category: '배달',
      location: { address: '서울시 종로구 대학로 56', lat: 37.5826, lng: 127.0020 },
      date: threeDays,
      startTime: '17:00',
      endTime: '21:00',
      pay: 52000,
      headcount: 1,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      employerId: e2,
      title: '바퀴벌레 잡아주세요 (긴급)',
      description: '카페 주방에 바퀴벌레가 나왔어요 😱\n빠르게 잡아주실 분 구합니다.\n\n작업 완료 후 현금 즉시 지급\n방역약품 제공\n경험자 우대\n\n지하철 1호선 종각역',
      category: '기타',
      location: { address: '서울시 종로구 종로 123', lat: 37.5702, lng: 126.9820 },
      date: today,
      startTime: '15:00',
      endTime: '17:00',
      pay: 30000,
      headcount: 1,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  console.log('\n✅ 시드 데이터 생성 완료!');
  console.log('\n👤 테스트 계정 (비밀번호 모두 동일: password1234!)');
  console.log('─────────────────────────────────────────');
  console.log('구인자: employer1@test.com');
  console.log('구인자: employer2@test.com');
  console.log('구인자: employer3@test.com');
  console.log('구직자: worker1@test.com');
  console.log('구직자: worker2@test.com');
  console.log('구직자: worker3@test.com');
  console.log('─────────────────────────────────────────');
  console.log('📋 공고 8개 생성 (오늘~3일 후)');

  await client.close();
}

seed().catch(console.error);
