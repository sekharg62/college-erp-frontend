import { HOME_FEATURES } from '../../constants/home/homeContent'
import { getHomeTheme } from '../../theme/home'
import { useTheme } from '../../context/ThemeContext'

export default function HomeFeatures() {
  const { theme } = useTheme()
  const t = getHomeTheme(theme)

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">
          Platform highlights
        </p>
        <h2 className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${t.heading}`}>
          Built for clarity and compliance
        </h2>
        <p className={`mx-auto mt-3 max-w-xl text-sm ${t.muted}`}>
          Everything your institute needs to run MAAR — structured data, clear roles,
          and professional records.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {HOME_FEATURES.map(({ title, description, icon: Icon }) => (
          <article
            key={title}
            className={`group rounded-2xl border p-6 transition-all ${t.card} ${t.cardHover}`}
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-violet-500/10 text-amber-500 transition-transform group-hover:scale-105">
              <Icon size={20} aria-hidden />
            </div>
            <h3 className={`font-semibold ${t.heading}`}>{title}</h3>
            <p className={`mt-2 text-sm leading-relaxed ${t.muted}`}>{description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
