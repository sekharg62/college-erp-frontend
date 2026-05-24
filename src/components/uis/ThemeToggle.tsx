import { Moon, Sun } from 'lucide-react'
import { useTheme, type Theme } from '../../context/ThemeContext'

type ThemeToggleProps = {
  /** Compact icon button for dashboard header */
  variant?: 'icon' | 'settings'
}

export default function ThemeToggle({ variant = 'icon' }: ThemeToggleProps) {
  const { theme, setTheme, toggleTheme } = useTheme()

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
          theme === 'dark'
            ? 'text-slate-400 hover:bg-slate-800'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    )
  }

  return <ThemeSettingsSelector theme={theme} onSelect={setTheme} />
}

type ThemeSettingsSelectorProps = {
  theme: Theme
  onSelect: (theme: Theme) => void
}

function ThemeOption({
  active,
  label,
  description,
  icon: Icon,
  onClick,
  theme,
}: {
  active: boolean
  label: string
  description: string
  icon: typeof Sun
  onClick: () => void
  theme: Theme
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-1 flex-col items-start gap-2 rounded-lg border px-4 py-3 text-left transition-all ${
        active
          ? 'border-amber-500/50 bg-amber-500/10 ring-2 ring-amber-500/30'
          : theme === 'dark'
            ? 'border-slate-700 bg-slate-950/40 hover:border-slate-600 hover:bg-slate-800/50'
            : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
      }`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-md ${
          active
            ? 'bg-amber-500/20 text-amber-500'
            : theme === 'dark'
              ? 'bg-slate-800 text-slate-400'
              : 'bg-white text-slate-500 shadow-sm'
        }`}
      >
        <Icon size={18} />
      </span>
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span
          className={`mt-0.5 block text-xs ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          {description}
        </span>
      </span>
    </button>
  )
}

function ThemeSettingsSelector({ theme, onSelect }: ThemeSettingsSelectorProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <ThemeOption
        active={theme === 'light'}
        label="Light"
        description="Bright background, easy to read in daylight"
        icon={Sun}
        onClick={() => onSelect('light')}
        theme={theme}
      />
      <ThemeOption
        active={theme === 'dark'}
        label="Dark"
        description="Reduced glare, comfortable at night"
        icon={Moon}
        onClick={() => onSelect('dark')}
        theme={theme}
      />
    </div>
  )
}
