import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HOME_PORTALS } from '../../constants/home/homeContent'
import { getHomeTheme } from '../../theme/home'
import { useTheme } from '../../context/ThemeContext'

export default function HomePortals() {
  const { theme } = useTheme()
  const t = getHomeTheme(theme)

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">
          Get started
        </p>
        <h2 className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${t.heading}`}>
          Choose your portal
        </h2>
        <p className={`mt-3 text-sm ${t.muted}`}>
          Select the role that matches you — each portal has its own secure login.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {HOME_PORTALS.map((portal) => (
          <article
            key={portal.id}
            className={`relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-all ${t.card} ${t.cardHover} ${portal.glowClass}`}
          >
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-80 ${portal.id === 'student' ? 'from-amber-500 to-amber-600' : portal.id === 'teacher' ? 'from-sky-500 to-cyan-500' : 'from-violet-500 to-purple-500'}`}
              aria-hidden
            />

            <div
              className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${portal.accentBg} ${portal.accent}`}
            >
              <portal.icon size={26} aria-hidden />
            </div>

            <p className={`text-xs font-semibold uppercase tracking-wider ${portal.accent}`}>
              {portal.tagline}
            </p>
            <h3 className={`mt-1 text-xl font-bold ${t.heading}`}>{portal.title}</h3>
            <p className={`mt-3 flex-1 text-sm leading-relaxed ${t.muted}`}>
              {portal.description}
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <Link
                to={portal.loginPath}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${portal.buttonClass}`}
              >
                Go to {portal.title} login
                <ArrowRight size={16} />
              </Link>
              {portal.setupPath && (
                <Link
                  to={portal.setupPath}
                  className={`text-center text-xs font-medium underline-offset-2 hover:underline ${t.muted}`}
                >
                  First time? Create institute
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
