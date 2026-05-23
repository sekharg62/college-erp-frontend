import { Building2, BookOpen, GraduationCap, Phone, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTeacherAuth } from '../../context/TeacherAuthContext'
import { useTheme } from '../../context/ThemeContext'

const yearLinks = [
  { to: '/teacher/dashboard/1st-year', label: '1st Year' },
  { to: '/teacher/dashboard/2nd-year', label: '2nd Year' },
  { to: '/teacher/dashboard/3rd-year', label: '3rd Year' },
  { to: '/teacher/dashboard/4th-year', label: '4th Year' },
] as const

export default function TeacherDashboardPage() {
  const { theme } = useTheme()
  const { user } = useTeacherAuth()

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white'

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const linkClass =
    theme === 'dark'
      ? 'border-slate-700 bg-slate-800/50 text-slate-200 hover:border-amber-500/40 hover:bg-amber-500/10'
      : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-amber-500/40 hover:bg-amber-500/10'

  const statCards = [
    {
      label: 'Name',
      value: user?.name ?? '—',
      icon: User,
      accent: 'text-amber-500',
    },
    {
      label: 'Phone',
      value: user?.phoneNo ?? '—',
      icon: Phone,
      accent: 'text-sky-500',
    },
    {
      label: 'Institute ID',
      value: user?.instituteId ?? '—',
      icon: Building2,
      accent: 'text-emerald-500',
    },
    {
      label: 'Department ID',
      value: user?.departmentId ?? '—',
      icon: GraduationCap,
      accent: 'text-violet-500',
    },
  ]

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
        <p className={`mt-1 text-sm ${mutedClass}`}>
          Overview of your teacher account.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {statCards.map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className={`rounded-xl border p-5 shadow-sm transition-colors ${cardClass}`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className={`text-sm font-medium ${mutedClass}`}>{label}</span>
              <Icon size={20} className={accent} />
            </div>
            <p className="truncate text-lg font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className={`mt-6 rounded-xl border p-6 shadow-sm ${cardClass}`}>
        <h2 className="text-lg font-semibold">MAAR by year</h2>
        <p className={`mt-1 text-sm ${mutedClass}`}>
          Review student activity submissions for each program year.
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
