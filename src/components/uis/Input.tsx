import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
} from 'react'
import { useTheme } from '../../context/ThemeContext'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className = '', id, ...props },
  ref,
) {
  const { theme } = useTheme()
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined
  const hintId = hint ? `${inputId}-hint` : undefined

  const labelClass =
    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'

  const inputClass =
    theme === 'dark'
      ? 'border-slate-700 bg-slate-950/60 text-slate-100 placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/25'
      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:ring-violet-500/20'

  const hintClass = theme === 'dark' ? 'text-slate-500' : 'text-slate-500'

  return (
    <div className={`flex w-full flex-col gap-1.5 ${className}`}>
      <label htmlFor={inputId} className={`text-sm font-medium ${labelClass}`}>
        {label}
      </label>

      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${inputClass} ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/25' : ''
        }`}
        {...props}
      />

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
})

export default Input
