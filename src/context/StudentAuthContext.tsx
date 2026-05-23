import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  loginStudent,
  type LoginStudentInput,
  type Student,
} from '../services/student'
import {
  clearAuthSession,
  loadAuthSession,
  saveAuthSession,
  type AuthSession,
  type StoredUser,
} from '../utils/authStorage'

export type StudentUser = StoredUser<Student>

type StudentAuthContextValue = {
  user: StudentUser | null
  accessToken: string | null
  tokenType: string | null
  isAuthenticated: boolean
  login: (input: LoginStudentInput) => Promise<StudentUser>
  logout: () => void
}

const StudentAuthContext = createContext<StudentAuthContextValue | null>(null)

export function StudentAuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthSession<StudentUser> | null>(() =>
    loadAuthSession<StudentUser>('STUDENT'),
  )

  const login = useCallback(async (input: LoginStudentInput) => {
    const response = await loginStudent(input)
    const nextAuth: AuthSession<StudentUser> = {
      accessToken: response.accessToken,
      tokenType: response.tokenType,
      user: { ...response.student, role: 'STUDENT' },
    }
    setAuth(nextAuth)
    saveAuthSession(nextAuth)
    return nextAuth.user
  }, [])

  const logout = useCallback(() => {
    setAuth(null)
    clearAuthSession()
  }, [])

  const value = useMemo<StudentAuthContextValue>(
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
    <StudentAuthContext.Provider value={value}>
      {children}
    </StudentAuthContext.Provider>
  )
}

export function useStudentAuth() {
  const context = useContext(StudentAuthContext)
  if (!context) {
    throw new Error('useStudentAuth must be used within StudentAuthProvider')
  }
  return context
}
