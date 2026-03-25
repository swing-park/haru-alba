import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import RecoilProvider from './RecoilProvider';
import ThemeProvider from './ThemeProvider';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '하루알바 - 퇴근길에 10만원 벌고 가기',
  description: '이력서 없이, 면접 없이, 지원 즉시 확정되는 초단기 부수입 플랫폼',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=sessionStorage.getItem('theme');var theme=t?JSON.parse(t).state?.theme:'light';if(theme==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className={geist.className}>
        <ThemeProvider>
          <RecoilProvider>{children}</RecoilProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
