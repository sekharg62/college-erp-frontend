import axios from 'axios'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Loader2,
  UserPlus,
} from 'lucide-react'
import { type ChangeEvent, type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import Input from '../components/uis/Input'
import { useTheme } from '../context/ThemeContext'
import { createAdmin, type CreateAdminInput } from '../services/Admin.service'
import {
  createInstitute,
  type CreateInstituteInput,
} from '../services/Institute.service'

type InstituteFormState = CreateInstituteInput

type AdminFormState = Omit<CreateAdminInput, 'instituteId'>

const initialInstituteForm: InstituteFormState = {
  name: '',
  instituteCode: '',
  location: '',
  contactDetails: '',
}

const initialAdminForm: AdminFormState = {
  name: '',
  phoneNo: '',
  password: '',
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] }
    if (Array.isArray(data?.message)) return data.message.join(', ')
    if (typeof data?.message === 'string') return data.message
  }
  if (error instanceof Error) return error.message
  return fallback
}

function AdminPage() {
  const { theme } = useTheme()
  const [step, setStep] = useState<1 | 2>(1)
  const [instituteId, setInstituteId] = useState<string | null>(null)
  const [instituteName, setInstituteName] = useState('')
  const [instituteForm, setInstituteForm] =
    useState<InstituteFormState>(initialInstituteForm)
  const [adminForm, setAdminForm] = useState<AdminFormState>(initialAdminForm)
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

  const primaryBtnClass =
    theme === 'dark'
      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
      : 'bg-amber-500 text-white hover:bg-amber-600'

  const secondaryBtnClass =
    theme === 'dark'
      ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
      : 'border-slate-300 text-slate-700 hover:bg-slate-100'

  const linkClass =
    theme === 'dark'
      ? 'text-amber-400 hover:text-amber-300'
      : 'text-amber-600 hover:text-amber-700'

  const handleInstituteChange =
    (field: keyof InstituteFormState) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setInstituteForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleAdminChange =
    (field: keyof AdminFormState) => (e: ChangeEvent<HTMLInputElement>) => {
      setAdminForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleInstituteNext = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (
      !instituteForm.name.trim() ||
      !instituteForm.instituteCode.trim() ||
      !instituteForm.location.trim() ||
      !instituteForm.contactDetails.trim()
    ) {
      toast.error('Please fill in all institute fields')
      return
    }

    setLoading(true)
    try {
      const institute = await createInstitute({
        name: instituteForm.name.trim(),
        instituteCode: instituteForm.instituteCode.trim(),
        location: instituteForm.location.trim(),
        contactDetails: instituteForm.contactDetails.trim(),
      })
      setInstituteId(institute.id)
      setInstituteName(institute.name)
      setStep(2)
      toast.success(`Institute "${institute.name}" created`)
    } catch (error) {
      toast.error(
        getErrorMessage(error, 'Failed to create institute. Please try again.'),
      )
    } finally {
      setLoading(false)
    }
  }

  const handleAdminSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!instituteId) {
      toast.error('Institute not found. Please go back and create institute first.')
      return
    }

    if (
      !adminForm.name.trim() ||
      !adminForm.phoneNo.trim() ||
      !adminForm.password.trim()
    ) {
      toast.error('Please fill in all admin fields')
      return
    }

    if (adminForm.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const admin = await createAdmin({
        instituteId,
        name: adminForm.name.trim(),
        phoneNo: adminForm.phoneNo.trim(),
        password: adminForm.password,
      })
      toast.success(`Admin "${admin.name}" created for ${instituteName}`)
      setAdminForm(initialAdminForm)
      setStep(1)
      setInstituteId(null)
      setInstituteName('')
      setInstituteForm(initialInstituteForm)
    } catch (error) {
      toast.error(
        getErrorMessage(error, 'Failed to create admin. Please try again.'),
      )
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setStep(1)
    setAdminForm(initialAdminForm)
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
            {step === 1 ? <Building2 size={24} /> : <UserPlus size={24} />}
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-amber-500">
              Admin · Step {step} of 2
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              {step === 1 ? 'Create Institute' : 'Create Admin'}
            </h1>
            <p className={`mt-1 text-sm ${subtitleClass}`}>
              {step === 1
                ? 'Add a new institute, then set up its admin.'
                : `Add an admin for ${instituteName}.`}
            </p>
          </div>
        </div>

        {step === 1 ? (
          <form onSubmit={handleInstituteNext} className="flex flex-col gap-4">
            <Input
              label="Institute name"
              name="name"
              value={instituteForm.name}
              onChange={handleInstituteChange('name')}
              placeholder="e.g. MAAR Academy"
              disabled={loading}
              required
            />
            <Input
              label="Institute code"
              name="instituteCode"
              value={instituteForm.instituteCode}
              onChange={handleInstituteChange('instituteCode')}
              placeholder="e.g. MAAR001"
              hint="Must be unique across all institutes"
              disabled={loading}
              required
            />
            <Input
              label="Location"
              name="location"
              value={instituteForm.location}
              onChange={handleInstituteChange('location')}
              placeholder="City, state"
              disabled={loading}
              required
            />
            <Input
              label="Contact details"
              name="contactDetails"
              value={instituteForm.contactDetails}
              onChange={handleInstituteChange('contactDetails')}
              placeholder="Phone or email"
              disabled={loading}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${primaryBtnClass}`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating institute…
                </>
              ) : (
                <>
                  Next
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className={`text-center text-sm ${subtitleClass}`}>
              Already a member?{' '}
              <Link
                to="/admin/login"
                className={`font-medium hover:underline ${linkClass}`}
              >
                Login
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleAdminSubmit} className="flex flex-col gap-4">
            <Input
              label="Admin name"
              name="name"
              value={adminForm.name}
              onChange={handleAdminChange('name')}
              placeholder="e.g. John Admin"
              disabled={loading}
              required
            />
            <Input
              label="Phone number"
              name="phoneNo"
              type="tel"
              value={adminForm.phoneNo}
              onChange={handleAdminChange('phoneNo')}
              placeholder="9876543210"
              disabled={loading}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={adminForm.password}
              onChange={handleAdminChange('password')}
              placeholder="Minimum 6 characters"
              hint="Minimum 6 characters"
              disabled={loading}
              required
            />

            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${secondaryBtnClass}`}
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${primaryBtnClass}`}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create Admin
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}

export default AdminPage
