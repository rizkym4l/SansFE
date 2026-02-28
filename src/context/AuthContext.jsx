import { create } from "zustand";
import authService from "../services/authService";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  initialize: async () => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (!token || !savedUser) {
      set({ loading: false });
      return;
    }
    try {
      set({ user: JSON.parse(savedUser), loading: false });
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ user: null, loading: false });
    }
  },
  updateXP : async (xp) => {
     const data = await authService.updateXP(xp);
     localStorage.setItem("user", JSON.stringify(data.data));
     set({ user: data.data });
  },
  login: async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    set({ user: data.user });
    return data.user;
  },

  register: async (userData) => {
    const data = await authService.register(userData);
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    set({ user: data.user });
    
    return data.user;
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // ignore errors — cookie will expire anyway
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null });
  },

  setUser: (user) => set({ user }),

  verifyEmail: async (token) => {
    await authService.verifyEmail(token);
    const current = JSON.parse(localStorage.getItem("user") || "{}");
    const updated = { ...current, isVerified: true };
    localStorage.setItem("user", JSON.stringify(updated));
    set((state) => ({ user: { ...state.user, isVerified: true } }));
  },
}));

export default useAuthStore;
