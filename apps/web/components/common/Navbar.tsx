'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-orange-500">
          하루알바
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <span className="text-gray-600">{user.name}님</span>
              {user.type === 'employer' ? (
                <Link href="/employer/jobs/new" className="bg-orange-500 text-white px-3 py-1.5 rounded-lg font-medium">
                  공고 등록
                </Link>
              ) : (
                <Link href="/worker/applications" className="text-gray-700 hover:text-orange-500">
                  내 지원현황
                </Link>
              )}
              <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-orange-500">로그인</Link>
              <Link href="/signup" className="bg-orange-500 text-white px-3 py-1.5 rounded-lg font-medium">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
