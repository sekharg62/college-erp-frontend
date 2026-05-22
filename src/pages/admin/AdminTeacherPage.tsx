import axios from 'axios'
import {
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import Input from '../../components/uis/Input'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useTheme } from '../../context/ThemeContext'
import { getDepartments, type Department } from '../../services/Department.service'
import {
  createTeacher,
  deleteTeacher,
  getTeachers,
  patchTeacher,
  type Teacher,
} from '../../services/teacher'

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

type TeacherFormState = {
  departmentId: string
  name: string
  phoneNo: string
  password: string
}

const emptyForm: TeacherFormState = {
  departmentId: '',
  name: '',
  phoneNo: '',
  password: '',
}

export default function AdminTeacherPage() {
  const { theme } = useTheme()
  const { user } = useAdminAuth()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<TeacherFormState>(emptyForm)

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white'

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const primaryBtnClass =
    theme === 'dark'
      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
      : 'bg-amber-500 text-white hover:bg-amber-600'

  const ghostBtnClass =
    theme === 'dark'
      ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
      : 'border-slate-300 text-slate-700 hover:bg-slate-100'

  const tableHeadClass =
    theme === 'dark' ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-600'

  const tableRowClass =
    theme === 'dark' ? 'border-slate-800' : 'border-slate-200'

  const selectClass =
    theme === 'dark'
      ? 'border-slate-700 bg-slate-950/60 text-slate-100 focus:border-violet-500 focus:ring-violet-500/25'
      : 'border-slate-300 bg-white text-slate-900 focus:border-violet-500 focus:ring-violet-500/20'

  const labelClass = theme === 'dark' ? 'text-slate-300' : 'text-slate-700'

  const departmentNameById = useCallback(
    (id: string) => departments.find((d) => d.id === id)?.name ?? id,
    [departments],
  )

  const fetchData = useCallback(async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const [teacherList, departmentList] = await Promise.all([
        getTeachers(user.id),
        getDepartments(),
      ])
      setTeachers(teacherList)
      setDepartments(departmentList)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load teachers'))
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (teacher: Teacher) => {
    setEditingId(teacher.id)
    setForm({
      departmentId: teacher.departmentId,
      name: teacher.name,
      phoneNo: teacher.phoneNo,
      password: '',
    })
    setShowForm(true)
  }

  const updateField = (field: keyof TeacherFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const name = form.name.trim()
    const phoneNo = form.phoneNo.trim()
    const departmentId = form.departmentId
    const password = form.password

    if (!name) {
      toast.error('Teacher name is required')
      return
    }
    if (!phoneNo) {
      toast.error('Phone number is required')
      return
    }
    if (!departmentId) {
      toast.error('Department is required')
      return
    }
    if (!editingId && !password) {
      toast.error('Password is required for new teachers')
      return
    }

    if (!user?.id || !user?.instituteId) {
      toast.error('Admin session is invalid. Please log in again.')
      return
    }

    setSubmitting(true)
    try {
      if (editingId) {
        const patch: {
          name: string
          phoneNo: string
          departmentId: string
          password?: string
        } = { name, phoneNo, departmentId }
        if (password) patch.password = password
        await patchTeacher(editingId, patch)
        toast.success('Teacher updated')
      } else {
        await createTeacher({
          instituteId: user.instituteId,
          adminId: user.id,
          departmentId,
          name,
          phoneNo,
          password,
        })
        toast.success('Teacher created')
      }
      resetForm()
      await fetchData()
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          editingId ? 'Failed to update teacher' : 'Failed to create teacher',
        ),
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (teacher: Teacher) => {
    const confirmed = window.confirm(
      `Delete teacher "${teacher.name}"? This cannot be undone.`,
    )
    if (!confirmed) return

    try {
      await deleteTeacher(teacher.id)
      toast.success('Teacher deleted')
      if (editingId === teacher.id) resetForm()
      await fetchData()
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete teacher'))
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
            <Users size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Teachers
            </h1>
            <p className={`mt-1 text-sm ${mutedClass}`}>
              Create, edit, and manage teachers in your institute.
            </p>
          </div>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={openCreate}
            disabled={departments.length === 0 && !loading}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${primaryBtnClass}`}
          >
            <Plus size={18} />
            Add Teacher
          </button>
        )}
      </div>

      {!loading && departments.length === 0 && (
        <p className={`mb-4 text-sm ${mutedClass}`}>
          Create at least one department before adding teachers.
        </p>
      )}

      {showForm && (
        <div className={`mb-6 rounded-2xl border p-6 shadow-sm ${cardClass}`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editingId ? 'Edit Teacher' : 'New Teacher'}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              aria-label="Close form"
              className={mutedClass}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="departmentId" className={`text-sm font-medium ${labelClass}`}>
                Department
              </label>
              <select
                id="departmentId"
                name="departmentId"
                value={form.departmentId}
                onChange={(e) => updateField('departmentId', e.target.value)}
                disabled={submitting || departments.length === 0}
                required
                className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${selectClass}`}
              >
                <option value="">Select department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Full name"
              name="name"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g. John Doe"
              disabled={submitting}
              required
            />

            <Input
              label="Phone number"
              name="phoneNo"
              type="tel"
              value={form.phoneNo}
              onChange={(e) => updateField('phoneNo', e.target.value)}
              placeholder="e.g. 9876543210"
              disabled={submitting}
              required
            />

            <Input
              className="sm:col-span-2"
              label={editingId ? 'New password (optional)' : 'Password'}
              name="password"
              type="password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              placeholder={editingId ? 'Leave blank to keep current' : 'Set login password'}
              disabled={submitting}
              required={!editingId}
              hint={editingId ? 'Only fill in to change the password.' : undefined}
            />

            <div className="flex gap-2 sm:col-span-2 sm:justify-end">
              <button
                type="button"
                onClick={resetForm}
                disabled={submitting}
                className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${ghostBtnClass}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${primaryBtnClass}`}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving…
                  </>
                ) : editingId ? (
                  'Update'
                ) : (
                  'Create'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={`overflow-hidden rounded-2xl border shadow-sm ${cardClass}`}>
        {loading ? (
          <div className={`flex items-center justify-center gap-2 py-16 ${mutedClass}`}>
            <Loader2 size={22} className="animate-spin" />
            Loading teachers…
          </div>
        ) : teachers.length === 0 ? (
          <div className={`py-16 text-center text-sm ${mutedClass}`}>
            No teachers yet. Click &quot;Add Teacher&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead>
                <tr className={`border-b ${tableRowClass} ${tableHeadClass}`}>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className={`border-b last:border-b-0 ${tableRowClass}`}
                  >
                    <td className="px-4 py-3 font-medium">{teacher.name}</td>
                    <td className={`px-4 py-3 ${mutedClass}`}>{teacher.phoneNo}</td>
                    <td className={`px-4 py-3 ${mutedClass}`}>
                      {departmentNameById(teacher.departmentId)}
                    </td>
                    <td className={`px-4 py-3 ${mutedClass}`}>
                      {formatDate(teacher.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(teacher)}
                          title="Edit"
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${ghostBtnClass}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(teacher)}
                          title="Delete"
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                            theme === 'dark'
                              ? 'border-red-900/50 text-red-400 hover:bg-red-500/10'
                              : 'border-red-200 text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
