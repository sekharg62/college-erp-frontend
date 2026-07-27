import { apiClient } from './index'

const BASE = '/users'

export type AppUser = {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
  updatedAt: string
}

export type LoginUserInput = {
  email: string
  password: string
}

export type LoginUserResponse = {
  accessToken: string
  tokenType: string
  user: AppUser
}

export const loginUser = (data: LoginUserInput) =>
  apiClient.post<LoginUserResponse>(`${BASE}/login`, data)
