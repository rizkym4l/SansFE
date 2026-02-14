import api from './api'

const achievementService = {
  async getAll() {
    const response = await api.get('/achievements')
    return response.data
  },

  async getUserAchievements() {
    const response = await api.get('/achievements/user')
    return response.data
  },

  async check(eventType, value) {
    const response = await api.post('/achievements/check', { eventType, value })
    return response.data
  },
}

export default achievementService
