import { create } from "zustand";

const useAuthStore = create((set) => ({
  accessToken: null,
  expiresAt: null, 

  setAuth: ({ accessToken, expiresIn }) => {
    const expiresAt = Date.now() + expiresIn * 1000;
    set({ accessToken, expiresAt });
  },

  clearAuth: () => set({ accessToken: null, expiresAt: null }),
}));

export default useAuthStore;