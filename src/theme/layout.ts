import type { Theme } from '../context/ThemeContext'

export function getLayoutThemeClasses(theme: Theme) {
  return {
    cardClass:
      theme === 'dark'
        ? 'border-slate-800 bg-slate-900/80'
        : 'border-slate-200 bg-white',
    mutedClass: theme === 'dark' ? 'text-slate-400' : 'text-slate-600',
    urlBoxClass:
      theme === 'dark'
        ? 'border-slate-700 bg-slate-950/60 text-slate-300'
        : 'border-slate-200 bg-slate-50 text-slate-700',
  }
}
