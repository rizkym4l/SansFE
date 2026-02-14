import { create } from "zustand";

const PracticeContext = create((set) => ({
  answerIndicates: {},
  timeSpents: {},

  setAnswer: (index, answer) => {
    set((state) => ({
      answerIndicates: { ...state.answerIndicates, [index]: answer },
    }));
  },

  setTimeSpent: (index, seconds) => {
    set((state) => ({
      timeSpents: { ...state.timeSpents, [index]: seconds },
    }));
  },

  resetAnswer: () => set({ answerIndicates: {}, timeSpents: {} }),
}));

export default PracticeContext;
