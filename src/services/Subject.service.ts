import { apiClient } from './index'

const BASE = '/subjects'

export type Subject = {
  id: string
  departmentId: string
  semesterId: string
  name: string
  slug: string
  subjectCode: string
  createdAt: string
  updatedAt: string
}

export type CreateSubjectInput = {
  departmentId: string
  semesterId: string
  name: string
  slug: string
  subjectCode: string
}

export type UpdateSubjectInput = CreateSubjectInput

export type PatchSubjectInput = Partial<CreateSubjectInput>

export type GetSubjectsParams = {
  departmentId: string
  semesterId?: string
}

export const createSubject = (data: CreateSubjectInput) =>
  apiClient.post<Subject>(BASE, data)

export const getSubjects = (params: GetSubjectsParams) =>
  apiClient.get<Subject[]>(BASE, { params })

export const getSubject = (id: string) =>
  apiClient.get<Subject>(`${BASE}/${id}`)

export const updateSubject = (id: string, data: UpdateSubjectInput) =>
  apiClient.put<Subject>(`${BASE}/${id}`, data)

export const patchSubject = (id: string, data: PatchSubjectInput) =>
  apiClient.patch<Subject>(`${BASE}/${id}`, data)

export const deleteSubject = (id: string) =>
  apiClient.delete<Subject>(`${BASE}/${id}`)
