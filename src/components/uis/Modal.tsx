import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../../context/ThemeContext'

type ModalSize = 'sm' | 'md' | 'lg'

type ModalProps = {
  open: boolean
  onClose: () => void
  /** Optional header title; omit for body-only modals */
  title?: ReactNode
  children: ReactNode
  size?: ModalSize
  /** Hide the X button in the header (backdrop click still closes) */
  hideCloseButton?: boolean
  className?: string
}

const sizeClass: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  hideCloseButton = false,
  className = '',
}: ModalProps) {
  const { theme } = useTheme()

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose])

  if (!open) return null

  const panelClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900 text-slate-100'
      : 'border-slate-200 bg-white text-slate-900'

  const headerClass =
    theme === 'dark' ? 'border-slate-800' : 'border-slate-200'

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-500'

  const closeBtnClass =
    theme === 'dark'
      ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={`relative z-10 flex max-h-[min(90dvh,640px)] w-full flex-col overflow-hidden rounded-2xl border shadow-xl ${sizeClass[size]} ${panelClass} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || !hideCloseButton) && (
          <div
            className={`flex shrink-0 items-start justify-between gap-3 border-b px-5 py-4 ${headerClass}`}
          >
            {title ? (
              <h2 id="modal-title" className="text-lg font-semibold tracking-tight">
                {title}
              </h2>
            ) : (
              <span />
            )}

            {!hideCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${closeBtnClass}`}
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
