import type { ReactNode } from 'react'
import { useTheme } from '../context/ThemeContext'

type PageLayoutProps = {
  label: string
  labelClassName: string
  title: string
  description: string
  children?: ReactNode
}

export default function PageLayout({
  label,
  labelClassName,
  title,
  description,
  children,
}: PageLayoutProps) {
  const { theme } = useTheme()

  const mainClass =
    theme === 'dark'
      ? 'bg-slate-950 text-slate-100'
      : 'bg-slate-50 text-slate-900'

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white/80'

  const descriptionClass =
    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center px-6 py-24 transition-colors ${mainClass}`}
    >
      <div
        className={`w-full max-w-md rounded-2xl border p-8 shadow-xl backdrop-blur transition-colors ${cardClass}`}
      >
        <p
          className={`mb-2 text-sm font-medium uppercase tracking-widest ${labelClassName}`}
        >
          {label}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className={`mt-2 ${descriptionClass}`}>{description}</p>

        {children && (
          <div className="mt-6 flex flex-col gap-4">{children}</div>
        )}
      </div>
    </main>
  )
}
