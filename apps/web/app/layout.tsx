import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import RecoilProvider from './RecoilProvider';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '하루알바 - 퇴근길에 10만원 벌고 가기',
  description: '이력서 없이, 면접 없이, 지원 즉시 확정되는 초단기 부수입 플랫폼',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={geist.className}>
        <RecoilProvider>{children}</RecoilProvider>
      </body>
    </html>
  );
}
