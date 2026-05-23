import axios, { type AxiosRequestConfig } from 'axios'
import { AUTH_STORAGE_KEYS } from '../constants/authStorage'

const baseURL = `${import.meta.env.VITE_API_URL}/api`

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_STORAGE_KEYS.accessToken)
  const tokenType = localStorage.getItem(AUTH_STORAGE_KEYS.tokenType) ?? 'Bearer'
  if (token) {
    config.headers.Authorization = `${tokenType} ${token}`
  }
  return config
})

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

/** Single API client — uses shared accessToken / tokenType from localStorage */
export const apiClient = createClient(axiosInstance)

export default apiClient
