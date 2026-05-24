import type { ReactNode } from 'react'
import { useTheme } from '../../context/ThemeContext'

type SettingsSectionProps = {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export default function SettingsSection({
  title,
  description,
  action,
  children,
  className = '',
}: SettingsSectionProps) {
  const { theme } = useTheme()

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white'

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const headerBorder =
    theme === 'dark' ? 'border-slate-800' : 'border-slate-200'

  return (
    <section
      className={`overflow-hidden rounded-md border shadow-sm ${cardClass} ${className}`}
    >
      <div
        className={`flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4 sm:px-6 ${headerBorder}`}
      >
        <div className="min-w-0">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            {title}
          </h2>
          {description && (
            <p className={`mt-1 text-sm ${mutedClass}`}>{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="space-y-4 px-5 py-5 sm:px-6">{children}</div>
    </section>
  )
}
