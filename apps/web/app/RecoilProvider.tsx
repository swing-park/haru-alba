'use client';

import AuthInitializer from './AuthInitializer';

export default function RecoilProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthInitializer />
      {children}
    </>
  );
}
