'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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

export default function ApplicationsPage() {
  const { id } = useParams<{ id: string }>();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/jobs/${id}/applications`)
      .then(({ data }) => setApplications(data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleConfirm = async (appId: string) => {
    await api.patch(`/applications/${appId}/confirm`);
    setApplications((prev) =>
      prev.map((a) => (a._id === appId ? { ...a, status: 'confirmed' } : a))
    );
  };

  const handleComplete = async (appId: string) => {
    await api.patch(`/applications/${appId}/complete`);
    setApplications((prev) =>
      prev.map((a) => (a._id === appId ? { ...a, status: 'completed' } : a))
    );
  };

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Link href="/employer/dashboard" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
          ← 대시보드
        </Link>
        <h1 className="text-xl font-bold mb-6">지원자 목록</h1>

        {loading ? (
          <div className="text-center py-12 text-gray-500">불러오는 중...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">아직 지원자가 없습니다.</div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-semibold">{app.workerId.name}</span>
                    <span className="text-sm text-gray-500 ml-2">{app.workerId.phone}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    app.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    app.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {STATUS_LABEL[app.status]}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  신뢰도 {app.workerId.trustScore}점 · 출근율 {app.workerId.attendanceRate}%
                </div>
                <div className="flex gap-2">
                  {app.status === 'pending' && (
                    <button
                      onClick={() => handleConfirm(app._id)}
                      className="text-sm bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600"
                    >
                      확정하기
                    </button>
                  )}
                  {app.status === 'confirmed' && (
                    <button
                      onClick={() => handleComplete(app._id)}
                      className="text-sm bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600"
                    >
                      완료 처리
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
