import type { Theme } from '../context/ThemeContext'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'cancel' | 'success'

export function getButtonVariantClass(theme: Theme, variant: ButtonVariant) {
  const variants: Record<ButtonVariant, { dark: string; light: string }> = {
    primary: {
      dark: 'bg-amber-500 text-slate-950 hover:bg-amber-400',
      light: 'bg-amber-500 text-white hover:bg-amber-600',
    },
    secondary: {
      dark: 'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700',
      light: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
    },
    danger: {
      dark: 'bg-red-600 text-white hover:bg-red-500',
      light: 'bg-red-600 text-white hover:bg-red-700',
    },
    cancel: {
      dark: 'border border-slate-700 text-slate-300 hover:bg-slate-800',
      light: 'border border-slate-300 text-slate-600 hover:bg-slate-100',
    },
    success:{
      dark: 'bg-green-600 text-white hover:bg-green-500',
      light: 'bg-green-600 text-white hover:bg-green-700',
    }
  }

  return theme === 'dark' ? variants[variant].dark : variants[variant].light
}

export function getButtonThemeClasses(theme: Theme) {
  return {
    primaryBtnClass: getButtonVariantClass(theme, 'primary'),
    secondaryBtnClass: getButtonVariantClass(theme, 'secondary'),
    dangerBtnClass: getButtonVariantClass(theme, 'danger'),
    cancelBtnClass: getButtonVariantClass(theme, 'cancel'),
    iconBtnClass:
      theme === 'dark'
        ? 'text-slate-400 hover:bg-slate-800 hover:text-amber-400'
        : 'text-slate-500 hover:bg-slate-100 hover:text-amber-600',
    removeBtnClass:
      theme === 'dark'
        ? 'text-slate-400 hover:bg-slate-800 hover:text-red-400'
        : 'text-slate-500 hover:bg-slate-100 hover:text-red-600',
  }
}
