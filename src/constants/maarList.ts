export type MaarActivityItem = {
  label?: string
  activity: string
  pointsPerActivity: number
  permissibleMax: number
}

export type MaarCategory = {
  no: number
  title: string
  categoryMaxPoints?: number
  items: MaarActivityItem[]
}

export const MAAR_ACTIVITIES: readonly MaarCategory[] = [
  {
    no: 1,
    title:
      'MOOCS (SWAYAM/NPTEL/Spoken Tutorial/any technical, non-technical course) (per course)',
    categoryMaxPoints: 40,
    items: [
      {
        label: 'a',
        activity: 'For 12 weeks duration/40 Hours',
        pointsPerActivity: 20,
        permissibleMax: 40,
      },
      {
        label: 'b',
        activity: 'For 8 weeks duration/30 Hours',
        pointsPerActivity: 15,
        permissibleMax: 40,
      },
      {
        label: 'c',
        activity: 'For 4 weeks duration/20 Hours',
        pointsPerActivity: 10,
        permissibleMax: 40,
      },
      {
        label: 'd',
        activity: 'For 2 weeks duration/10 Hours',
        pointsPerActivity: 5,
        permissibleMax: 40,
      },
    ],
  },
  {
    no: 2,
    title: 'Tech Fest/Fest/Teachers Day/Fresher’s Welcome',
    items: [
      {
        label: 'a',
        activity: 'Organizer',
        pointsPerActivity: 5,
        permissibleMax: 10,
      },
      {
        label: 'b',
        activity: 'Participant',
        pointsPerActivity: 3,
        permissibleMax: 6,
      },
    ],
  },
  {
    no: 3,
    title: 'Rural Reporting',
    items: [
      {
        label: 'a',
        activity: 'Rural Reporting',
        pointsPerActivity: 5,
        permissibleMax: 10,
      },
    ],
  },
  {
    no: 4,
    title: 'Tree plantation and Up-keeping (per tree)',
    items: [
      {
        label: 'a',
        activity: 'Tree plantation and Up-keeping (per tree)',
        pointsPerActivity: 1,
        permissibleMax: 10,
      },
    ],
  },
  {
    no: 5,
    title: 'Relief/Charitable Activities',
    categoryMaxPoints: 40,
    items: [
      {
        label: 'a',
        activity:
          'Collection of fund/materials for the Relief Camp or Charitable Trusts',
        pointsPerActivity: 5,
        permissibleMax: 40,
      },
      {
        label: 'b',
        activity: 'To be a part of the Relief Work Team',
        pointsPerActivity: 20,
        permissibleMax: 40,
      },
    ],
  },
  {
    no: 6,
    title:
      'Participation in Debate/Group Discussion/Workshop/Tech quiz/Music/Dance/Drama/Elocution/Quiz/Seminar/Painting/any Performing Arts/Photography/Film Making',
    items: [
      {
        label: 'a',
        activity:
          'Participation in Debate/Group Discussion/Workshop/Tech quiz/Music/Dance/Drama/Elocution/Quiz/Seminar/Painting/any Performing Arts/Photography/Film Making',
        pointsPerActivity: 10,
        permissibleMax: 20,
      },
    ],
  },
  {
    no: 7,
    title: 'Publication in News Paper, Magazine, Wall Magazine & Blogs',
    items: [
      {
        label: 'a',
        activity: 'Publication in News Paper, Magazine, Wall Magazine & Blogs',
        pointsPerActivity: 10,
        permissibleMax: 20,
      },
    ],
  },
  {
    no: 8,
    title: 'Research Publication (per publication)',
    items: [
      {
        label: 'a',
        activity: 'Research Publication (per publication)',
        pointsPerActivity: 15,
        permissibleMax: 30,
      },
    ],
  },
  {
    no: 9,
    title: 'Innovative Projects (other than course curriculum)',
    items: [
      {
        label: 'a',
        activity: 'Innovative Projects (other than course curriculum)',
        pointsPerActivity: 30,
        permissibleMax: 60,
      },
    ],
  },
  {
    no: 10,
    title: 'Blood Donation',
    items: [
      {
        label: 'a',
        activity: 'Blood donation',
        pointsPerActivity: 8,
        permissibleMax: 16,
      },
      {
        label: 'b',
        activity: 'Blood Donation Camp Organization',
        pointsPerActivity: 10,
        permissibleMax: 20,
      },
    ],
  },
  {
    no: 11,
    title: 'Sports/Games/Adventure Sports/Trekking/Yoga Camp',
    items: [
      {
        label: 'a',
        activity: 'Personal Level',
        pointsPerActivity: 10,
        permissibleMax: 20,
      },
      {
        label: 'b',
        activity: 'College level',
        pointsPerActivity: 5,
        permissibleMax: 10,
      },
      {
        label: 'c',
        activity: 'University Level',
        pointsPerActivity: 10,
        permissibleMax: 20,
      },
      {
        label: 'd',
        activity: 'District Level',
        pointsPerActivity: 12,
        permissibleMax: 24,
      },
      {
        label: 'e',
        activity: 'State Level',
        pointsPerActivity: 15,
        permissibleMax: 30,
      },
      {
        label: 'f',
        activity: 'National/International Level',
        pointsPerActivity: 20,
        permissibleMax: 20,
      },
    ],
  },
  {
    no: 12,
    title: 'Activities in a Professional Society/Student Chapter',
    items: [
      {
        label: 'a',
        activity: 'Activities in a Professional Society/Student Chapter',
        pointsPerActivity: 10,
        permissibleMax: 20,
      },
    ],
  },
  {
    no: 13,
    title:
      'Relevant Industry Visit & Report/Hotel-Event Management Training & Report (Minimum 3 days with submitted report)',
    items: [
      {
        label: 'a',
        activity:
          'Relevant Industry Visit & Report/Hotel-Event Management Training & Report (Minimum 3 days with submitted report)',
        pointsPerActivity: 10,
        permissibleMax: 20,
      },
    ],
  },
  {
    no: 14,
    title:
      'Community Service & Allied Activities like: Caring for the Senior Citizens, Under-privileged/Street Children/Animal Care etc./Training to Differently Able',
    items: [
      {
        label: 'a',
        activity:
          'Community Service & Allied Activities like: Caring for the Senior Citizens, Under-privileged/Street Children/Animal Care etc./Training to Differently Able',
        pointsPerActivity: 10,
        permissibleMax: 20,
      },
    ],
  },
  {
    no: 15,
    title: 'Self-Entrepreneurship Programme',
    items: [
      {
        label: 'a',
        activity: 'To organise entrepreneurship programmes and workshops',
        pointsPerActivity: 10,
        permissibleMax: 20,
      },
      {
        label: 'b',
        activity:
          'To take part in entrepreneurship workshop and get certificate',
        pointsPerActivity: 5,
        permissibleMax: 10,
      },
      {
        label: 'c',
        activity: 'Video film making on entrepreneurship',
        pointsPerActivity: 10,
        permissibleMax: 20,
      },
      {
        label: 'd',
        activity: 'Submit business plan on any project',
        pointsPerActivity: 10,
        permissibleMax: 20,
      },
      {
        label: 'e',
        activity: 'To work for start-up/as entrepreneur',
        pointsPerActivity: 20,
        permissibleMax: 40,
      },
    ],
  },
] as const
