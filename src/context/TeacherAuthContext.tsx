import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  loginTeacher,
  type LoginTeacherInput,
  type Teacher,
} from '../services/teacher'
import {
  clearAuthSession,
  loadAuthSession,
  saveAuthSession,
  type AuthSession,
  type StoredUser,
} from '../utils/authStorage'

export type TeacherUser = StoredUser<Teacher>

type TeacherAuthContextValue = {
  user: TeacherUser | null
  accessToken: string | null
  tokenType: string | null
  isAuthenticated: boolean
  login: (input: LoginTeacherInput) => Promise<TeacherUser>
  logout: () => void
}

const TeacherAuthContext = createContext<TeacherAuthContextValue | null>(null)

export function TeacherAuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthSession<TeacherUser> | null>(() =>
    loadAuthSession<TeacherUser>('TEACHER'),
  )

  const login = useCallback(async (input: LoginTeacherInput) => {
    const response = await loginTeacher(input)
    const nextAuth: AuthSession<TeacherUser> = {
      accessToken: response.accessToken,
      tokenType: response.tokenType,
      user: { ...response.teacher, role: 'TEACHER' },
    }
    setAuth(nextAuth)
    saveAuthSession(nextAuth)
    return nextAuth.user
  }, [])

  const logout = useCallback(() => {
    setAuth(null)
    clearAuthSession()
  }, [])

  const value = useMemo<TeacherAuthContextValue>(
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
    <TeacherAuthContext.Provider value={value}>
      {children}
    </TeacherAuthContext.Provider>
  )
}

export function useTeacherAuth() {
  const context = useContext(TeacherAuthContext)
  if (!context) {
    throw new Error('useTeacherAuth must be used within TeacherAuthProvider')
  }
  return context
}
