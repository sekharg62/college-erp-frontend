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
  loginStudent,
  type LoginStudentInput,
  type Student,
} from '../services/student'

type StudentAuthState = {
  accessToken: string
  tokenType: string
  student: Student
}

type StudentAuthContextValue = {
  user: Student | null
  accessToken: string | null
  tokenType: string | null
  isAuthenticated: boolean
  login: (input: LoginStudentInput) => Promise<Student>
  logout: () => void
}

const StudentAuthContext = createContext<StudentAuthContextValue | null>(null)

function loadStoredAuth(): StudentAuthState | null {
  const accessToken = localStorage.getItem(STORAGE_KEYS.STUDENT_ACCESS_TOKEN)
  const tokenType = localStorage.getItem(STORAGE_KEYS.STUDENT_TOKEN_TYPE)
  const studentRaw = localStorage.getItem(STORAGE_KEYS.STUDENT_USER)

  if (!accessToken || !tokenType || !studentRaw) {
    return null
  }

  try {
    const student = JSON.parse(studentRaw) as Student
    return { accessToken, tokenType, student }
  } catch {
    clearStoredAuth()
    return null
  }
}

function saveAuth(auth: StudentAuthState) {
  localStorage.setItem(STORAGE_KEYS.STUDENT_ACCESS_TOKEN, auth.accessToken)
  localStorage.setItem(STORAGE_KEYS.STUDENT_TOKEN_TYPE, auth.tokenType)
  localStorage.setItem(STORAGE_KEYS.STUDENT_USER, JSON.stringify(auth.student))
}

function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEYS.STUDENT_ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.STUDENT_TOKEN_TYPE)
  localStorage.removeItem(STORAGE_KEYS.STUDENT_USER)
}

export function StudentAuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StudentAuthState | null>(loadStoredAuth)

  const login = useCallback(async (input: LoginStudentInput) => {
    const response = await loginStudent(input)
    const nextAuth: StudentAuthState = {
      accessToken: response.accessToken,
      tokenType: response.tokenType,
      student: response.student,
    }
    setAuth(nextAuth)
    saveAuth(nextAuth)
    return response.student
  }, [])

  const logout = useCallback(() => {
    setAuth(null)
    clearStoredAuth()
  }, [])

  const value = useMemo<StudentAuthContextValue>(
    () => ({
      user: auth?.student ?? null,
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
