export const API_BASE_URL = import.meta.env.VITE_API_URL || ''

export const SIGN_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export const DIFFICULTY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
}

export const LESSON_TYPE = {
  LEARNING: 'learning',
  PRACTICE: 'practice',
  QUIZ: 'quiz',
  CAMERA_CHALLENGE: 'camera-challenge',
}

export const PROGRESS_STATUS = {
  LOCKED: 'locked',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
}

export const ACHIEVEMENT_RARITY = {
  COMMON: 'common',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
}

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  LEVELS: '/levels',
  LESSON: '/lesson/:id',
  CAMERA_CHALLENGE: '/camera-challenge',
  PROFILE: '/profile',
  SETTINGS: '/settings',
}
