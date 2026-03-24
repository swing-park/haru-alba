'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { useThemeStore } from '@/store/theme';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, setUser } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="border-b bg-white dark:bg-slate-900 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-orange-500">
          하루알바
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <span className="text-gray-600 dark:text-slate-300">{user.name}님</span>
              {user.type === 'employer' ? (
                <Link href="/employer/jobs/new" className="bg-orange-500 text-white px-3 py-1.5 rounded-lg font-medium">
                  공고 등록
                </Link>
              ) : (
                <Link href="/worker/applications" className="text-gray-700 dark:text-slate-300 hover:text-orange-500">
                  내 지원현황
                </Link>
              )}
              <button onClick={handleLogout} className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 dark:text-slate-300 hover:text-orange-500">로그인</Link>
              <Link href="/signup" className="bg-orange-500 text-white px-3 py-1.5 rounded-lg font-medium">
                회원가입
              </Link>
            </>
          )}
          <button
            onClick={toggle}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            aria-label="테마 전환"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}
