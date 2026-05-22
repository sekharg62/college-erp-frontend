import { apiClient } from './index'

const BASE = '/departments'

export type Department = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export type CreateDepartmentInput = {
  name: string
}

export type UpdateDepartmentInput = CreateDepartmentInput

export type PatchDepartmentInput = Partial<CreateDepartmentInput>

export const createDepartment = (data: CreateDepartmentInput) =>
  apiClient.post<Department>(BASE, data)

export const getDepartments = () => apiClient.get<Department[]>(BASE)

export const getDepartment = (id: string) =>
  apiClient.get<Department>(`${BASE}/${id}`)

export const updateDepartment = (id: string, data: UpdateDepartmentInput) =>
  apiClient.put<Department>(`${BASE}/${id}`, data)

export const patchDepartment = (id: string, data: PatchDepartmentInput) =>
  apiClient.patch<Department>(`${BASE}/${id}`, data)

export const deleteDepartment = (id: string) =>
  apiClient.delete<Department>(`${BASE}/${id}`)
