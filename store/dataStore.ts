import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// تعریف نوع داده‌های کاربر
interface UserData {
  id: string | null;
  name: string | null;
  email: string | null;
  location: string | null;
  role: string | null;
}

interface DataState {
  user: UserData;
  setUser: (user: UserData) => void;
  clearUser: () => void;
  updateUser: (updates: Partial<UserData>) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      user: {
        id: null,
        name: null,
        email: null,
        location: null,
        role: null,
      },
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: { id: null, name: null, email: null, location: null, role: null } }),
      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),
    }),
    {
      name: 'user-data-storage', // نام برای ذخیره در localStorage
      storage: createJSONStorage(() => localStorage), // ذخیره در localStorage
    }
  )
);