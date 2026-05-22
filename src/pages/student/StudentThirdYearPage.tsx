import { BookOpen } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function StudentThirdYearPage() {
  const { theme } = useTheme()

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white'

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
          <BookOpen size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">3rd Year</h1>
          <p className={`mt-1 text-sm ${mutedClass}`}>
            Content for 3rd Year will appear here.
          </p>
        </div>
      </div>

      <div className={`rounded-2xl border p-6 shadow-sm ${cardClass}`}>
        <p className={`text-sm ${mutedClass}`}>
          Select materials and resources for 3rd Year from this section.
        </p>
      </div>
    </div>
  )
}
