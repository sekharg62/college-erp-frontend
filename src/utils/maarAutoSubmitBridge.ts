import type { AcademicYear } from '../constants'
import type { GroupedStudentWithActivities } from './groupActivitySubmissionsByStudent'

/** Message type the MAAR Chrome extension content script should listen for */
export const MAAR_AUTO_SUBMIT_MESSAGE_TYPE = 'MAAR_START_AUTO_SUBMIT' as const

export const MAAR_AUTO_SUBMIT_SOURCE = 'MAAR_APP' as const

export const MAAR_AUTO_SUBMIT_EVENT = 'maar:start-auto-submit' as const

export type MaarAutoSubmitStudent = {
  id: string
  name: string
  rollNo: string
  phoneNo: string | null
  admissionYear: string
  activities: {
    id: string
    activityId: string
    subActivityId: string
    points: number
    proofUrl: string
    status: string
  }[]
}

export type MaarAutoSubmitPayload = {
  academicYear: AcademicYear
  yearLabel: string
  students: MaarAutoSubmitStudent[]
  submittedAt: string
}

export type MaarAutoSubmitMessage = {
  type: typeof MAAR_AUTO_SUBMIT_MESSAGE_TYPE
  source: typeof MAAR_AUTO_SUBMIT_SOURCE
  version: 1
  payload: MaarAutoSubmitPayload
}

function buildStudents(
  eligibleStudents: GroupedStudentWithActivities[],
): MaarAutoSubmitStudent[] {
  return eligibleStudents.map((s) => ({
    id: s.id,
    name: s.name,
    rollNo: s.rollNo,
    phoneNo: s.phoneNo,
    admissionYear: s.admissionYear,
    activities: s.activities.map((a) => ({
      id: a.id,
      activityId: a.activityId,
      subActivityId: a.subActivityId,
      points: a.points,
      proofUrl: a.proofUrl,
      status: a.status,
    })),
  }))
}

/**
 * Sends eligible student data to the MAAR Chrome extension (content script listens
 * via window message + CustomEvent). Logs step 3 checklist in DevTools console.
 */
export function dispatchMaarAutoSubmit(
  academicYear: AcademicYear,
  yearLabel: string,
  eligibleStudents: GroupedStudentWithActivities[],
): MaarAutoSubmitPayload {
  const payload: MaarAutoSubmitPayload = {
    academicYear,
    yearLabel,
    students: buildStudents(eligibleStudents),
    submittedAt: new Date().toISOString(),
  }

  const message: MaarAutoSubmitMessage = {
    type: MAAR_AUTO_SUBMIT_MESSAGE_TYPE,
    source: MAAR_AUTO_SUBMIT_SOURCE,
    version: 1,
    payload,
  }

  window.__MAAR_AUTO_SUBMIT__ = payload

  const targetOrigin = window.location.origin

  window.postMessage(message, targetOrigin)

  window.dispatchEvent(
    new CustomEvent(MAAR_AUTO_SUBMIT_EVENT, { detail: message }),
  )

  const studentCount = payload.students.length
  const activityCount = payload.students.reduce(
    (n, s) => n + s.activities.length,
    0,
  )

  console.group('[MAAR Auto Submit]')
  console.log(
    `Step 1–2: ${studentCount} student(s) selected, ${activityCount} activit${activityCount === 1 ? 'y' : 'ies'} — dispatching to extension`,
  )
  console.log('✅ Receive data from MAAR app')
  console.log('Message (postMessage + CustomEvent):', message)
  console.log(
    'Roll numbers for MAKAUT table match:',
    payload.students.map((s) => s.rollNo),
  )
  console.log(
    'Next (extension): Step 4 — open/switch to MAR entries page · Step 5 — ✅ Student matched in table · Step 6 — click student link',
  )
  console.groupEnd()

  return payload
}
