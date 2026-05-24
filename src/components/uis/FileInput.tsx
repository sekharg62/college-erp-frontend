import { Loader2, X } from 'lucide-react'
import { useId, useRef, useState, type ChangeEvent } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { getFormThemeClasses } from '../../theme/form'

const DEFAULT_MAX_SIZE_BYTES = 2 * 1024 * 1024

export type FileInputProps = {
  label: string
  /** Current uploaded file URL */
  value?: string | null
  onChange?: (url: string | null) => void
  /** Called with the selected file; should return the stored URL */
  onUpload: (file: File) => Promise<string>
  accept?: string
  /** MIME types allowed (e.g. `image/png`) */
  allowedMimeTypes?: string[]
  maxFiles?: number
  maxSizeBytes?: number
  hint?: string
  error?: string
  disabled?: boolean
  className?: string
}

function formatMaxSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${bytes / (1024 * 1024)}MB`
  if (bytes >= 1024) return `${bytes / 1024}KB`
  return `${bytes}B`
}

export default function FileInput({
  label,
  value = null,
  onChange,
  onUpload,
  accept = 'image/png,.png',
  allowedMimeTypes = ['image/png'],
  maxFiles = 1,
  maxSizeBytes = DEFAULT_MAX_SIZE_BYTES,
  hint,
  error: errorProp,
  disabled = false,
  className = '',
}: FileInputProps) {
  const { theme } = useTheme()
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const { inputClass } = getFormThemeClasses(theme)
  const labelClass = theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
  const hintClass = theme === 'dark' ? 'text-slate-500' : 'text-slate-500'
  const error = errorProp ?? localError

  const defaultHint =
    hint ??
    `PNG only · max ${maxFiles} file${maxFiles === 1 ? '' : 's'} · ${formatMaxSize(maxSizeBytes)}`

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = ''
  }

  const validateFile = (file: File): string | null => {
    if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(file.type)) {
      return 'Only PNG images are allowed'
    }
    if (file.size > maxSizeBytes) {
      return `File must be ${formatMaxSize(maxSizeBytes)} or smaller`
    }
    return null
  }

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validationError = validateFile(file)
    if (validationError) {
      setLocalError(validationError)
      resetInput()
      return
    }

    setLocalError(null)
    setLoading(true)

    try {
      const url = await onUpload(file)
      onChange?.(url)
    } catch (uploadError) {
      const message =
        uploadError instanceof Error ? uploadError.message : 'Upload failed'
      setLocalError(message)
    } finally {
      setLoading(false)
      resetInput()
    }
  }

  const handleClear = () => {
    setLocalError(null)
    onChange?.(null)
    resetInput()
  }

  const hasValue = Boolean(value)

  return (
    <div className={`flex w-full flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={hasValue ? undefined : inputId}
        className={`text-sm font-medium ${labelClass}`}
      >
        {label}
      </label>

      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {loading && (
          <Loader2 size={18} className="shrink-0 animate-spin text-amber-500" />
        )}

        {hasValue && !loading && (
          <>
            <img
              src={value!}
              alt=""
              className="h-16 w-auto max-w-full rounded border border-slate-200 object-contain dark:border-slate-700"
            />
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors disabled:opacity-50 ${
                theme === 'dark'
                  ? 'text-red-400 hover:bg-red-500/10'
                  : 'text-red-600 hover:bg-red-50'
              }`}
              aria-label="Remove file"
            >
              <X size={16} />
            </button>
            <button
              type="button"
              disabled={disabled || loading}
              onClick={() => inputRef.current?.click()}
              className="text-xs font-medium text-amber-600 hover:underline disabled:opacity-50 dark:text-amber-400"
            >
              Replace
            </button>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        disabled={disabled || loading}
        className={
          hasValue
            ? 'hidden'
            : `w-full max-w-md rounded-md border px-2 py-1.5 text-sm file:cursor-pointer disabled:opacity-50 ${inputClass} ${
                error ? 'border-red-500' : ''
              }`
        }
        onChange={(event) => void handleChange(event)}
      />

      {!error && (
        <p className={`text-xs ${hintClass}`}>{defaultHint}</p>
      )}

      {error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
