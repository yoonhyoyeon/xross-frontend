import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("xross_access_token"),

  setAccessToken: (token) => {
    localStorage.setItem("xross_access_token", token);
    set({ accessToken: token });
  },

  clearAuth: () => {
    localStorage.removeItem("xross_access_token");
    set({ accessToken: null });
  },
}));
