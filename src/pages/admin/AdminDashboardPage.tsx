import { Building2, Phone, User } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useTheme } from '../../context/ThemeContext'

export default function AdminDashboardPage() {
  const { theme } = useTheme()
  const { user } = useAdminAuth()

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white'

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const statCards = [
    {
      label: 'Admin name',
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
  ]

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
        <p className={`mt-1 text-sm ${mutedClass}`}>
          Overview of your admin account and institute.
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

      <div className={`mt-6 rounded-2xl border p-6 shadow-sm ${cardClass}`}>
        <h2 className="text-lg font-semibold">Quick actions</h2>
        <p className={`mt-1 text-sm ${mutedClass}`}>
          Use the sidebar to create a new institute or manage your portal.
        </p>
      </div>
    </div>
  )
}
