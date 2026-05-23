import axios from 'axios'
import { GraduationCap, Loader2, Plus, Upload, X } from 'lucide-react'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Button from '../../components/uis/Button'
import Input from '../../components/uis/Input'
import { useTeacherAuth } from '../../context/TeacherAuthContext'
import { useTheme } from '../../context/ThemeContext'
import {
  createStudent,
  getStudents,
  type Student,
} from '../../services/student'

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] }
    if (Array.isArray(data?.message)) return data.message.join(', ')
    if (typeof data?.message === 'string') return data.message
  }
  if (error instanceof Error) return error.message
  return fallback
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

type StudentFormState = {
  name: string
  rollNo: string
  admissionYear: string
  password: string
  phoneNo: string
}

const emptyForm: StudentFormState = {
  name: '',
  rollNo: '',
  admissionYear: '',
  password: '',
  phoneNo: '',
}

export default function TeacherStudentsPage() {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const { user } = useTeacherAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<StudentFormState>(emptyForm)

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white'

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const tableHeadClass =
    theme === 'dark' ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-600'

  const tableRowClass =
    theme === 'dark' ? 'border-slate-800' : 'border-slate-200'

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getStudents()
      setStudents(data)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load students'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchStudents()
  }, [fetchStudents])

  const resetForm = () => {
    setForm(emptyForm)
    setShowForm(false)
  }

  const openCreate = () => {
    setForm(emptyForm)
    setShowForm(true)
  }

  const updateField = (field: keyof StudentFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const name = form.name.trim()
    const rollNo = form.rollNo.trim()
    const admissionYear = form.admissionYear.trim()
    const password = form.password
    const phoneNo = form.phoneNo.trim()
    if (!name) {
      toast.error('Student name is required')
      return
    }
    if (!rollNo) {
      toast.error('Roll number is required')
      return
    }
    if (!admissionYear) {
      toast.error('Admission year is required')
      return
    }
    if (!password) {
      toast.error('Password is required')
      return
    }

    if (!user?.instituteId || !user?.adminId) {
      toast.error('Teacher session is invalid. Please log in again.')
      return
    }

    setSubmitting(true)
    try {
      await createStudent({
        instituteId: user.instituteId,
        adminId: user.adminId,
        name,
        rollNo,
        admissionYear,
        password,
        phoneNo,
      })
      toast.success('Student created')
      resetForm()
      await fetchStudents()
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to create student'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
            <GraduationCap size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Students
            </h1>
            <p className={`mt-1 text-sm ${mutedClass}`}>
              Create and view students assigned to you.
            </p>
          </div>
        </div>

        {!showForm && (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              icon={Upload}
              onClick={() => navigate('/teacher/dashboard/students/bulk')}
            >
              Bulk add
            </Button>
            <Button type="button" variant="primary" icon={Plus} onClick={openCreate}>
              Add Student
            </Button>
          </div>
        )}
      </div>

      {showForm && (
        <div className={`mb-6 rounded-xl border p-6 shadow-sm ${cardClass}`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">New Student</h2>
            <Button
              type="button"
              variant="cancel"
              aria-label="Close form"
              className="!px-2.5 !py-2.5"
              onClick={resetForm}
            >
              <X size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full name"
              name="name"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g. Rahul Sharma"
              disabled={submitting}
              required
            />

            <Input
              label="Roll number"
              name="rollNo"
              value={form.rollNo}
              onChange={(e) => updateField('rollNo', e.target.value)}
              placeholder="e.g. CS2025001"
              disabled={submitting}
              required
            />

            <Input
              label="Admission year"
              name="admissionYear"
              value={form.admissionYear}
              onChange={(e) => updateField('admissionYear', e.target.value)}
              placeholder="e.g. 2025-26"
              disabled={submitting}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              placeholder="Set student login password"
              disabled={submitting}
              required
              hint="Minimum 6 characters"
            />
            <Input
              label="Phone number"
              name="phoneNo"
              type="tel"
              value={form.phoneNo}
              onChange={(e) => updateField('phoneNo', e.target.value)}
              placeholder="e.g. 9876543210"
              disabled={submitting}
            />

            <div className="flex gap-2 sm:col-span-2 sm:justify-end">
              <Button
                type="button"
                variant="cancel"
                disabled={submitting}
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
              >
                {submitting ? 'Saving…' : 'Create'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className={`overflow-hidden rounded-xl border shadow-sm ${cardClass}`}>
        {loading ? (
          <div className={`flex items-center justify-center gap-2 py-16 ${mutedClass}`}>
            <Loader2 size={22} className="animate-spin" />
            Loading students…
          </div>
        ) : students.length === 0 ? (
          <div className={`py-16 text-center text-sm ${mutedClass}`}>
            No students yet. Click &quot;Add Student&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead>
                <tr className={`border-b ${tableRowClass} ${tableHeadClass}`}>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Roll No</th>
                  <th className="px-4 py-3 font-medium">Admission Year</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className={`border-b last:border-b-0 ${tableRowClass}`}
                  >
                    <td className="px-4 py-3 font-medium">{student.name}</td>
                    <td className={`px-4 py-3 ${mutedClass}`}>{student.rollNo}</td>
                    <td className={`px-4 py-3 ${mutedClass}`}>
                      {student.admissionYear}
                    </td>
                    <td className={`px-4 py-3 ${mutedClass}`}>
                      {formatDate(student.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
