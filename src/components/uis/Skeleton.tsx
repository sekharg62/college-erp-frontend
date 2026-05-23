import { useTheme } from '../../context/ThemeContext'

type SkeletonProps = {
  className?: string
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  const { theme } = useTheme()
  const tone =
    theme === 'dark' ? 'bg-slate-700/70' : 'bg-slate-200'

  return (
    <div
      className={`animate-pulse rounded-md ${tone} ${className}`}
      aria-hidden
    />
  )
}
