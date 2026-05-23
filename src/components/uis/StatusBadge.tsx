import type { StudentActivitySubmissionStatusValue } from '../../constants'
import { studentActivitySubmissionStatus } from '../../constants'
import { useTheme } from '../../context/ThemeContext'

const badgeStyles: Record<
  StudentActivitySubmissionStatusValue,
  { light: string; dark: string }
> = {
  APPROVED: {
    light: 'bg-green-100 text-green-800 border-green-300',
    dark: 'bg-green-500/20 text-green-400 border-green-500/40',
  },
  PENDING: {
    light: 'bg-orange-100 text-orange-800 border-orange-300',
    dark: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  },
  REJECTED: {
    light: 'bg-red-100 text-red-800 border-red-300',
    dark: 'bg-red-500/20 text-red-400 border-red-500/40',
  },
}

const defaultBadgeStyle = {
  light: 'bg-slate-100 text-slate-700 border-slate-200',
  dark: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
}

const statusAliases: Record<string, StudentActivitySubmissionStatusValue> = {
  APPROVE: 'APPROVED',
  ACCEPT: 'APPROVED',
  ACCEPTED: 'APPROVED',
  PEND: 'PENDING',
  REJECT: 'REJECTED',
  REGENT: 'REJECTED',
  DECLINED: 'REJECTED',
  DENIED: 'REJECTED',
}

function normalizeStatus(raw: string): StudentActivitySubmissionStatusValue | null {
  const upper = String(raw ?? '').trim().toUpperCase()
  if (upper in badgeStyles) {
    return upper as StudentActivitySubmissionStatusValue
  }
  return statusAliases[upper] ?? null
}

function statusLabel(status: StudentActivitySubmissionStatusValue) {
  return (
    studentActivitySubmissionStatus.find((item) => item.value === status)?.label ??
    status
  )
}

type StatusBadgeProps = {
  /** API may send any casing; unknown values get a neutral badge */
  status: string
  className?: string
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const { theme } = useTheme()
  const normalized = normalizeStatus(status)
  const colors = normalized ? badgeStyles[normalized] : defaultBadgeStyle
  const label = normalized ? statusLabel(normalized) : status || 'Unknown'

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${
        theme === 'dark' ? colors.dark : colors.light
      } ${className}`}
    >
      {label}
    </span>
  )
}
