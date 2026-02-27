'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import { Application } from '@/types';
import api from '@/lib/api';

const STATUS_LABEL = {
  pending: '대기중',
  confirmed: '확정됨',
  completed: '완료',
  cancelled: '취소',
  noshow: '노쇼',
} as const;

const STATUS_COLOR = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-gray-100 text-gray-600',
  noshow: 'bg-red-100 text-red-600',
} as const;

export default function WorkerApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/me').then(({ data }) => setApplications(data)).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: string) => {
    await api.patch(`/applications/${id}/cancel`);
    setApplications((prev) => prev.map((a) => (a._id === id ? { ...a, status: 'cancelled' } : a)));
  };

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-6">내 지원 현황</h1>

        {loading ? (
          <div className="text-center py-12 text-gray-500">불러오는 중...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="mb-4">아직 지원한 공고가 없습니다</p>
            <Link href="/jobs" className="text-orange-500 font-medium">알바 찾으러 가기 →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-semibold">{app.jobId.title}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[app.status]}`}>
                    {STATUS_LABEL[app.status]}
                  </span>
                </div>
                <div className="text-sm text-gray-500 space-y-1 mb-3">
                  <p>📍 {app.jobId.location.address}</p>
                  <p>💰 {app.jobId.pay.toLocaleString()}원 · {app.jobId.startTime}~{app.jobId.endTime}</p>
                  <p>🏢 {app.jobId.employerId?.name}</p>
                </div>
                {app.status === 'confirmed' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-sm text-green-700 mb-2">
                    ✅ 확정되었습니다! 약속 시간에 맞춰 출근해주세요.
                  </div>
                )}
                {app.status === 'pending' && (
                  <button
                    onClick={() => handleCancel(app._id)}
                    className="text-sm border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                  >
                    지원 취소
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
