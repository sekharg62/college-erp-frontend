import { apiClient, teacherApiClient } from '../index'

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
  teacherApiClient.post<Student>(BASE, data)

export const getStudents = () => teacherApiClient.get<Student[]>(BASE)
