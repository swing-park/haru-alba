export interface Job {
  _id: string;
  employerId: { _id: string; name: string; trustScore: number; phone?: string };
  title: string;
  description: string;
  category: string;
  location: { address: string; lat: number; lng: number };
  date: string;
  startTime: string;
  endTime: string;
  pay: number;
  headcount: number;
  status: 'open' | 'closed' | 'completed';
  createdAt: string;
}

export interface Application {
  _id: string;
  jobId: Job;
  workerId: { _id: string; name: string; trustScore: number; attendanceRate: number; phone?: string };
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'noshow';
  appliedAt: string;
  confirmedAt?: string;
}

export const JOB_CATEGORIES = [
  '서빙/홀',
  '주방보조',
  '행사진행',
  '배달',
  '이사/청소',
  '전단지배포',
  '기타',
] as const;

export type JobCategory = typeof JOB_CATEGORIES[number];
