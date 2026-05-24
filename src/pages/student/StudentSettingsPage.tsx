import {
  GraduationCap,
  Hash,
  Loader2,
  Pencil,
  Phone,
  Save,
  Settings,
  User,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Button from '../../components/uis/Button'
import FileInput from '../../components/uis/FileInput'
import Input from '../../components/uis/Input'
import SettingsSection from '../../components/uis/SettingsSection'
import ThemeToggle from '../../components/uis/ThemeToggle'
import { useStudentAuth } from '../../context/StudentAuthContext'
import { useTheme } from '../../context/ThemeContext'
import { patchStudentMe } from '../../services/student'
import { generateSignatureUrl } from '../../utils/generateProofUrl'
import { getErrorMessage } from '../../utils/getErrorMessage'

type ProfileForm = {
  name: string
  phoneNo: string
  signature: string
  rollNo: string
  admissionYear: string
}

function hasSignature(value: string | null | undefined) {
  return Boolean(value?.trim())
}

function DetailRow({
  icon: Icon,
  label,
  value,
  theme,
}: {
  icon: typeof User
  label: string
  value: string
  theme: 'light' | 'dark'
}) {
  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
  const rowClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-950/30'
      : 'border-slate-100 bg-slate-50/80'

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${rowClass}`}
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-500/15 text-amber-500">
        <Icon size={16} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-xs font-medium uppercase tracking-wide ${mutedClass}`}>
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium wrap-break-word">{value || '—'}</p>
      </div>
    </div>
  )
}

function toProfileForm(student: {
  name: string
  phoneNo: string | null
  signature?: string | null
  rollNo: string
  admissionYear: string
}): ProfileForm {
  return {
    name: student.name,
    phoneNo: student.phoneNo ?? '',
    signature: student.signature ?? '',
    rollNo: student.rollNo,
    admissionYear: student.admissionYear,
  }
}

export default function StudentSettingsPage() {
  const { theme } = useTheme()
  const { user, updateUser } = useStudentAuth()
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<ProfileForm>({
    name: '',
    phoneNo: '',
    signature: '',
    rollNo: '',
    admissionYear: '',
  })
  const [draft, setDraft] = useState<ProfileForm>({
    name: '',
    phoneNo: '',
    signature: '',
    rollNo: '',
    admissionYear: '',
  })

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const signatureBoxClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-950/30'
      : 'border-slate-100 bg-slate-50/80'

  useEffect(() => {
    if (!user) return
    const next = toProfileForm(user)
    setProfile(next)
    if (!isEditing) setDraft(next)
  }, [user, isEditing])

  const startEditing = () => {
    setDraft({ ...profile })
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setDraft({ ...profile })
    setIsEditing(false)
  }

  const handleSave = async () => {
    const name = draft.name.trim()
    const phoneNo = draft.phoneNo.trim()
    const signature = draft.signature.trim()

    if (!name || !phoneNo) {
      toast.error('Name and phone number are required')
      return
    }

    if (!signature) {
      toast.error('Please upload a signature image before saving')
      return
    }

    setSaving(true)
    try {
      const updated = await patchStudentMe({ name, phoneNo, signature })
      const next = toProfileForm(updated)
      setProfile(next)
      setDraft(next)
      updateUser({
        name: updated.name,
        phoneNo: updated.phoneNo,
        signature: updated.signature,
      })
      setIsEditing(false)
      toast.success('Profile updated')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update profile'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
            <Settings size={16} aria-hidden />
          </div>
          <h1 className="text-base font-semibold tracking-tight sm:text-lg">Settings</h1>
        </div>
        <p className={`mt-1 text-sm ${mutedClass}`}>
          Manage your profile and application preferences.
        </p>
      </div>

      {!user ? (
        <div
          className={`flex items-center justify-center rounded-md border py-16 shadow-sm ${
            theme === 'dark'
              ? 'border-slate-800 bg-slate-900/80'
              : 'border-slate-200 bg-white'
          }`}
        >
          <Loader2 size={28} className="animate-spin text-amber-500" />
        </div>
      ) : (
        <div className="space-y-5">
          <SettingsSection
            title="Personal details"
            description="Your name, contact number, and signature used on records."
            action={
              !isEditing ? (
                <Button
                  type="button"
                  variant="secondary"
                  icon={Pencil}
                  onClick={startEditing}
                >
                  Edit
                </Button>
              ) : undefined
            }
          >
            {!isEditing ? (
              <div className="space-y-3">
                <DetailRow
                  icon={User}
                  label="Full name"
                  value={profile.name}
                  theme={theme}
                />
                <DetailRow
                  icon={Hash}
                  label="Roll number"
                  value={profile.rollNo}
                  theme={theme}
                />
                <DetailRow
                  icon={GraduationCap}
                  label="Admission year"
                  value={profile.admissionYear}
                  theme={theme}
                />
                <DetailRow
                  icon={Phone}
                  label="Phone number"
                  value={profile.phoneNo}
                  theme={theme}
                />
                <div
                  className={`rounded-lg border px-4 py-3 ${signatureBoxClass}`}
                >
                  <p
                    className={`text-xs font-medium uppercase tracking-wide ${mutedClass}`}
                  >
                    Signature
                  </p>
                  {hasSignature(profile.signature) ? (
                    <img
                      src={profile.signature}
                      alt="Student signature"
                      className="mt-2 h-20 w-auto max-w-full rounded-md border border-slate-200 object-contain dark:border-slate-700"
                    />
                  ) : (
                    <p className={`mt-2 text-sm ${mutedClass}`}>
                      No signature uploaded
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  label="Full name"
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, name: event.target.value }))
                  }
                />
                <Input label="Roll number" value={draft.rollNo} readOnly disabled />
                <Input
                  label="Admission year"
                  value={draft.admissionYear}
                  readOnly
                  disabled
                />
                <Input
                  label="Phone number"
                  value={draft.phoneNo}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      phoneNo: event.target.value,
                    }))
                  }
                />

                {hasSignature(draft.signature) && (
                  <div className={`rounded-lg border px-4 py-3 ${signatureBoxClass}`}>
                    <p
                      className={`text-xs font-medium uppercase tracking-wide ${mutedClass}`}
                    >
                      Current signature
                    </p>
                    <img
                      src={draft.signature}
                      alt="Student signature preview"
                      className="mt-2 h-20 w-auto max-w-full rounded-md border border-slate-200 object-contain dark:border-slate-700"
                    />
                  </div>
                )}

                <FileInput
                  label={
                    hasSignature(draft.signature)
                      ? 'Change signature'
                      : 'Upload signature'
                  }
                  value={hasSignature(draft.signature) ? draft.signature : null}
                  onChange={(url) =>
                    setDraft((current) => ({ ...current, signature: url ?? '' }))
                  }
                  onUpload={generateSignatureUrl}
                  accept="image/png,.png"
                  allowedMimeTypes={['image/png']}
                  maxFiles={1}
                  maxSizeBytes={2 * 1024 * 1024}
                />

                <div className="flex flex-col gap-2 border-t border-inherit pt-4 sm:flex-row">
                  <Button
                    type="button"
                    variant="primary"
                    icon={Save}
                    loading={saving}
                    disabled={saving}
                    fullWidth
                    onClick={() => void handleSave()}
                  >
                    Save changes
                  </Button>
                  <Button
                    type="button"
                    variant="cancel"
                    icon={X}
                    disabled={saving}
                    fullWidth
                    onClick={cancelEditing}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </SettingsSection>

          <SettingsSection
            title="Appearance"
            description="Choose how the dashboard looks on your device."
          >
            <div className="space-y-3">
              <p
                className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}
              >
                Theme
              </p>
              <ThemeToggle variant="settings" />
            </div>
          </SettingsSection>
        </div>
      )}
    </div>
  )
}
