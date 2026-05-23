import { MessageCircle } from 'lucide-react'
import { useEffect, useState, type MouseEvent } from 'react'
import { toast } from 'sonner'
import Button from './Button'
import Modal from './Modal'
import { useTheme } from '../../context/ThemeContext'
import {
  buildActivityIssueWhatsAppMessage,
  buildActivitySubmissionWhatsAppMessage,
  normalizePhoneForWhatsApp,
  openWhatsAppChat,
} from '../../utils/whatsapp'

type ActivityWhatsAppButtonProps = {
  studentName: string
  phoneNo: string | null
  activityId: string
  subActivityId: string
  status?: string
  points?: number
  className?: string
}

export default function ActivityWhatsAppButton({
  studentName,
  phoneNo,
  activityId,
  subActivityId,
  status,
  points,
  className = '',
}: ActivityWhatsAppButtonProps) {
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  const hasPhone = normalizePhoneForWhatsApp(phoneNo) !== null

  const messageInput = {
    studentName,
    activityId,
    subActivityId,
    status,
    points,
  }

  useEffect(() => {
    if (!open) return
    setMessage(buildActivitySubmissionWhatsAppMessage(messageInput))
  }, [open, studentName, activityId, subActivityId, status, points])

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
  const inputClass =
    theme === 'dark'
      ? 'border-slate-700 bg-slate-950/60 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/25'
      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20'

  const iconBtnClass = hasPhone
    ? theme === 'dark'
      ? 'text-emerald-400 hover:bg-emerald-500/15'
      : 'text-emerald-600 hover:bg-emerald-500/10'
    : theme === 'dark'
      ? 'cursor-not-allowed text-slate-600'
      : 'cursor-not-allowed text-slate-300'

  const openModal = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    if (!hasPhone) {
      toast.error('Student phone number is missing or invalid')
      return
    }
    setOpen(true)
  }

  const handleSend = () => {
    if (!message.trim()) {
      toast.error('Message cannot be empty')
      return
    }
    if (!openWhatsAppChat(phoneNo, message.trim())) {
      toast.error('Could not open WhatsApp — check the phone number')
      return
    }
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        disabled={!hasPhone}
        title={hasPhone ? 'Send WhatsApp message' : 'No valid phone number'}
        aria-label="Send WhatsApp message"
        className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors ${iconBtnClass} ${className}`}
      >
        <MessageCircle size={14} />
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="WhatsApp message"
        size="md"
      >
        <div className="flex flex-col gap-4">
          <p className={`text-sm ${mutedClass}`}>
            To: <span className="font-medium text-slate-700 dark:text-slate-200">{studentName}</span>
            {phoneNo && (
              <>
                {' '}
                · <span className="tabular-nums">{phoneNo}</span>
              </>
            )}
          </p>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="whatsapp-message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="whatsapp-message"
              rows={12}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className={`w-full resize-y rounded-md border px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 ${inputClass}`}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setMessage(buildActivitySubmissionWhatsAppMessage(messageInput))
              }
            >
              Reset submission text
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setMessage(buildActivityIssueWhatsAppMessage(messageInput))
              }
            >
              Use issue template
            </Button>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            <Button type="button" variant="cancel" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="primary" onClick={handleSend}>
              Send on WhatsApp
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
