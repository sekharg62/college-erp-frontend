import { Search } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

type TeacherStudentSubmissionsToolbarProps = {
  totalStudents: number
  filteredStudents: number
  searchQuery: string
  onSearchChange: (value: string) => void
  className?: string
}

export default function TeacherStudentSubmissionsToolbar({
  totalStudents,
  filteredStudents,
  searchQuery,
  onSearchChange,
  className = '',
}: TeacherStudentSubmissionsToolbarProps) {
  const { theme } = useTheme()
  const isSearching = searchQuery.trim().length > 0

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white'

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const inputClass =
    theme === 'dark'
      ? 'border-slate-700 bg-slate-950/60 text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/25'
      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500/20'

  return (
    <div
      className={`mb-3 flex flex-col gap-3 rounded-md border px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between ${cardClass} ${className}`}
    >
      <p className={`shrink-0 text-sm ${mutedClass}`}>
        <span className="font-semibold text-amber-600 dark:text-amber-400">
          {isSearching ? filteredStudents : totalStudents}
        </span>
        {isSearching && totalStudents > 0 && (
          <>
            {' '}
            of{' '}
            <span className="font-medium text-amber-600 dark:text-amber-400">
              {totalStudents}
            </span>
          </>
        )}{' '}
        student{totalStudents === 1 ? '' : 's'} submitted
      </p>

      <div className="relative w-full sm:max-w-md">
        <Search
          size={16}
          className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${mutedClass}`}
          aria-hidden
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search name, phone, roll no, activity…"
          className={`w-full rounded-md border py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:ring-2 ${inputClass}`}
          aria-label="Search students"
        />
      </div>
    </div>
  )
}
