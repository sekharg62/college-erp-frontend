import {
  BookOpen,
  Building2,
  Clock,
  GraduationCap,
  Loader2,
  Phone,
  Shield,
  User,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import CopyBox from '../../components/uis/CopyBox'
import { useTheme } from '../../context/ThemeContext'
import {
  getTeacherDashboard,
  type TeacherDashboardTeacher,
} from '../../services/teacher'
import { getErrorMessage } from '../../utils/getErrorMessage'

const yearLinks = [
  { to: '/teacher/dashboard/1st-year', label: '1st Year' },
  { to: '/teacher/dashboard/2nd-year', label: '2nd Year' },
  { to: '/teacher/dashboard/3rd-year', label: '3rd Year' },
  { to: '/teacher/dashboard/4th-year', label: '4th Year' },
] as const

export default function TeacherDashboardPage() {
  const { theme } = useTheme()
  const [teacher, setTeacher] = useState<TeacherDashboardTeacher | null>(null)
  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(() => new Date())

  const sectionCardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white'

  const cardTint = {
    cyan:
      theme === 'dark'
        ? 'border-cyan-500/25 bg-cyan-500/10'
        : 'border-cyan-100 bg-cyan-50',
    amber:
      theme === 'dark'
        ? 'border-amber-500/25 bg-amber-500/10'
        : 'border-amber-100 bg-amber-50',
    sky:
      theme === 'dark'
        ? 'border-sky-500/25 bg-sky-500/10'
        : 'border-sky-100 bg-sky-50',
    emerald:
      theme === 'dark'
        ? 'border-emerald-500/25 bg-emerald-500/10'
        : 'border-emerald-100 bg-emerald-50',
    violet:
      theme === 'dark'
        ? 'border-violet-500/25 bg-violet-500/10'
        : 'border-violet-100 bg-violet-50',
    rose:
      theme === 'dark'
        ? 'border-rose-500/25 bg-rose-500/10'
        : 'border-rose-100 bg-rose-50',
  } as const

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const linkClass =
    theme === 'dark'
      ? 'border-slate-700 bg-slate-800/50 text-slate-200 hover:border-amber-500/40 hover:bg-amber-500/10'
      : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-amber-500/40 hover:bg-amber-500/10'

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const data = await getTeacherDashboard()
        if (!cancelled) setTeacher(data.teacher)
      } catch (error) {
        if (!cancelled) {
          toast.error(getErrorMessage(error, 'Failed to load dashboard'))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()

    return () => {
      cancelled = true
    }
  }, [])

  const profileCards = teacher
    ? [
        {
          label: 'Name',
          value: teacher.name,
          icon: User,
          accent: 'text-amber-500',
          bgClass: cardTint.amber,
          copy: false,
        },
        {
          label: 'Phone',
          value: teacher.phoneNo,
          icon: Phone,
          accent: 'text-sky-500',
          bgClass: cardTint.sky,
          copy: true,
          maxLength: 14,
        },
        {
          label: 'Institute',
          value: teacher.institute?.name ?? '—',
          icon: Building2,
          accent: 'text-emerald-500',
          bgClass: cardTint.emerald,
          copy: false,
        },
        {
          label: 'Department',
          value: teacher.department?.name ?? '—',
          icon: GraduationCap,
          accent: 'text-violet-500',
          bgClass: cardTint.violet,
          copy: false,
        },
        {
          label: 'Admin',
          value: teacher.admin?.name ?? '—',
          icon: Shield,
          accent: 'text-rose-500',
          bgClass: cardTint.rose,
          copy: false,
        },
      ]
    : []

  const currentDateShort = now.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const currentTime = now.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
        <p className={`mt-1 text-sm ${mutedClass}`}>
          {teacher
            ? `Welcome back, ${teacher.name}.`
            : 'Overview of your teacher account.'}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          className={`rounded-md border p-5 shadow-sm transition-colors ${cardTint.cyan}`}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className={`text-sm font-medium ${mutedClass}`}>Date & time</span>
            <Clock size={20} className="text-cyan-500" />
          </div>
          <p className="truncate text-lg font-semibold leading-snug tabular-nums">
            <span className={mutedClass}>{currentDateShort}</span>
            <span className="mx-1.5 font-normal text-slate-300 dark:text-slate-600">
              ·
            </span>
            <span className="text-cyan-600 dark:text-cyan-400">{currentTime}</span>
          </p>
        </div>

        {loading ? (
          <div
            className={`flex items-center justify-center gap-2 rounded-md border p-5 shadow-sm sm:col-span-1 lg:col-span-2 ${cardTint.amber} ${mutedClass}`}
          >
            <Loader2 size={22} className="animate-spin text-amber-500" />
            Loading profile…
          </div>
        ) : (
          profileCards.map(({ label, value, icon: Icon, accent, bgClass, copy, maxLength }) => (
            <div
              key={label}
              className={`rounded-md border p-5 shadow-sm transition-colors ${bgClass}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className={`text-sm font-medium ${mutedClass}`}>{label}</span>
                <Icon size={20} className={accent} />
              </div>
              {copy && value !== '—' ? (
                <CopyBox value={value} maxLength={maxLength ?? 14} className="text-lg" />
              ) : (
                <p className="text-lg font-semibold leading-snug">{value}</p>
              )}
            </div>
          ))
        )}
      </div>

      <div className={`mt-6 rounded-md border p-6 shadow-sm ${sectionCardClass}`}>
        <h2 className="text-lg font-semibold">MAAR by year</h2>
        <p className={`mt-1 text-sm ${mutedClass}`}>
          Open a program year to review submissions in detail.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {yearLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 rounded-md border px-4 py-3 text-sm font-semibold transition-colors ${linkClass}`}
            >
              <BookOpen size={18} className="shrink-0 text-amber-500" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
