import axios, { type AxiosRequestConfig } from 'axios'
import { STORAGE_KEYS } from '../constants'

const baseURL = `${import.meta.env.VITE_API_URL}/api`

function attachAuthInterceptor(
  instance: ReturnType<typeof axios.create>,
  getToken: () => string | null,
  getTokenType: () => string,
) {
  instance.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `${getTokenType()} ${token}`
    }
    return config
  })
}

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

attachAuthInterceptor(
  axiosInstance,
  () => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  () => localStorage.getItem(STORAGE_KEYS.TOKEN_TYPE) ?? 'Bearer',
)

const teacherAxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

attachAuthInterceptor(
  teacherAxiosInstance,
  () => localStorage.getItem(STORAGE_KEYS.TEACHER_ACCESS_TOKEN),
  () => localStorage.getItem(STORAGE_KEYS.TEACHER_TOKEN_TYPE) ?? 'Bearer',
)

const studentAxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

attachAuthInterceptor(
  studentAxiosInstance,
  () => localStorage.getItem(STORAGE_KEYS.STUDENT_ACCESS_TOKEN),
  () => localStorage.getItem(STORAGE_KEYS.STUDENT_TOKEN_TYPE) ?? 'Bearer',
)

function createClient(instance: ReturnType<typeof axios.create>) {
  return {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
      instance.get<T>(url, config).then((res) => res.data),

    post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      instance.post<T>(url, data, config).then((res) => res.data),

    put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      instance.put<T>(url, data, config).then((res) => res.data),

    patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      instance.patch<T>(url, data, config).then((res) => res.data),

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
      instance.delete<T>(url, config).then((res) => res.data),
  }
}

export const apiClient = createClient(axiosInstance)
export const teacherApiClient = createClient(teacherAxiosInstance)
export const studentApiClient = createClient(studentAxiosInstance)

export default apiClient
