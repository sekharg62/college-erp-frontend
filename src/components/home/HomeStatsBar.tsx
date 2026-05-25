import { HOME_STATS } from '../../constants/home/homeContent'
import { getHomeTheme } from '../../theme/home'
import { useTheme } from '../../context/ThemeContext'

export default function HomeStatsBar() {
  const { theme } = useTheme()
  const t = getHomeTheme(theme)

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {HOME_STATS.map(({ value, label, icon: Icon }) => (
          <div
            key={label}
            className={`flex items-center gap-4 rounded-2xl border p-5 transition-colors ${t.statCard} ${t.cardHover}`}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 text-amber-500">
              <Icon size={22} aria-hidden />
            </div>
            <div className="min-w-0 text-left">
              <p className={`text-2xl font-bold tracking-tight ${t.heading}`}>{value}</p>
              <p className={`mt-0.5 text-xs font-medium ${t.muted}`}>{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
