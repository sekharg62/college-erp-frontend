import { HOME_STEPS } from '../../constants/home/homeContent'
import { getHomeTheme } from '../../theme/home'
import { useTheme } from '../../context/ThemeContext'

export default function HomeHowItWorks() {
  const { theme } = useTheme()
  const t = getHomeTheme(theme)

  return (
    <section className={`border-y px-4 py-14 sm:px-6 ${t.sectionAlt} ${t.sectionBorder}`}>
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-500">
            Workflow
          </p>
          <h2 className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${t.heading}`}>
            How it works
          </h2>
          <p className={`mt-3 text-sm ${t.muted}`}>
            Three roles, one connected platform — from setup to signed reports.
          </p>
        </div>

        <div className="relative mt-12 grid gap-8 md:grid-cols-3">
          <div
            className={`absolute top-12 right-[16%] left-[16%] hidden h-0.5 md:block ${t.divider}`}
            aria-hidden
          />
          {HOME_STEPS.map(({ step, title, body, icon: Icon }) => (
            <div key={step} className="relative text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/25 to-violet-500/10 text-amber-500 shadow-lg shadow-amber-500/10">
                <Icon size={24} aria-hidden />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                Step {step}
              </span>
              <h3 className={`mt-2 text-lg font-semibold ${t.heading}`}>{title}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${t.muted}`}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
