import { Mail, Shield, User } from 'lucide-react'
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext'
import { useTheme } from '../../context/ThemeContext'

export default function SuperAdminDashboardPage() {
  const { theme } = useTheme()
  const { user } = useSuperAdminAuth()

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white'

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const statCards = [
    {
      label: 'Name',
      value: user?.name ?? '—',
      icon: User,
      accent: 'text-rose-500',
    },
    {
      label: 'Email',
      value: user?.email ?? '—',
      icon: Mail,
      accent: 'text-sky-500',
    },
    {
      label: 'Role',
      value: user?.role ?? '—',
      icon: Shield,
      accent: 'text-violet-500',
    },
  ]

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Super Admin Dashboard
        </h1>
        <p className={`mt-1 text-sm ${mutedClass}`}>
          Platform-level administration for MAAR.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className={`rounded-2xl border p-5 shadow-sm transition-colors ${cardClass}`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className={`text-sm font-medium ${mutedClass}`}>{label}</span>
              <Icon size={20} className={accent} />
            </div>
            <p className="truncate text-lg font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
