import { apiClient } from './index'

const BASE = '/semesters'

export type Semester = {
  id: string
  departmentId: string
  number: number
  label: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type CreateSemesterInput = {
  departmentId: string
  number: number
  label: string
  sortOrder: number
}

export type UpdateSemesterInput = CreateSemesterInput

export type PatchSemesterInput = Partial<CreateSemesterInput>

export const createSemester = (data: CreateSemesterInput) =>
  apiClient.post<Semester>(BASE, data)

export const getSemestersByDepartment = (departmentId: string) =>
  apiClient.get<Semester[]>(BASE, { params: { departmentId } })

export const getSemester = (id: string) =>
  apiClient.get<Semester>(`${BASE}/${id}`)

export const updateSemester = (id: string, data: UpdateSemesterInput) =>
  apiClient.put<Semester>(`${BASE}/${id}`, data)

export const patchSemester = (id: string, data: PatchSemesterInput) =>
  apiClient.patch<Semester>(`${BASE}/${id}`, data)

export const deleteSemester = (id: string) =>
  apiClient.delete<Semester>(`${BASE}/${id}`)
