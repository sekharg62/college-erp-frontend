import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  loginAdmin,
  type Admin,
  type LoginAdminInput,
} from '../services/Admin.service'
import {
  clearAuthSession,
  loadAuthSession,
  saveAuthSession,
  type AuthSession,
  type StoredUser,
} from '../utils/authStorage'

export type AdminUser = StoredUser<Admin>

type AdminAuthContextValue = {
  user: AdminUser | null
  accessToken: string | null
  tokenType: string | null
  isAuthenticated: boolean
  login: (input: LoginAdminInput) => Promise<AdminUser>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthSession<AdminUser> | null>(() =>
    loadAuthSession<AdminUser>('ADMIN'),
  )

  const login = useCallback(async (input: LoginAdminInput) => {
    const response = await loginAdmin(input)
    const nextAuth: AuthSession<AdminUser> = {
      accessToken: response.accessToken,
      tokenType: response.tokenType,
      user: { ...response.admin, role: 'ADMIN' },
    }
    setAuth(nextAuth)
    saveAuthSession(nextAuth)
    return nextAuth.user
  }, [])

  const logout = useCallback(() => {
    setAuth(null)
    clearAuthSession()
  }, [])

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      user: auth?.user ?? null,
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
