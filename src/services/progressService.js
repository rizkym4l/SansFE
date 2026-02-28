import api from './api'

const progressService = {
  async getOverallProgress() {
    const response = await api.get('/progress')
    return response.data
  },

  async getStats() {
    const response = await api.get('/progress/stats')
    return response.data
  },

  async getLessonProgress(lessonId) {
    const response = await api.get(`/progress/lesson/${lessonId}`)
    return response.data
  },

  async startLesson(levelId, lessonId) {
    const response = await api.post('/progress/start', { levelId, lessonId })
    return response.data
  },

  async completeLesson(data) {
    const response = await api.post('/progress/complete', data)
    return response.data
  },

  async getPaginated(page = 1, limit = 5) {
    const response = await api.get(`/progress?page=${page}&limit=${limit}&status=completed`)
    return response.data
  },
}

export default progressService
