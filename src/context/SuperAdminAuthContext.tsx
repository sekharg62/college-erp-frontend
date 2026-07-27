import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  loginUser,
  type AppUser,
  type LoginUserInput,
} from '../services/User.service'
import {
  clearAuthSession,
  loadAuthSession,
  saveAuthSession,
  type AuthSession,
  type StoredUser,
} from '../utils/authStorage'

export type SuperAdminUser = StoredUser<AppUser>

type SuperAdminAuthContextValue = {
  user: SuperAdminUser | null
  accessToken: string | null
  tokenType: string | null
  isAuthenticated: boolean
  login: (input: LoginUserInput) => Promise<SuperAdminUser>
  logout: () => void
}

const SuperAdminAuthContext = createContext<SuperAdminAuthContextValue | null>(
  null,
)

export function SuperAdminAuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthSession<SuperAdminUser> | null>(() =>
    loadAuthSession<SuperAdminUser>('SUPER_ADMIN'),
  )

  const login = useCallback(async (input: LoginUserInput) => {
    const response = await loginUser(input)
    const nextAuth: AuthSession<SuperAdminUser> = {
      accessToken: response.accessToken,
      tokenType: response.tokenType,
      user: { ...response.user, role: 'SUPER_ADMIN' },
    }
    setAuth(nextAuth)
    saveAuthSession(nextAuth)
    return nextAuth.user
  }, [])

  const logout = useCallback(() => {
    setAuth(null)
    clearAuthSession()
  }, [])

  const value = useMemo<SuperAdminAuthContextValue>(
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
    <SuperAdminAuthContext.Provider value={value}>
      {children}
    </SuperAdminAuthContext.Provider>
  )
}

export function useSuperAdminAuth() {
  const context = useContext(SuperAdminAuthContext)
  if (!context) {
    throw new Error('useSuperAdminAuth must be used within SuperAdminAuthProvider')
  }
  return context
}
