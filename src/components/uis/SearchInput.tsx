import { Search } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  'aria-label'?: string
  className?: string
  inputClassName?: string
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  'aria-label': ariaLabel = 'Search',
  className = '',
  inputClassName = '',
}: SearchInputProps) {
  const { theme } = useTheme()
  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const defaultInputClass =
    theme === 'dark'
      ? 'border-slate-700 bg-slate-950/60 text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/25'
      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500/20'

  return (
    <div className={`relative w-full ${className}`}>
      <Search
        size={16}
        className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${mutedClass}`}
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={`w-full rounded-md border py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:ring-2 ${defaultInputClass} ${inputClassName}`}
      />
    </div>
  )
}
