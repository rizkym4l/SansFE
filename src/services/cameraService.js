import api from './api'

// Camera challenge menggunakan quiz/submit endpoint dengan quizType: 'camera-challenge'
// Swagger SubmitDto: { lessonId, quizType: 'camera-challenge', answers: [], cameraChallenge: { word, mistakes[], averageConfidence } }
const cameraService = {
  async submitChallenge(data) {
    const response = await api.post('/quiz/submit', {
      lessonId: data.lessonId,
      quizType: 'camera-challenge',
      answers: data.answers || [],
      cameraChallenge: {
        word: data.word,
        mistakes: data.mistakes || [],
        averageConfidence: data.averageConfidence,
      },
    })
    return response.data
  },
}

export default cameraService
