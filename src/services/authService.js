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
};

export default authService;
