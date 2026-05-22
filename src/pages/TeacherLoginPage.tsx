import axios from 'axios'
import { Loader2, LogIn } from 'lucide-react'
import { type ChangeEvent, type FormEvent, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Input from '../components/uis/Input'
import { useTeacherAuth } from '../context/TeacherAuthContext'
import { useTheme } from '../context/ThemeContext'
import type { LoginTeacherInput } from '../services/teacher'

const initialForm: LoginTeacherInput = {
  phoneNo: '',
  password: '',
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] }
    if (Array.isArray(data?.message)) return data.message.join(', ')
    if (typeof data?.message === 'string') return data.message
  }
  if (error instanceof Error) return error.message
  return 'Login failed. Please try again.'
}

export default function TeacherLoginPage() {
  const { theme } = useTheme()
  const { login, isAuthenticated } = useTeacherAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<LoginTeacherInput>(initialForm)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/teacher/dashboard" replace />
  }

  const mainClass =
    theme === 'dark'
      ? 'bg-slate-950 text-slate-100'
      : 'bg-slate-50 text-slate-900'

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white/80'

  const subtitleClass =
    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const primaryBtnClass =
    theme === 'dark'
      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
      : 'bg-amber-500 text-white hover:bg-amber-600'

  const handleChange =
    (field: keyof LoginTeacherInput) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!form.phoneNo.trim() || !form.password.trim()) {
      toast.error('Please enter phone number and password')
      return
    }

    setLoading(true)
    try {
      const teacher = await login({
        phoneNo: form.phoneNo.trim(),
        password: form.password,
      })
      toast.success(`Welcome back, ${teacher.name}`)
      navigate('/teacher/dashboard', { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center px-6 py-24 transition-colors ${mainClass}`}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border p-8 shadow-xl backdrop-blur transition-colors ${cardClass}`}
      >
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
            <LogIn size={24} />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-amber-500">
              Teacher
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            <p className={`mt-1 text-sm ${subtitleClass}`}>
              Sign in with the phone number and password provided by your admin.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Phone number"
            name="phoneNo"
            type="tel"
            value={form.phoneNo}
            onChange={handleChange('phoneNo')}
            placeholder="9876543210"
            disabled={loading}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            placeholder="Enter your password"
            disabled={loading}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${primaryBtnClass}`}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                <LogIn size={18} />
                Login
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  )
}
