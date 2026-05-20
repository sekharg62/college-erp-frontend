import { apiClient } from './index'

export type HealthResponse = {
  status: string
  database: 'up' | 'down'
  timestamp: string
}

export const getHealth = () => apiClient.get<HealthResponse>('/health')
