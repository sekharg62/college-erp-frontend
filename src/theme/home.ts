import type { Theme } from '../context/ThemeContext'

export function getHomeTheme(theme: Theme) {
  const isDark = theme === 'dark'

  return {
    page: isDark
      ? 'bg-slate-950 text-slate-100'
      : 'bg-slate-50 text-slate-900',
    heroGradient: isDark
      ? 'from-slate-950 via-[#0c1222] to-slate-950'
      : 'from-slate-50 via-amber-50/40 to-slate-50',
    orbPrimary: isDark ? 'bg-amber-500/20' : 'bg-amber-400/30',
    orbSecondary: isDark ? 'bg-violet-600/15' : 'bg-violet-400/20',
    orbTertiary: isDark ? 'bg-sky-500/10' : 'bg-sky-400/15',
    muted: isDark ? 'text-slate-400' : 'text-slate-600',
    subtle: isDark ? 'text-slate-500' : 'text-slate-500',
    heading: isDark ? 'text-white' : 'text-slate-900',
    badge: isDark
      ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
      : 'border-amber-500/40 bg-amber-500/10 text-amber-800',
    goldText: isDark
      ? 'bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent'
      : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent',
    card: isDark
      ? 'border-white/10 bg-slate-900/60 backdrop-blur-md'
      : 'border-slate-200/80 bg-white/80 backdrop-blur-md shadow-sm',
    cardHover: isDark
      ? 'hover:border-amber-500/30 hover:bg-slate-900/80'
      : 'hover:border-amber-500/30 hover:shadow-md',
    sectionAlt: isDark
      ? 'border-slate-800/80 bg-slate-900/40'
      : 'border-slate-200 bg-gradient-to-b from-white to-slate-50/80',
    sectionBorder: isDark ? 'border-slate-800' : 'border-slate-200',
    statCard: isDark
      ? 'border-white/10 bg-slate-900/50'
      : 'border-slate-200 bg-white shadow-sm',
    footer: isDark
      ? 'border-slate-800 bg-slate-950'
      : 'border-slate-200 bg-white',
    divider: isDark ? 'bg-gradient-to-r from-transparent via-amber-500/50 to-transparent' : 'bg-gradient-to-r from-transparent via-amber-500/60 to-transparent',
  }
}
