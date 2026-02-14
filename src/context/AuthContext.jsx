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

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null });
  },

  setUser: (user) => set({ user }),
}));

export default useAuthStore;
