import Skeleton from '../uis/Skeleton'
import { useTheme } from '../../context/ThemeContext'

type TeacherYearPageSkeletonProps = {
  rowCount?: number
  className?: string
}

const TABLE_COLUMNS = [
  { key: 'expand', label: '', width: 'w-8' },
  { key: 'name', label: 'Name', width: '' },
  { key: 'phone', label: 'Phone no', width: '' },
  { key: 'roll', label: 'Roll no', width: '' },
  { key: 'admission', label: 'Admission year', width: '' },
  { key: 'activities', label: 'Total activities', width: 'text-center' },
  { key: 'points', label: 'Total points', width: 'text-center' },
  { key: 'status', label: 'Status', width: '' },
] as const

const ROW_CELL_WIDTHS = [
  'h-4 w-4 shrink-0',
  'h-4 w-28 sm:w-36',
  'h-4 w-24',
  'h-4 w-20',
  'h-4 w-16',
  'h-4 w-8 mx-auto',
  'h-4 w-10 mx-auto',
  'h-5 w-20',
] as const

export default function TeacherYearPageSkeleton({
  rowCount = 6,
  className = '',
}: TeacherYearPageSkeletonProps) {
  const { theme } = useTheme()

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white'

  const tableHeadClass =
    theme === 'dark' ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-600'

  const tableRowClass =
    theme === 'dark' ? 'border-slate-800' : 'border-slate-200'

  return (
    <div
      className={className}
      role="status"
      aria-busy="true"
      aria-label="Loading student submissions"
    >
      {/* Toolbar skeleton */}
      <div
        className={`mb-3 flex flex-col gap-3 rounded-md border px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between ${cardClass}`}
      >
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-full sm:max-w-md" />
      </div>

      {/* Table skeleton — same structure as TeacherStudentActivityList table layout */}
      <div className={`overflow-hidden rounded-md border shadow-sm ${cardClass}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-4xl text-left text-sm">
            <thead>
              <tr className={`border-b ${tableRowClass} ${tableHeadClass}`}>
                {TABLE_COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    className={`px-3 py-3 font-semibold ${column.width} ${
                      column.key === 'expand' ? 'w-8 px-2' : ''
                    }`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rowCount }, (_, index) => (
                <tr
                  key={index}
                  className={`border-b last:border-b-0 ${tableRowClass}`}
                >
                  <td className="px-2 py-3">
                    <Skeleton className={ROW_CELL_WIDTHS[0]} />
                  </td>
                  {ROW_CELL_WIDTHS.slice(1).map((widthClass, cellIndex) => (
                    <td key={cellIndex} className="px-3 py-3">
                      <Skeleton className={widthClass} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <span className="sr-only">Loading students…</span>
    </div>
  )
}
