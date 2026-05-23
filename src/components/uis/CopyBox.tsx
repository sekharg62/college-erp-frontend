import { useCallback } from 'react'
import { toast } from 'sonner'
import { useTheme } from '../../context/ThemeContext'

type CopyBoxProps = {
  value: string
  /** Visible character count before "…" (default 10) */
  maxLength?: number
  className?: string
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength)}…`
}

export default function CopyBox({
  value,
  maxLength = 10,
  className = '',
}: CopyBoxProps) {
  const { theme } = useTheme()

  const handleCopy = useCallback(async () => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      toast.success('Copied to clipboard')
    } catch {
      toast.error('Could not copy')
    }
  }, [value])

  if (!value) {
    return <span className={`text-sm ${className}`}>—</span>
  }

  const display = truncateText(value, maxLength)

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      title={`${value}\nClick to copy`}
      className={`max-w-full cursor-pointer truncate rounded px-1 py-0.5 text-left text-sm font-medium transition-colors hover:bg-amber-500/10 ${
        theme === 'dark'
          ? 'text-amber-400 hover:text-amber-300'
          : 'text-amber-700 hover:text-amber-600'
      } ${className}`}
    >
      {display}
    </button>
  )
}
