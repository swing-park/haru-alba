'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import { JOB_CATEGORIES, JobCategory } from '@/types';
import api from '@/lib/api';

export default function NewJobPage() {
  const router = useRouter();
  const [form, setForm] = useState<{
    title: string;
    description: string;
    category: JobCategory;
    address: string;
    date: string;
    startTime: string;
    endTime: string;
    pay: string;
    headcount: string;
  }>({
    title: '',
    description: '',
    category: JOB_CATEGORIES[0],
    address: '',
    date: '',
    startTime: '',
    endTime: '',
    pay: '',
    headcount: '1',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/jobs', {
        title: form.title,
        description: form.description,
        category: form.category,
        location: { address: form.address, lat: 0, lng: 0 },
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        pay: Number(form.pay),
        headcount: Number(form.headcount),
      });
      router.push('/employer/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || '공고 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, key: keyof typeof form, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        {...props}
      />
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-6">공고 등록</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          {field('공고 제목', 'title', { required: true, placeholder: '예: 카페 서빙 도우미 구합니다' })}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">업종</label>
            <select
              required
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as JobCategory })}
            >
              {JOB_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {field('근무지 주소', 'address', { required: true, placeholder: '예: 서울시 강남구 테헤란로 123' })}

          <div className="grid grid-cols-1 gap-4">
            {field('근무 날짜', 'date', { required: true, type: 'date' })}
            <div className="grid grid-cols-2 gap-3">
              {field('시작 시간', 'startTime', { required: true, type: 'time' })}
              {field('종료 시간', 'endTime', { required: true, type: 'time' })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {field('급여 (원)', 'pay', { required: true, type: 'number', min: '0', placeholder: '80000' })}
            {field('모집 인원', 'headcount', { required: true, type: 'number', min: '1', max: '100' })}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상세 내용</label>
            <textarea
              required
              rows={5}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              placeholder="업무 내용, 복장, 유의사항 등을 자세히 적어주세요"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? '등록 중...' : '공고 등록하기'}
          </button>
        </form>
      </main>
    </>
  );
}
