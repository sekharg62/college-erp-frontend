import { apiClient } from '../index'

const BASE = '/teachers'

export type Teacher = {
  id: string
  instituteId: string
  adminId: string
  departmentId: string
  name: string
  phoneNo: string
  createdAt: string
  updatedAt: string
}

export type LoginTeacherInput = {
  phoneNo: string
  password: string
}

export type LoginTeacherResponse = {
  accessToken: string
  tokenType: string
  teacher: Teacher
}

export type CreateTeacherInput = {
  instituteId: string
  adminId: string
  departmentId: string
  name: string
  phoneNo: string
  password: string
}

export type UpdateTeacherInput = {
  departmentId: string
  name: string
  phoneNo: string
  password: string
}

export type PatchTeacherInput = Partial<{
  departmentId: string
  name: string
  phoneNo: string
  password: string
}>

export const loginTeacher = (data: LoginTeacherInput) =>
  apiClient.post<LoginTeacherResponse>(`${BASE}/login`, data)

export const createTeacher = (data: CreateTeacherInput) =>
  apiClient.post<Teacher>(BASE, data)

export const getTeachers = (adminId: string) =>
  apiClient.get<Teacher[]>(BASE, { params: { adminId } })

export const getTeacher = (id: string) =>
  apiClient.get<Teacher>(`${BASE}/${id}`)

export const updateTeacher = (id: string, data: UpdateTeacherInput) =>
  apiClient.put<Teacher>(`${BASE}/${id}`, data)

export const patchTeacher = (id: string, data: PatchTeacherInput) =>
  apiClient.patch<Teacher>(`${BASE}/${id}`, data)

export const deleteTeacher = (id: string) =>
  apiClient.delete<Teacher>(`${BASE}/${id}`)

export type TeacherDashboardEntity = {
  id: string
  name: string
}

export type TeacherDashboardTeacher = {
  id: string
  name: string
  phoneNo: string
  instituteId: string
  adminId: string
  institute: TeacherDashboardEntity
  admin: TeacherDashboardEntity
  department: TeacherDashboardEntity
}

export type TeacherDashboardResponse = {
  teacher: TeacherDashboardTeacher
}

export const getTeacherDashboard = () =>
  apiClient.get<TeacherDashboardResponse>(`${BASE}/dashboard`)
