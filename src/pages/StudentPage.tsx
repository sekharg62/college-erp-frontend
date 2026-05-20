import Input from '../components/uis/Input'
import PageLayout from '../components/PageLayout'

function StudentPage() {
  return (
    <PageLayout
      label="Student"
      labelClassName="text-sky-400"
      title="Student Page"
      description="Welcome to the student portal."
    >
      <Input label="Full name" name="name" placeholder="Enter your full name" />
      <Input
        label="Phone number"
        name="phone"
        type="tel"
        placeholder="+91 98765 43210"
        hint="Used for login and notifications"
      />
      <Input
        label="Roll number"
        name="rollNumber"
        placeholder="e.g. STU-2024-001"
      />
    </PageLayout>
  )
}

export default StudentPage
