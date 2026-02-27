'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import { Job, JOB_CATEGORIES } from '@/types';
import api from '@/lib/api';

function formatPay(pay: number) {
  return pay.toLocaleString('ko-KR') + '원';
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}(${['일','월','화','수','목','금','토'][d.getDay()]})`;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/jobs', { params: category ? { category } : {} })
      .then(({ data }) => setJobs(data))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-4">오늘의 알바</h1>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <button
            onClick={() => setCategory('')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium border transition ${
              category === '' ? 'bg-orange-500 text-white border-orange-500' : 'text-gray-600 border-gray-300'
            }`}
          >
            전체
          </button>
          {JOB_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                category === c ? 'bg-orange-500 text-white border-orange-500' : 'text-gray-600 border-gray-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* 공고 목록 */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">불러오는 중...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">등록된 공고가 없어요</p>
            <p className="text-sm">조건을 바꿔서 다시 찾아보세요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <Link
                key={job._id}
                href={`/jobs/${job._id}`}
                className="block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition border border-gray-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                    {job.category}
                  </span>
                  <span className="text-orange-500 font-bold">{formatPay(job.pay)}</span>
                </div>
                <h2 className="font-semibold text-gray-900 mb-1">{job.title}</h2>
                <div className="text-sm text-gray-500 flex gap-3">
                  <span>📅 {formatDate(job.date)} {job.startTime}~{job.endTime}</span>
                  <span>📍 {job.location.address.split(' ').slice(0, 2).join(' ')}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">{job.employerId?.name}</span>
                  <span className="text-xs text-gray-400">정원 {job.headcount}명</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
