import { create } from 'zustand';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  type: 'employer' | 'worker';
  trustScore: number;
  attendanceRate: number;
}

interface AuthStore {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
