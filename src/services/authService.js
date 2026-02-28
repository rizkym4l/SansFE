import api from "./api";

const authService = {
  async register(data) {
    const response = await api.post("/auth/register", data);
    return response.data.data;
  },

  async login(data) {
    const response = await api.post("/auth/login", data);
    return response.data.data;
  },
  async updateXP(xp) {
    const response = await api.put("/users/xp", { xp });
    return response.data;
  },
  async getProfile() {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  async resetPassword(token, newPassword) {
    const response = await api.post("/auth/reset-password", { token, newPassword });
    return response.data;
  },

  async verifyEmail(token) {
    const response = await api.post("/auth/verify-email", { token });
    return response.data;
  },

  async refreshToken() {
    const response = await api.post("/auth/refresh-token", {}, { withCredentials: true });
    return response.data.data.access_token;
  },

  async logout() {
    await api.post("/auth/logout");
  },
};

export default authService;
