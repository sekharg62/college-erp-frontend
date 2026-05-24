import { apiClient } from '../index'

const BASE = '/students'

export type Student = {
  id: string
  teacherId: string
  adminId: string
  instituteId: string
  name: string
  rollNo: string
  admissionYear: string
  phoneNo: string | null
  signature?: string | null
  createdAt: string
  updatedAt: string
}

export type LoginStudentInput = {
  rollNo: string
  password: string
}

export type LoginStudentResponse = {
  accessToken: string
  tokenType: string
  student: Student
}

export type CreateStudentInput = {
  instituteId: string
  adminId: string
  name: string
  rollNo: string
  admissionYear: string
  password: string
  phoneNo: string
}

export const loginStudent = (data: LoginStudentInput) =>
  apiClient.post<LoginStudentResponse>(`${BASE}/login`, data)

export const createStudent = (data: CreateStudentInput) =>
  apiClient.post<Student>(BASE, data)

export const getStudents = () => apiClient.get<Student[]>(BASE)

export const getStudent = (id: string) => apiClient.get<Student>(`${BASE}/${id}`)

export type PatchStudentMeInput = Partial<{
  name: string
  phoneNo: string
  signature: string
}>

export const patchStudentMe = (data: PatchStudentMeInput) =>
  apiClient.patch<Student>(`${BASE}/me`, data)

export type UpdateStudentInput = {
  name: string
  rollNo: string
  admissionYear: string
  phoneNo: string
  password?: string
  signature: string
}

/** Full update — typically used by teachers (PUT /students/:id) */
export const updateStudent = (id: string, data: UpdateStudentInput) =>
  apiClient.put<Student>(`${BASE}/${id}`, data)
