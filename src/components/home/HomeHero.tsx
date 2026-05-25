import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SITE_CONFIG } from '../../constants/siteConfig'
import { HOME_PORTALS } from '../../constants/home/homeContent'
import { getHomeTheme } from '../../theme/home'
import { useTheme } from '../../context/ThemeContext'

export default function HomeHero() {
  const { theme } = useTheme()
  const t = getHomeTheme(theme)

  return (
    <section
      className={`relative flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center overflow-hidden border-b bg-gradient-to-b px-4 sm:px-6 ${t.heroGradient} ${t.sectionBorder}`}
    >
      <div
        className={`pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full blur-3xl ${t.orbPrimary}`}
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute top-1/3 -right-16 h-80 w-80 rounded-full blur-3xl ${t.orbSecondary}`}
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full blur-3xl ${t.orbTertiary}`}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <p
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest ${t.badge}`}
        >
          <Sparkles size={14} aria-hidden />
          {SITE_CONFIG.brandName} Portal
        </p>

        <h1 className={`mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl ${t.heading}`}>
          <span className={t.goldText}>{SITE_CONFIG.brandName}</span>
          <span className="mt-2 block text-2xl font-semibold sm:text-3xl lg:text-4xl">
            Mandatory Additional Requirements
          </span>
        </h1>

        <p className={`mx-auto mt-5 max-w-2xl text-base leading-relaxed sm:text-lg ${t.muted}`}>
          {SITE_CONFIG.tagline}. A premium, role-based platform for institutes to
          manage student activity points from submission to approval.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {HOME_PORTALS.map((portal) => (
            <Link
              key={portal.id}
              to={portal.loginPath}
              className={`group inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all ${t.card} ${t.cardHover} ${portal.glowClass}`}
            >
              <portal.icon size={18} className={portal.accent} />
              {portal.title}
              <ArrowRight
                size={16}
                className={`transition-transform group-hover:translate-x-0.5 ${portal.accent}`}
              />
            </Link>
          ))}
        </div>
      </div>

      <div className={`absolute bottom-0 left-0 right-0 h-px ${t.divider}`} aria-hidden />
    </section>
  )
}
