import axios from 'axios'
import { BookOpen, Loader2, Pencil, Plus, Save, Sparkles, Trash2, X } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { toast } from 'sonner'
import Button from '../../components/uis/Button'
import CustomDropdown from '../../components/uis/CustomDropdown'
import Input from '../../components/uis/Input'
import TableListToolbar from '../../components/uis/TableListToolbar'
import { useTheme } from '../../context/ThemeContext'
import { getDepartments, type Department } from '../../services/Department.service'
import { getSemestersByDepartment, type Semester } from '../../services/Semester.service'
import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
  type CreateSubjectInput,
  type Subject,
} from '../../services/Subject.service'

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] }
    if (Array.isArray(data?.message)) return data.message.join(', ')
    if (typeof data?.message === 'string') return data.message
  }
  if (error instanceof Error) return error.message
  return fallback
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function generateSubjectSlug(name: string, subjectCode: string): string {
  const namePart = slugify(name)
  const codePart = slugify(subjectCode)
  if (!namePart && !codePart) return ''
  if (!namePart) return codePart
  if (!codePart) return namePart
  return `${namePart}-${codePart}`
}

type SubjectFormState = {
  departmentId: string
  semesterId: string
  name: string
  slug: string
  subjectCode: string
}

const emptyForm = (
  departmentId: string,
  semesterId: string,
): SubjectFormState => ({
  departmentId,
  semesterId,
  name: '',
  slug: '',
  subjectCode: '',
})

export default function SuperAdminSubjectPage() {
  const { theme } = useTheme()
  const [departments, setDepartments] = useState<Department[]>([])
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('')
  const [selectedSemesterId, setSelectedSemesterId] = useState('')
  const [loadingDepartments, setLoadingDepartments] = useState(true)
  const [loadingSemesters, setLoadingSemesters] = useState(false)
  const [loadingSubjects, setLoadingSubjects] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<SubjectFormState>(emptyForm('', ''))
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

  const departmentOptions = useMemo(
    () =>
      departments.map((department) => ({
        value: department.id,
        label: `${department.name} (${department.departmentCode})`,
      })),
    [departments],
  )

  const semesterOptions = useMemo(
    () =>
      [...semesters]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((semester) => ({
          value: semester.id,
          label: semester.label,
        })),
    [semesters],
  )

  const semesterLabelById = useCallback(
    (id: string) => semesters.find((s) => s.id === id)?.label ?? '—',
    [semesters],
  )

  const fetchDepartments = useCallback(async () => {
    setLoadingDepartments(true)
    try {
      const data = await getDepartments()
      setDepartments(data)
      setSelectedDepartmentId((prev) => prev || data[0]?.id || '')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load departments'))
    } finally {
      setLoadingDepartments(false)
    }
  }, [])

  const fetchSemesters = useCallback(async (departmentId: string) => {
    if (!departmentId) {
      setSemesters([])
      setSelectedSemesterId('')
      return
    }

    setLoadingSemesters(true)
    try {
      const data = await getSemestersByDepartment(departmentId)
      setSemesters(data)
      setSelectedSemesterId((prev) => {
        if (prev && data.some((s) => s.id === prev)) return prev
        return data[0]?.id || ''
      })
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load semesters'))
      setSemesters([])
      setSelectedSemesterId('')
    } finally {
      setLoadingSemesters(false)
    }
  }, [])

  const fetchSubjects = useCallback(
    async (departmentId: string, semesterId: string) => {
      if (!departmentId) {
        setSubjects([])
        return
      }

      setLoadingSubjects(true)
      try {
        const data = await getSubjects({
          departmentId,
          ...(semesterId ? { semesterId } : {}),
        })
        setSubjects(data)
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load subjects'))
        setSubjects([])
      } finally {
        setLoadingSubjects(false)
      }
    },
    [],
  )

  useEffect(() => {
    void fetchDepartments()
  }, [fetchDepartments])

  useEffect(() => {
    if (selectedDepartmentId) {
      void fetchSemesters(selectedDepartmentId)
    }
  }, [selectedDepartmentId, fetchSemesters])

  useEffect(() => {
    if (selectedDepartmentId) {
      void fetchSubjects(selectedDepartmentId, selectedSemesterId)
    }
  }, [selectedDepartmentId, selectedSemesterId, fetchSubjects])

  const filteredSubjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return subjects
    return subjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(query) ||
        subject.slug.toLowerCase().includes(query) ||
        subject.subjectCode.toLowerCase().includes(query),
    )
  }, [subjects, searchQuery])

  const resetForm = () => {
    setForm(emptyForm(selectedDepartmentId, selectedSemesterId))
    setEditingId(null)
    setShowForm(false)
  }

  const openCreate = () => {
    if (!selectedDepartmentId) {
      toast.error('Select a department first')
      return
    }
    if (!selectedSemesterId) {
      toast.error('Select a semester first')
      return
    }
    setEditingId(null)
    setForm(emptyForm(selectedDepartmentId, selectedSemesterId))
    setShowForm(true)
  }

  const openEdit = (subject: Subject) => {
    void (async () => {
      try {
        const data = await getSemestersByDepartment(subject.departmentId)
        setSemesters(data)
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load semesters'))
      }
      setEditingId(subject.id)
      setForm({
        departmentId: subject.departmentId,
        semesterId: subject.semesterId,
        name: subject.name,
        slug: subject.slug,
        subjectCode: subject.subjectCode,
      })
      setShowForm(true)
    })()
  }

  const parseFormPayload = (): CreateSubjectInput | null => {
    if (!form.departmentId) {
      toast.error('Department is required')
      return null
    }
    if (!form.semesterId) {
      toast.error('Semester is required')
      return null
    }
    if (!form.name.trim()) {
      toast.error('Subject name is required')
      return null
    }
    if (!form.slug.trim()) {
      toast.error('Slug is required')
      return null
    }
    if (!form.subjectCode.trim()) {
      toast.error('Subject code is required')
      return null
    }

    return {
      departmentId: form.departmentId,
      semesterId: form.semesterId,
      name: form.name.trim(),
      slug: form.slug.trim(),
      subjectCode: form.subjectCode.trim(),
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const payload = parseFormPayload()
    if (!payload) return

    setSubmitting(true)
    try {
      if (editingId) {
        await updateSubject(editingId, payload)
        toast.success('Subject updated')
      } else {
        await createSubject(payload)
        toast.success('Subject created')
      }
      resetForm()
      setSelectedDepartmentId(payload.departmentId)
      setSelectedSemesterId(payload.semesterId)
      await fetchSemesters(payload.departmentId)
      await fetchSubjects(payload.departmentId, payload.semesterId)
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          editingId ? 'Failed to update subject' : 'Failed to create subject',
        ),
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (subject: Subject) => {
    const confirmed = window.confirm(
      `Delete "${subject.name}"? This cannot be undone.`,
    )
    if (!confirmed) return

    try {
      await deleteSubject(subject.id)
      toast.success('Subject deleted')
      if (editingId === subject.id) resetForm()
      await fetchSubjects(subject.departmentId, subject.semesterId)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete subject'))
    }
  }

  const updateField =
    (field: keyof SubjectFormState) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleGenerateSlug = () => {
    const name = form.name.trim()
    const code = form.subjectCode.trim()
    if (!name && !code) {
      toast.error('Enter subject name or code first')
      return
    }
    const slug = generateSubjectSlug(name, code)
    setForm((prev) => ({ ...prev, slug }))
    toast.success('Slug generated')
  }

  const handleDepartmentFilterChange = (departmentId: string) => {
    setSelectedDepartmentId(departmentId)
    setSelectedSemesterId('')
    if (!showForm) {
      setForm(emptyForm(departmentId, ''))
    }
  }

  const handleSemesterFilterChange = (semesterId: string) => {
    setSelectedSemesterId(semesterId)
    if (!showForm) {
      setForm((prev) => ({ ...prev, semesterId }))
    }
  }

  const loading =
    loadingDepartments || loadingSemesters || loadingSubjects
  const totalCount = subjects.length
  const canAdd =
    departments.length > 0 && semesters.length > 0 && Boolean(selectedSemesterId)

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-500">
            <BookOpen size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Subjects
            </h1>
            <p className={`mt-1 text-sm ${mutedClass}`}>
              Manage subjects by department and semester.
            </p>
          </div>
        </div>

        {!showForm && canAdd && (
          <Button type="button" variant="primary" icon={Plus} onClick={openCreate}>
            Add Subject
          </Button>
        )}
      </div>

      <div
        className={`mb-6 grid gap-4 rounded-md border p-4 shadow-sm sm:grid-cols-2 ${cardClass}`}
      >
        <CustomDropdown
          id="filterDepartmentId"
          label="Department"
          value={selectedDepartmentId}
          onChange={handleDepartmentFilterChange}
          options={departmentOptions}
          placeholder="Select department"
          searchPlaceholder="Search departments…"
          emptyMessage="No departments yet. Create one under Departments first."
          disabled={loadingDepartments || departments.length === 0}
          required
        />
        <CustomDropdown
          id="filterSemesterId"
          label="Semester"
          value={selectedSemesterId}
          onChange={handleSemesterFilterChange}
          options={semesterOptions}
          placeholder="Select semester"
          searchPlaceholder="Search semesters…"
          emptyMessage={
            selectedDepartmentId
              ? 'No semesters for this department. Create one under Semesters first.'
              : 'Select a department first'
          }
          disabled={
            loadingSemesters ||
            !selectedDepartmentId ||
            semesters.length === 0
          }
          required
        />
      </div>

      {showForm && (
        <div className={`mb-6 rounded-md border p-6 shadow-sm ${cardClass}`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editingId ? 'Edit Subject' : 'New Subject'}
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <CustomDropdown
                id="formDepartmentId"
                label="Department"
                value={form.departmentId}
                onChange={async (departmentId) => {
                  setForm((prev) => ({
                    ...prev,
                    departmentId,
                    semesterId: '',
                  }))
                  if (departmentId) {
                    setLoadingSemesters(true)
                    try {
                      const data = await getSemestersByDepartment(departmentId)
                      setSemesters(data)
                    } catch {
                      setSemesters([])
                    } finally {
                      setLoadingSemesters(false)
                    }
                  }
                }}
                options={departmentOptions}
                placeholder="Select department"
                searchPlaceholder="Search departments…"
                emptyMessage="No departments available"
                disabled={submitting}
                required
              />
              <CustomDropdown
                id="formSemesterId"
                label="Semester"
                value={form.semesterId}
                onChange={(semesterId) =>
                  setForm((prev) => ({ ...prev, semesterId }))
                }
                options={semesterOptions}
                placeholder="Select semester"
                searchPlaceholder="Search semesters…"
                emptyMessage="No semesters for selected department"
                disabled={submitting || !form.departmentId || semesters.length === 0}
                required
              />
              <Input
                label="Subject name"
                name="name"
                value={form.name}
                onChange={updateField('name')}
                placeholder="e.g. Data Structures"
                disabled={submitting}
                required
              />
              <Input
                label="Subject code"
                name="subjectCode"
                value={form.subjectCode}
                onChange={updateField('subjectCode')}
                placeholder="e.g. CS501"
                disabled={submitting}
                required
              />
              <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:items-end">
                <Input
                  label="Slug"
                  name="slug"
                  value={form.slug}
                  onChange={updateField('slug')}
                  placeholder="e.g. data-structures-cs501"
                  disabled={submitting}
                  required
                  className="min-w-0 flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  icon={Sparkles}
                  disabled={
                    submitting ||
                    (!form.name.trim() && !form.subjectCode.trim())
                  }
                  onClick={handleGenerateSlug}
                  className="shrink-0 sm:mb-0"
                >
                  Generate slug
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
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
        {loadingDepartments ? (
          <div className={`flex items-center justify-center gap-2 py-16 ${mutedClass}`}>
            <Loader2 size={22} className="animate-spin text-rose-500" />
            Loading…
          </div>
        ) : departments.length === 0 ? (
          <div className={`py-16 text-center text-sm ${mutedClass}`}>
            No departments found. Create a department first.
          </div>
        ) : !selectedDepartmentId ? (
          <div className={`py-16 text-center text-sm ${mutedClass}`}>
            Select a department to view subjects.
          </div>
        ) : semesters.length === 0 && !loadingSemesters ? (
          <div className={`py-16 text-center text-sm ${mutedClass}`}>
            No semesters for this department. Create a semester first.
          </div>
        ) : !selectedSemesterId && !loadingSemesters ? (
          <div className={`py-16 text-center text-sm ${mutedClass}`}>
            Select a semester to view subjects.
          </div>
        ) : loading ? (
          <div className={`flex items-center justify-center gap-2 py-16 ${mutedClass}`}>
            <Loader2 size={22} className="animate-spin text-rose-500" />
            Loading subjects…
          </div>
        ) : (
          <>
            <TableListToolbar
              totalCount={totalCount}
              filteredCount={filteredSubjects.length}
              itemLabel="subject"
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search by name, code, or slug…"
            />

            {totalCount === 0 ? (
              <div className={`py-16 text-center text-sm ${mutedClass}`}>
                No subjects for {semesterLabelById(selectedSemesterId)}. Click
                &quot;Add Subject&quot; to create one.
              </div>
            ) : filteredSubjects.length === 0 ? (
              <div className={`py-16 text-center text-sm ${mutedClass}`}>
                No subjects match your search.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[48rem] text-left text-sm">
                  <thead>
                    <tr className={`border-b ${tableRowClass} ${tableHeadClass}`}>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Code</th>
                      <th className="px-4 py-3 font-semibold">Slug</th>
                      <th className="px-4 py-3 font-semibold">Semester</th>
                      <th className="px-4 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubjects.map((subject) => (
                      <tr
                        key={subject.id}
                        className={`border-b last:border-b-0 ${tableRowClass}`}
                      >
                        <td className="px-4 py-3 font-medium">{subject.name}</td>
                        <td className={`px-4 py-3 font-mono text-xs ${mutedClass}`}>
                          {subject.subjectCode}
                        </td>
                        <td className={`px-4 py-3 font-mono text-xs ${mutedClass}`}>
                          {subject.slug}
                        </td>
                        <td className={`px-4 py-3 ${mutedClass}`}>
                          {semesterLabelById(subject.semesterId)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              icon={Pencil}
                              onClick={() => openEdit(subject)}
                              title="Edit"
                              aria-label="Edit subject"
                              className="!h-9 !w-9 !px-0"
                            />
                            <Button
                              type="button"
                              variant="danger"
                              icon={Trash2}
                              onClick={() => void handleDelete(subject)}
                              title="Delete"
                              aria-label="Delete subject"
                              className="!h-9 !w-9 !px-0"
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
