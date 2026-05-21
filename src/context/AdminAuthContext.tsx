import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { STORAGE_KEYS } from '../constants'
import {
  loginAdmin,
  type Admin,
  type LoginAdminInput,
} from '../services/Admin.service'

type AdminAuthState = {
  accessToken: string
  tokenType: string
  admin: Admin
}

type AdminAuthContextValue = {
  user: Admin | null
  accessToken: string | null
  tokenType: string | null
  isAuthenticated: boolean
  login: (input: LoginAdminInput) => Promise<Admin>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

function loadStoredAuth(): AdminAuthState | null {
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  const tokenType = localStorage.getItem(STORAGE_KEYS.TOKEN_TYPE)
  const adminRaw = localStorage.getItem(STORAGE_KEYS.ADMIN_USER)

  if (!accessToken || !tokenType || !adminRaw) {
    return null
  }

  try {
    const admin = JSON.parse(adminRaw) as Admin
    return { accessToken, tokenType, admin }
  } catch {
    clearStoredAuth()
    return null
  }
}

function saveAuth(auth: AdminAuthState) {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, auth.accessToken)
  localStorage.setItem(STORAGE_KEYS.TOKEN_TYPE, auth.tokenType)
  localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(auth.admin))
}

function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.TOKEN_TYPE)
  localStorage.removeItem(STORAGE_KEYS.ADMIN_USER)
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AdminAuthState | null>(loadStoredAuth)

  const login = useCallback(async (input: LoginAdminInput) => {
    const response = await loginAdmin(input)
    const nextAuth: AdminAuthState = {
      accessToken: response.accessToken,
      tokenType: response.tokenType,
      admin: response.admin,
    }
    setAuth(nextAuth)
    saveAuth(nextAuth)
    return response.admin
  }, [])

  const logout = useCallback(() => {
    setAuth(null)
    clearStoredAuth()
  }, [])

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      user: auth?.admin ?? null,
      accessToken: auth?.accessToken ?? null,
      tokenType: auth?.tokenType ?? null,
      isAuthenticated: Boolean(auth),
      login,
      logout,
    }),
    [auth, login, logout],
  )

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}
