import api from './api'

const quizService = {
  async submit(data) {
    const response = await api.post('/quiz/submit', data)
    return response.data
  },

  async getHistory() {
    const response = await api.get('/quiz/history')
    return response.data
  },

  async getResult(id) {
    const response = await api.get(`/quiz/${id}/results`)
    return response.data
  },
}

export default quizService
