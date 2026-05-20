import Input from '../components/uis/Input'
import PageLayout from '../components/PageLayout'

function TeacherPage() {
  return (
    <PageLayout
      label="Teacher"
      labelClassName="text-emerald-400"
      title="Teacher Page"
      description="Welcome to the teacher portal."
    >
      <Input label="Full name" name="name" placeholder="Enter your full name" />
      <Input
        label="Phone number"
        name="phone"
        type="tel"
        placeholder="+91 98765 43210"
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Enter password"
        hint="Minimum 8 characters"
      />
    </PageLayout>
  )
}

export default TeacherPage
