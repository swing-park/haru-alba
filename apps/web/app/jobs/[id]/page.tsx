'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import { useAuthStore } from '@/store/auth';
import { Job } from '@/types';
import api from '@/lib/api';

function formatPay(pay: number) {
  return pay.toLocaleString('ko-KR') + '원';
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일(${['일','월','화','수','목','금','토'][d.getDay()]})`;
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(({ data }) => setJob(data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!user) return router.push('/login');
    if (user.type !== 'worker') return setError('구직자만 지원할 수 있습니다.');
    setApplying(true);
    try {
      await api.post(`/jobs/${id}/apply`);
      setApplied(true);
    } catch (err: any) {
      setError(err.response?.data?.message || '지원에 실패했습니다.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">불러오는 중...</div>;
  if (!job) return <div className="min-h-screen flex items-center justify-center text-gray-500">공고를 찾을 수 없습니다.</div>;

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Link href="/jobs" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">← 목록으로</Link>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-medium">{job.category}</span>
            <span className="text-2xl font-bold text-orange-500">{formatPay(job.pay)}</span>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-4">{job.title}</h1>

          <div className="space-y-3 text-sm mb-6">
            <div className="flex gap-3 text-gray-700"><span className="w-5">📅</span><span>{formatDate(job.date)} {job.startTime} ~ {job.endTime}</span></div>
            <div className="flex gap-3 text-gray-700"><span className="w-5">📍</span><span>{job.location.address}</span></div>
            <div className="flex gap-3 text-gray-700"><span className="w-5">👥</span><span>정원 {job.headcount}명</span></div>
            <div className="flex gap-3 text-gray-700"><span className="w-5">🏢</span><span>{job.employerId?.name} (신뢰도 {job.employerId?.trustScore}점)</span></div>
          </div>

          <hr className="mb-4" />
          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{job.description}</div>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {applied ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center text-green-700 font-medium">
            ✅ 지원 완료! 구인자 확정을 기다려주세요.
          </div>
        ) : user?.type === 'employer' ? null : (
          <button
            onClick={handleApply}
            disabled={applying || job.status !== 'open'}
            className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl text-lg hover:bg-orange-600 transition disabled:opacity-50"
          >
            {applying ? '지원 중...' : job.status !== 'open' ? '마감된 공고입니다' : '지원하기'}
          </button>
        )}
      </main>
    </>
  );
}
