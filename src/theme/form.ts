import type { Theme } from '../context/ThemeContext'

export function getFormThemeClasses(theme: Theme) {
  return {
    inputClass:
      theme === 'dark'
        ? 'border-slate-700 bg-slate-950/60 text-slate-200 file:mr-2 file:rounded file:border-0 file:bg-slate-800 file:px-2 file:py-1 file:text-xs file:text-slate-200'
        : 'border-slate-300 bg-white text-slate-900 file:mr-2 file:rounded file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-xs file:text-slate-700',
  }
}
