import { Eye } from 'lucide-react'
import { useState, type MouseEvent } from 'react'
import CopyBox from './CopyBox'
import Modal from './Modal'
import { useTheme } from '../../context/ThemeContext'

type ProofUrlFieldProps = {
  proofUrl: string
  /** Modal title; defaults to "Proof preview" */
  previewTitle?: string
  maxLength?: number
  className?: string
}

function isImageProofUrl(url: string) {
  return /\.(jpe?g|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url)
}

function isPdfProofUrl(url: string) {
  return /\.pdf(\?.*)?$/i.test(url)
}

function ProofPreviewBody({ proofUrl }: { proofUrl: string }) {
  const { theme } = useTheme()
  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
  const urlBoxClass =
    theme === 'dark'
      ? 'border-slate-700 bg-slate-950/50'
      : 'border-slate-200 bg-slate-50'

  if (isImageProofUrl(proofUrl)) {
    return (
      <img
        src={proofUrl}
        alt="Activity proof"
        className="mx-auto max-h-[min(65vh,520px)] w-full rounded-lg object-contain"
      />
    )
  }

  if (isPdfProofUrl(proofUrl)) {
    return (
      <iframe
        src={proofUrl}
        title="Activity proof PDF"
        className={`h-[min(65vh,520px)] w-full rounded-lg border ${urlBoxClass}`}
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <p className={`text-sm ${mutedClass}`}>
        Preview is not available for this file type. Open the link below:
      </p>
      <p
        className={`break-all rounded-lg border px-3 py-2.5 text-sm ${urlBoxClass}`}
      >
        <a
          href={proofUrl}
          target="_blank"
          rel="noreferrer"
          className="text-amber-600 underline hover:text-amber-500 dark:text-amber-400"
        >
          {proofUrl}
        </a>
      </p>
    </div>
  )
}

export default function ProofUrlField({
  proofUrl,
  previewTitle = 'Proof preview',
  maxLength = 18,
  className = '',
}: ProofUrlFieldProps) {
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)

  const iconBtnClass =
    theme === 'dark'
      ? 'text-amber-400 hover:bg-amber-500/15'
      : 'text-amber-600 hover:bg-amber-500/10'

  const openPreview = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setOpen(true)
  }

  return (
    <>
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        <CopyBox value={proofUrl} maxLength={maxLength} />
        <button
          type="button"
          onClick={openPreview}
          title="View proof"
          aria-label="View proof"
          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors ${iconBtnClass}`}
        >
          <Eye size={14} />
        </button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={previewTitle} size="lg">
        <ProofPreviewBody proofUrl={proofUrl} />
      </Modal>
    </>
  )
}
