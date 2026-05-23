export const AUTH_STORAGE_KEYS = {
  accessToken: 'accessToken',
  tokenType: 'tokenType',
  user: 'user',
} as const

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT'
