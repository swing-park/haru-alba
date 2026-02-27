'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import api from '@/lib/api';

export default function AuthInitializer() {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    api.get('/users/me').then(({ data }) => setUser(data)).catch(() => localStorage.removeItem('token'));
  }, [setUser]);

  return null;
}
