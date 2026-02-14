import api from "./api";

const userService = {
  // GET /api/auth/profile — get current logged-in user
  async getProfile() {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  // PUT /api/users/profile — update displayName, bio
  async updateProfile(data) {
    const response = await api.put("/users/profile", data);
    return response.data;
  },

  // DELETE /api/users/profile — delete account
  async deleteAccount() {
    const response = await api.delete("/users/profile");
    return response.data;
  },

  async getLeaderboard() {
    const response = await api.get("/users/leaderboard");
    // console.log('response', response)
    return response.data.data;
  },

  // GET /api/daily-activity/today
  async getDailyActivity() {
    const response = await api.get("/daily-activity/today");
    return response.data;
  },

  // GET /api/daily-activity/history?days=30
  async getDailyHistory(days = 30) {
    const response = await api.get(`/daily-activity/history?days=${days}`);
    return response.data;
  },

  // GET /api/daily-activity/streak
  async getStreak() {
    const response = await api.get("/daily-activity/streak");
    return response.data;
  },
};

export default userService;
