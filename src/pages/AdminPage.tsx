import axios from 'axios'
import { Building2, Loader2, Plus } from 'lucide-react'
import { type ChangeEvent, type FormEvent, useState } from 'react'
import { toast } from 'sonner'
import Input from '../components/uis/Input'
import { useTheme } from '../context/ThemeContext'
import {
  createInstitute,
  type CreateInstituteInput,
} from '../services/Institute.service'

type FormState = CreateInstituteInput

const initialForm: FormState = {
  name: '',
  instituteCode: '',
  location: '',
  contactDetails: '',
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] }
    if (Array.isArray(data?.message)) return data.message.join(', ')
    if (typeof data?.message === 'string') return data.message
  }
  if (error instanceof Error) return error.message
  return 'Failed to create institute. Please try again.'
}

function AdminPage() {
  const { theme } = useTheme()
  const [form, setForm] = useState<FormState>(initialForm)
  const [loading, setLoading] = useState(false)

  const mainClass =
    theme === 'dark'
      ? 'bg-slate-950 text-slate-100'
      : 'bg-slate-50 text-slate-900'

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white/80'

  const subtitleClass =
    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const buttonClass =
    theme === 'dark'
      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
      : 'bg-amber-500 text-white hover:bg-amber-600'

  const handleChange =
    (field: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (
      !form.name.trim() ||
      !form.instituteCode.trim() ||
      !form.location.trim() ||
      !form.contactDetails.trim()
    ) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const institute = await createInstitute({
        name: form.name.trim(),
        instituteCode: form.instituteCode.trim(),
        location: form.location.trim(),
        contactDetails: form.contactDetails.trim(),
      })
      toast.success(`Institute "${institute.name}" created successfully`)
      setForm(initialForm)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center px-6 py-24 transition-colors ${mainClass}`}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border p-8 shadow-xl backdrop-blur transition-colors ${cardClass}`}
      >
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-amber-500">
              Admin
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Create Institute
            </h1>
            <p className={`mt-1 text-sm ${subtitleClass}`}>
              Add a new institute to the system.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Institute name"
            name="name"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="e.g. MAAR Academy"
            disabled={loading}
            required
          />
          <Input
            label="Institute code"
            name="instituteCode"
            value={form.instituteCode}
            onChange={handleChange('instituteCode')}
            placeholder="e.g. MAAR001"
            hint="Must be unique across all institutes"
            disabled={loading}
            required
          />
          <Input
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange('location')}
            placeholder="City, state"
            disabled={loading}
            required
          />
          <Input
            label="Contact details"
            name="contactDetails"
            value={form.contactDetails}
            onChange={handleChange('contactDetails')}
            placeholder="Phone or email"
            disabled={loading}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${buttonClass}`}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <Plus size={18} />
                Create Institute
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  )
}

export default AdminPage
