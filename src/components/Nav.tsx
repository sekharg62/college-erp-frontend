import { BookOpen, Home, Moon, Sun } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { SITE_CONFIG } from '../constants/siteConfig'
import { useTheme, type Theme } from '../context/ThemeContext'

type NavItem = {
  to: string
  label: string
  match: (path: string) => boolean
  activeClass: string
}

const navItems: NavItem[] = [
  {
    to: '/',
    label: 'Home',
    match: (path) => path === '/',
    activeClass:
      'bg-slate-200 text-slate-900 dark:bg-slate-700/40 dark:text-slate-100',
  },
  {
    to: '/student',
    label: 'Student',
    match: (path) => path.startsWith('/student'),
    activeClass:
      'bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-300',
  },
  {
    to: '/teacher',
    label: 'Teacher',
    match: (path) => path.startsWith('/teacher'),
    activeClass: 'bg-sky-100 text-sky-900 dark:bg-sky-500/15 dark:text-sky-300',
  },
  {
    to: '/admin/login',
    label: 'Admin',
    match: (path) => path.startsWith('/admin'),
    activeClass:
      'bg-violet-100 text-violet-900 dark:bg-violet-500/15 dark:text-violet-300',
  },
]

function getNavLinkClass(isActive: boolean, theme: Theme, activeClass: string) {
  const base =
    theme === 'dark'
      ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'

  return `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive ? activeClass : base
  }`
}

export default function Nav() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const navClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-950/95'
      : 'border-slate-200 bg-white/95'

  const brandClass =
    theme === 'dark'
      ? 'text-slate-100 hover:text-amber-400'
      : 'text-slate-900 hover:text-amber-600'

  const toggleClass =
    theme === 'dark'
      ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md ${navClass}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link
          to="/"
          className={`flex min-w-0 items-center gap-2 font-semibold tracking-tight transition-colors ${brandClass}`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
            <BookOpen size={18} aria-hidden />
          </span>
          <span className="hidden truncate sm:inline">{SITE_CONFIG.brandName}</span>
        </Link>

        <div className="flex flex-1 flex-wrap items-center justify-center gap-1 sm:gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={() =>
                getNavLinkClass(item.match(location.pathname), theme, item.activeClass)
              }
            >
              {item.label === 'Home' ? (
                <span className="inline-flex items-center gap-1.5 text-current">
                  <Home size={15} strokeWidth={2.25} aria-hidden />
                  Home
                </span>
              ) : (
                item.label
              )}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
          }
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${toggleClass}`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  )
}
