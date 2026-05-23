import { useTheme } from '../../context/ThemeContext'
import SearchInput from './SearchInput'

type TableListToolbarProps = {
  totalCount: number
  filteredCount: number
  /** Singular label, e.g. "department" → "5 departments" */
  itemLabel: string
  searchQuery: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  searchAriaLabel?: string
  className?: string
}

export default function TableListToolbar({
  totalCount,
  filteredCount,
  itemLabel,
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  searchAriaLabel,
  className = '',
}: TableListToolbarProps) {
  const { theme } = useTheme()
  const isSearching = searchQuery.trim().length > 0
  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
  const borderClass = theme === 'dark' ? 'border-slate-800' : 'border-slate-200'

  const pluralLabel = totalCount === 1 ? itemLabel : `${itemLabel}s`

  return (
    <div
      className={`flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${borderClass} ${className}`}
    >
      <p className={`shrink-0 text-sm ${mutedClass}`}>
        <span className="font-semibold text-amber-600 dark:text-amber-400">
          {isSearching ? filteredCount : totalCount}
        </span>
        {isSearching && totalCount > 0 && (
          <>
            {' '}
            of{' '}
            <span className="font-medium text-amber-600 dark:text-amber-400">
              {totalCount}
            </span>
          </>
        )}{' '}
        {pluralLabel}
      </p>

      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder={searchPlaceholder ?? `Search ${pluralLabel}…`}
        aria-label={searchAriaLabel ?? `Search ${pluralLabel}`}
        className="sm:max-w-xs"
      />
    </div>
  )
}
