import { apiClient } from './index'

const BASE = '/institutes'

export type Institute = {
  id: string
  name: string
  instituteCode: string
  location: string
  contactDetails: string
  createdAt: string
  updatedAt: string
}

export type CreateInstituteInput = {
  name: string
  instituteCode: string
  location: string
  contactDetails: string
}

export type UpdateInstituteInput = CreateInstituteInput

export type PatchInstituteInput = Partial<CreateInstituteInput>

export const createInstitute = (data: CreateInstituteInput) =>
  apiClient.post<Institute>(BASE, data)

export const updateInstitute = (id: string, data: UpdateInstituteInput) =>
  apiClient.put<Institute>(`${BASE}/${id}`, data)

export const patchInstitute = (id: string, data: PatchInstituteInput) =>
  apiClient.patch<Institute>(`${BASE}/${id}`, data)

export const deleteInstitute = (id: string) =>
  apiClient.delete<Institute>(`${BASE}/${id}`)
