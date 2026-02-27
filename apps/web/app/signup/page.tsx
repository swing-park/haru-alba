'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import api from '@/lib/api';

function SignupForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    type: (searchParams.get('type') as 'employer' | 'worker') || 'worker',
    name: '',
    phone: '',
    email: '',
    password: '',
    bizNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = form.type === 'employer' ? form : { ...form, bizNumber: undefined };
      const { data } = await api.post('/auth/signup', payload);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      router.push(data.user.type === 'employer' ? '/employer/dashboard' : '/jobs');
    } catch (err: any) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <Link href="/" className="text-2xl font-bold text-orange-500 block mb-8">하루알바</Link>
        <h1 className="text-xl font-bold mb-6">회원가입</h1>

        <div className="flex rounded-lg border overflow-hidden mb-6">
          {(['worker', 'employer'] as const).map((t) => (
            <button key={t} type="button" onClick={() => setForm({ ...form, type: t })}
              className={`flex-1 py-2.5 text-sm font-medium transition ${form.type === t ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
              {t === 'worker' ? '구직자 (알바)' : '구인자 (사업자)'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input required className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
            <input required placeholder="010-0000-0000" className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input type="email" required className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input type="password" required minLength={8} placeholder="8자 이상" className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          {form.type === 'employer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">사업자등록번호</label>
              <input placeholder="000-00-00000" className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.bizNumber} onChange={(e) => setForm({ ...form, bizNumber: e.target.value })} />
            </div>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition disabled:opacity-50">
            {loading ? '처리 중...' : '회원가입'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-orange-500 font-medium">로그인</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <SignupForm />
    </Suspense>
  );
}
