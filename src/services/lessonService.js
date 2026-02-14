import api from "./api";

const lessonService = {
  async getAll() {
    const response = await api.get("/lessons");
    return response.data;
  },

  async getLessonById(id) {
    const response = await api.get(`/lessons/${id}`);
    return response.data;
  },

  async getLessonsByLevel(levelId) {
    const response = await api.get(`/lessons/level/${levelId}`);
    return response.data;
  },

  async getLessonsByType(type) {
    const response = await api.get(`/lessons/type/${type}`);
    return response.data;
  },

  async completeLesson(id) {
    const response = await api.patch(`/lessons/${id}/complete`);
    return response.data;
  },
};

export default lessonService;
