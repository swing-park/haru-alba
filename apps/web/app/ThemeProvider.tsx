'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/theme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  // persist 하이드레이션 완료 후 초기 클래스 동기화
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return <>{children}</>;
}
