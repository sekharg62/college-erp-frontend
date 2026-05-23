import axios from 'axios'
import { Loader2, Pencil, Plus, Save, Trash2, Users, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import Button from '../../components/uis/Button'
import CustomDropdown from '../../components/uis/CustomDropdown'
import Input from '../../components/uis/Input'
import TableListToolbar from '../../components/uis/TableListToolbar'
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
  const [searchQuery, setSearchQuery] = useState('')

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white'

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const tableHeadClass =
    theme === 'dark' ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-600'

  const tableRowClass =
    theme === 'dark' ? 'border-slate-800' : 'border-slate-200'

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

  const filteredTeachers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return teachers

    return teachers.filter((teacher) => {
      const departmentName = departmentNameById(teacher.departmentId).toLowerCase()
      return (
        teacher.name.toLowerCase().includes(query) ||
        teacher.phoneNo.toLowerCase().includes(query) ||
        departmentName.includes(query)
      )
    })
  }, [teachers, searchQuery, departmentNameById])

  const totalCount = teachers.length

  const departmentOptions = useMemo(
    () =>
      departments.map((department) => ({
        value: department.id,
        label: department.name,
      })),
    [departments],
  )

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
          <Button
            type="button"
            variant="primary"
            icon={Plus}
            onClick={openCreate}
            disabled={departments.length === 0 && !loading}
          >
            Add Teacher
          </Button>
        )}
      </div>

      {!loading && departments.length === 0 && (
        <p className={`mb-4 text-sm ${mutedClass}`}>
          Create at least one department before adding teachers.
        </p>
      )}

      {showForm && (
        <div className={`mb-6 rounded-md border p-6 shadow-sm ${cardClass}`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editingId ? 'Edit Teacher' : 'New Teacher'}
            </h2>
            <Button
              type="button"
              variant="cancel"
              icon={X}
              onClick={resetForm}
              aria-label="Close form"
              className="!px-2.5"
            />
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <CustomDropdown
              id="departmentId"
              label="Department"
              value={form.departmentId}
              onChange={(departmentId) => updateField('departmentId', departmentId)}
              options={departmentOptions}
              placeholder="Select department"
              searchPlaceholder="Search departments…"
              emptyMessage="No departments yet. Create one first."
              disabled={submitting || departments.length === 0}
              required
            />

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
              <Button
                type="button"
                variant="cancel"
                icon={X}
                onClick={resetForm}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                icon={editingId ? Save : Plus}
                loading={submitting}
              >
                {editingId ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className={`overflow-hidden rounded-md border shadow-sm ${cardClass}`}>
        {loading ? (
          <div className={`flex items-center justify-center gap-2 py-16 ${mutedClass}`}>
            <Loader2 size={22} className="animate-spin text-amber-500" />
            Loading teachers…
          </div>
        ) : (
          <>
            <TableListToolbar
              totalCount={totalCount}
              filteredCount={filteredTeachers.length}
              itemLabel="teacher"
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search name, phone, department…"
            />

            {totalCount === 0 ? (
              <div className={`py-16 text-center text-sm ${mutedClass}`}>
                No teachers yet. Click &quot;Add Teacher&quot; to create one.
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className={`py-16 text-center text-sm ${mutedClass}`}>
                No teachers match your search.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[40rem] text-left text-sm">
                  <thead>
                    <tr className={`border-b ${tableRowClass} ${tableHeadClass}`}>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Phone</th>
                      <th className="px-4 py-3 font-semibold">Department</th>
                      <th className="px-4 py-3 font-semibold">Created</th>
                      <th className="px-4 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeachers.map((teacher) => (
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
                            <Button
                              type="button"
                              variant="secondary"
                              icon={Pencil}
                              onClick={() => openEdit(teacher)}
                              title="Edit"
                              aria-label="Edit teacher"
                              className="h-9! w-9! px-0!"
                            />
                            <Button
                              type="button"
                              variant="danger"
                              icon={Trash2}
                              onClick={() => void handleDelete(teacher)}
                              title="Delete"
                              aria-label="Delete teacher"
                              className="h-9! w-9! px-0!"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
