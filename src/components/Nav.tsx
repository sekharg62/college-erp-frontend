import { Moon, Sun } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useTheme, type Theme } from '../context/ThemeContext'

const getNavLinkClass = (isActive: boolean, theme: Theme) => {
  if (theme === 'dark') {
    return `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-violet-500/20 text-violet-300'
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`
  }

  return `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-violet-500/20 text-violet-600'
      : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
  }`
}

export default function Nav() {
  const { theme, toggleTheme } = useTheme()

  const navClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-950/90'
      : 'border-slate-200 bg-white/90'

  const toggleClass =
    theme === 'dark'
      ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-10 flex items-center justify-between border-b px-4 py-3 backdrop-blur ${navClass}`}
    >
      <div className="w-10" aria-hidden />

      <div className="flex gap-2">
        <NavLink
          to="/student"
          className={({ isActive }) => getNavLinkClass(isActive, theme)}
        >
          Student
        </NavLink>
        <NavLink
          to="/admin"
          className={({ isActive }) => getNavLinkClass(isActive, theme)}
        >
          Admin
        </NavLink>
        <NavLink
          to="/teacher"
          className={({ isActive }) => getNavLinkClass(isActive, theme)}
        >
          Teacher
        </NavLink>
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        aria-label={
          theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        }
        className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${toggleClass}`}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </nav>
  )
}
