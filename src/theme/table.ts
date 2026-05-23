import type { Theme } from '../context/ThemeContext'

export function getTableThemeClasses(theme: Theme) {
  return {
    stickyHeadClass:
      theme === 'dark'
        ? 'bg-slate-900 text-slate-400 shadow-[0_1px_0_0_rgb(30_41_59)]'
        : 'bg-slate-50 text-slate-600 shadow-[0_1px_0_0_rgb(226_232_240)]',
    tableRowClass: theme === 'dark' ? 'border-slate-800' : 'border-slate-200',
    categoryRowClass:
      theme === 'dark'
        ? 'bg-amber-500/15 text-amber-200'
        : 'bg-amber-100 text-amber-950',
  }
}
