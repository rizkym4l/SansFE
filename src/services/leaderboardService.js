import api from './api'

const leaderboardService = {
  async getLeaderboard() {
    const response = await api.get('/users/leaderboard')
    return response.data
  },
}

export default leaderboardService
