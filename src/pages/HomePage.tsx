import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  LayoutDashboard,
  Shield,
  Upload,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { SITE_CONFIG } from '../constants/siteConfig'
import { useTheme } from '../context/ThemeContext'

const portals = [
  {
    id: 'student',
    title: 'Student',
    description:
      'Log in with roll number, upload MAAR activity proofs by year, and track submission status.',
    loginPath: '/student',
    dashboardPath: '/student/dashboard',
    icon: GraduationCap,
    accent: 'text-amber-500',
    accentBg: 'bg-amber-500/15',
    borderHover: 'hover:border-amber-500/40',
  },
  {
    id: 'teacher',
    title: 'Teacher',
    description:
      'Review submissions by program year, manage students, approve activities, and contact students.',
    loginPath: '/teacher',
    dashboardPath: '/teacher/dashboard',
    icon: Users,
    accent: 'text-sky-500',
    accentBg: 'bg-sky-500/15',
    borderHover: 'hover:border-sky-500/40',
  },
  {
    id: 'admin',
    title: 'Admin',
    description:
      'Set up your institute, create departments, and onboard teachers for your organization.',
    loginPath: '/admin/login',
    dashboardPath: '/admin/dashboard',
    setupPath: '/admin',
    icon: Shield,
    accent: 'text-violet-500',
    accentBg: 'bg-violet-500/15',
    borderHover: 'hover:border-violet-500/40',
  },
] as const

const howItWorks = [
  {
    step: '1',
    title: 'Institute setup',
    body: 'Admin creates the institute and department, then adds teachers.',
    icon: Shield,
  },
  {
    step: '2',
    title: 'Students submit MAAR',
    body: 'Students upload proofs for activities by academic year (1st–4th year).',
    icon: Upload,
  },
  {
    step: '3',
    title: 'Teachers review',
    body: 'Teachers verify submissions, track points, and follow up via dashboard tools.',
    icon: CheckCircle2,
  },
] as const

export default function HomePage() {
  const { theme } = useTheme()

  const pageClass =
    theme === 'dark'
      ? 'bg-slate-950 text-slate-100'
      : 'bg-slate-50 text-slate-900'

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white'

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const heroGradient =
    theme === 'dark'
      ? 'from-violet-500/10 via-slate-950 to-amber-500/10'
      : 'from-violet-500/10 via-white to-amber-500/10'

  return (
    <main className={`min-h-screen pt-16 transition-colors ${pageClass}`}>
      {/* Hero — fills viewport below fixed navbar (4rem) */}
      <section
        className={`flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center border-b bg-gradient-to-b px-4 sm:px-6 ${heroGradient} ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div className="mx-auto w-full max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-500">
            {SITE_CONFIG.brandName}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {SITE_CONFIG.brandFullName}
          </h1>
          <p className={`mx-auto mt-4 max-w-2xl text-base sm:text-lg ${mutedClass}`}>
            {SITE_CONFIG.tagline}. Choose your role below to sign in or set up your
            institute.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {portals.map((portal) => (
              <Link
                key={portal.id}
                to={portal.loginPath}
                className={`inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors ${cardClass} ${portal.borderHover}`}
              >
                <portal.icon size={18} className={portal.accent} />
                {portal.title} login
                <ArrowRight size={16} className={portal.accent} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          How it works
        </h2>
        <p className={`mt-2 text-center text-sm ${mutedClass}`}>
          Three roles, one platform — from institute setup to student submissions.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {howItWorks.map(({ step, title, body, icon: Icon }) => (
            <div
              key={step}
              className={`rounded-xl border p-6 shadow-sm ${cardClass}`}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/15 text-violet-500">
                <Icon size={20} />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-violet-500">
                Step {step}
              </p>
              <h3 className="mt-1 font-semibold">{title}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${mutedClass}`}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Portals */}
      <section
        className={`border-t px-4 py-14 sm:px-6 ${
          theme === 'dark' ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-slate-100/50'
        }`}
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight">
            Choose your portal
          </h2>
          <p className={`mt-2 text-center text-sm ${mutedClass}`}>
            Use the navbar or the cards below to go to the right login page.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {portals.map((portal) => (
              <article
                key={portal.id}
                className={`flex flex-col rounded-xl border p-6 shadow-sm transition-colors ${cardClass} ${portal.borderHover}`}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${portal.accentBg} ${portal.accent}`}
                >
                  <portal.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold">{portal.title}</h3>
                <p className={`mt-2 flex-1 text-sm leading-relaxed ${mutedClass}`}>
                  {portal.description}
                </p>
                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    to={portal.loginPath}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white ${
                      portal.id === 'student'
                        ? 'bg-amber-600 hover:bg-amber-500'
                        : portal.id === 'teacher'
                          ? 'bg-sky-600 hover:bg-sky-500'
                          : 'bg-violet-600 hover:bg-violet-500'
                    }`}
                  >
                    Go to {portal.title} login
                    <ArrowRight size={16} />
                  </Link>
                  {'setupPath' in portal && portal.setupPath && (
                    <Link
                      to={portal.setupPath}
                      className={`text-center text-xs font-medium underline-offset-2 hover:underline ${mutedClass}`}
                    >
                      First time? Create institute
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Route guide */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className={`rounded-xl border p-6 shadow-sm sm:p-8 ${cardClass}`}>
          <div className="mb-4 flex items-center gap-2">
            <LayoutDashboard size={20} className="text-violet-500" />
            <h2 className="text-lg font-semibold">Quick navigation</h2>
          </div>
          <p className={`mb-6 text-sm ${mutedClass}`}>
            After login, each role has its own dashboard. Bookmark these paths:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr
                  className={`border-b ${
                    theme === 'dark' ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <th className="pb-3 pr-4 font-semibold">Role</th>
                  <th className="pb-3 pr-4 font-semibold">Login</th>
                  <th className="pb-3 font-semibold">Dashboard</th>
                </tr>
              </thead>
              <tbody className={mutedClass}>
                {portals.map((portal) => (
                  <tr
                    key={portal.id}
                    className={`border-b last:border-b-0 ${
                      theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
                    }`}
                  >
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-slate-100">
                      {portal.title}
                    </td>
                    <td className="py-3 pr-4">
                      <Link
                        to={portal.loginPath}
                        className="font-mono text-xs text-violet-600 hover:underline dark:text-violet-400"
                      >
                        {portal.loginPath}
                      </Link>
                    </td>
                    <td className="py-3">
                      <Link
                        to={portal.dashboardPath}
                        className="font-mono text-xs text-violet-600 hover:underline dark:text-violet-400"
                      >
                        {portal.dashboardPath}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`mt-6 flex items-start gap-2 text-xs ${mutedClass}`}>
            <BookOpen size={14} className="mt-0.5 shrink-0 text-amber-500" />
            Students can also open the MAAR activity list from their dashboard after
            signing in.
          </p>
        </div>
      </section>

      <footer
        className={`border-t px-4 py-8 text-center text-xs ${mutedClass} ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        © {SITE_CONFIG.legal.copyrightYear} {SITE_CONFIG.legal.copyrightHolder}. Need
        help? {SITE_CONFIG.support.email}
      </footer>
    </main>
  )
}
