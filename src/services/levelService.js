import api from './api'

const levelService = {
  async getAllLevels() {
    const response = await api.get('/levels')
    return response.data
  },

  async getLevelById(id) {
    const response = await api.get(`/levels/${id}`)
    return response.data
  },

  async getLevelByNumber(levelNumber) {
    const response = await api.get(`/levels/number/${levelNumber}`)
    return response.data
  },
}

export default levelService
