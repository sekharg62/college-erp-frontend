import { apiClient } from './index'

const BASE = '/admins'

export type Admin = {
  id: string
  instituteId: string
  name: string
  phoneNo: string
  createdAt: string
  updatedAt: string
}

export type CreateAdminInput = {
  instituteId: string
  name: string
  phoneNo: string
  password: string
}

export type LoginAdminInput = {
  phoneNo: string
  password: string
}

export type LoginAdminResponse = {
  accessToken: string
  tokenType: string
  admin: Admin
}

export const createAdmin = (data: CreateAdminInput) =>
  apiClient.post<Admin>(BASE, data)

export const loginAdmin = (data: LoginAdminInput) =>
  apiClient.post<LoginAdminResponse>(`${BASE}/login`, data)
