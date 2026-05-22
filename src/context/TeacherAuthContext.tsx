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
  loginTeacher,
  type LoginTeacherInput,
  type Teacher,
} from '../services/teacher'

type TeacherAuthState = {
  accessToken: string
  tokenType: string
  teacher: Teacher
}

type TeacherAuthContextValue = {
  user: Teacher | null
  accessToken: string | null
  tokenType: string | null
  isAuthenticated: boolean
  login: (input: LoginTeacherInput) => Promise<Teacher>
  logout: () => void
}

const TeacherAuthContext = createContext<TeacherAuthContextValue | null>(null)

function loadStoredAuth(): TeacherAuthState | null {
  const accessToken = localStorage.getItem(STORAGE_KEYS.TEACHER_ACCESS_TOKEN)
  const tokenType = localStorage.getItem(STORAGE_KEYS.TEACHER_TOKEN_TYPE)
  const teacherRaw = localStorage.getItem(STORAGE_KEYS.TEACHER_USER)

  if (!accessToken || !tokenType || !teacherRaw) {
    return null
  }

  try {
    const teacher = JSON.parse(teacherRaw) as Teacher
    return { accessToken, tokenType, teacher }
  } catch {
    clearStoredAuth()
    return null
  }
}

function saveAuth(auth: TeacherAuthState) {
  localStorage.setItem(STORAGE_KEYS.TEACHER_ACCESS_TOKEN, auth.accessToken)
  localStorage.setItem(STORAGE_KEYS.TEACHER_TOKEN_TYPE, auth.tokenType)
  localStorage.setItem(STORAGE_KEYS.TEACHER_USER, JSON.stringify(auth.teacher))
}

function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEYS.TEACHER_ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.TEACHER_TOKEN_TYPE)
  localStorage.removeItem(STORAGE_KEYS.TEACHER_USER)
}

export function TeacherAuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<TeacherAuthState | null>(loadStoredAuth)

  const login = useCallback(async (input: LoginTeacherInput) => {
    const response = await loginTeacher(input)
    const nextAuth: TeacherAuthState = {
      accessToken: response.accessToken,
      tokenType: response.tokenType,
      teacher: response.teacher,
    }
    setAuth(nextAuth)
    saveAuth(nextAuth)
    return response.teacher
  }, [])

  const logout = useCallback(() => {
    setAuth(null)
    clearStoredAuth()
  }, [])

  const value = useMemo<TeacherAuthContextValue>(
    () => ({
      user: auth?.teacher ?? null,
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
