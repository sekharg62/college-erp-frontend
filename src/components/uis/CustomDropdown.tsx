import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import SearchInput from './SearchInput'

export type DropdownOption = {
  value: string
  label: string
}

type CustomDropdownProps = {
  label: string
  value: string
  onChange: (value: string) => void
  options: DropdownOption[]
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  noResultsMessage?: string
  disabled?: boolean
  error?: string
  hint?: string
  className?: string
  id?: string
  required?: boolean
}

export default function CustomDropdown({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search…',
  emptyMessage = 'No options available',
  noResultsMessage = 'No results found',
  disabled = false,
  error,
  hint,
  className = '',
  id,
  required = false,
}: CustomDropdownProps) {
  const { theme } = useTheme()
  const generatedId = useId()
  const dropdownId = id ?? generatedId
  const listboxId = `${dropdownId}-listbox`
  const errorId = error ? `${dropdownId}-error` : undefined
  const hintId = hint ? `${dropdownId}-hint` : undefined

  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const labelClass = theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
  const hintClass = theme === 'dark' ? 'text-slate-500' : 'text-slate-500'

  const triggerClass =
    theme === 'dark'
      ? 'border-slate-700 bg-slate-950/60 text-slate-100 hover:border-slate-600 focus:border-amber-500 focus:ring-amber-500/25'
      : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400 focus:border-amber-500 focus:ring-amber-500/20'

  const panelClass =
    theme === 'dark'
      ? 'border-slate-700 bg-slate-900 shadow-lg shadow-black/30'
      : 'border-slate-200 bg-white shadow-lg'

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  )

  const filteredOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return options
    return options.filter((option) => option.label.toLowerCase().includes(query))
  }, [options, searchQuery])

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setSearchQuery('')
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const handleSelect = (nextValue: string) => {
    onChange(nextValue)
    setOpen(false)
    setSearchQuery('')
  }

  const toggleOpen = () => {
    if (disabled) return
    setOpen((current) => {
      if (current) setSearchQuery('')
      return !current
    })
  }

  return (
    <div ref={rootRef} className={`relative flex w-full flex-col gap-1.5 ${className}`}>
      <label htmlFor={dropdownId} className={`text-sm font-medium ${labelClass}`}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <button
        id={dropdownId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        onClick={toggleOpen}
        className={`flex w-full items-center justify-between gap-2 rounded-md border px-4 py-2.5 text-left text-sm outline-none transition-colors focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${triggerClass} ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/25' : ''
        }`}
      >
        <span className={selectedOption ? '' : mutedClass}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''} ${mutedClass}`}
          aria-hidden
        />
      </button>

      {open && (
        <div
          className={`absolute top-full z-50 mt-1 w-full overflow-hidden rounded-md border ${panelClass}`}
        >
          <div className="border-b border-slate-200 p-2 dark:border-slate-700">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={searchPlaceholder}
              aria-label={`Search ${label}`}
            />
          </div>

          <ul
            id={listboxId}
            role="listbox"
            aria-label={label}
            className="scrollbar-thin max-h-56 overflow-y-auto py-1"
          >
            {options.length === 0 ? (
              <li className={`px-3 py-2.5 text-sm ${mutedClass}`}>{emptyMessage}</li>
            ) : filteredOptions.length === 0 ? (
              <li className={`px-3 py-2.5 text-sm ${mutedClass}`}>{noResultsMessage}</li>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === value
                return (
                  <li key={option.value} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors ${
                        isSelected
                          ? 'bg-amber-500/15 font-medium text-amber-700 dark:text-amber-300'
                          : theme === 'dark'
                            ? 'text-slate-200 hover:bg-slate-800'
                            : 'text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected && (
                        <Check size={14} className="shrink-0 text-amber-600 dark:text-amber-400" />
                      )}
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      )}

      {hint && !error && (
        <p id={hintId} className={`text-xs ${hintClass}`}>
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
