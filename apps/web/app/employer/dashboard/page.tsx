'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import { Job } from '@/types';
import api from '@/lib/api';

const STATUS_LABEL = { open: '모집중', closed: '마감', completed: '완료' } as const;
const STATUS_COLOR = { open: 'bg-green-100 text-green-700', closed: 'bg-gray-100 text-gray-600', completed: 'bg-blue-100 text-blue-700' } as const;

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs/my').then(({ data }) => setJobs(data)).finally(() => setLoading(false));
  }, []);

  const handleClose = async (id: string) => {
    await api.patch(`/jobs/${id}`, { status: 'closed' });
    setJobs((prev) => prev.map((j) => (j._id === id ? { ...j, status: 'closed' } : j)));
  };

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">내 공고 관리</h1>
          <Link href="/employer/jobs/new" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
            + 공고 등록
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">불러오는 중...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="mb-4">등록한 공고가 없습니다</p>
            <Link href="/employer/jobs/new" className="text-orange-500 font-medium">
              첫 공고 등록하기 →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[job.status]}`}>
                    {STATUS_LABEL[job.status]}
                  </span>
                  <span className="text-orange-500 font-bold">{job.pay.toLocaleString()}원</span>
                </div>
                <h2 className="font-semibold mb-1">{job.title}</h2>
                <p className="text-sm text-gray-500 mb-3">{job.location.address} · {job.startTime}~{job.endTime}</p>
                <div className="flex gap-2">
                  <Link
                    href={`/employer/jobs/${job._id}/applications`}
                    className="text-sm border border-orange-500 text-orange-500 px-3 py-1.5 rounded-lg hover:bg-orange-50"
                  >
                    지원자 보기
                  </Link>
                  {job.status === 'open' && (
                    <button
                      onClick={() => handleClose(job._id)}
                      className="text-sm border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                    >
                      마감하기
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
