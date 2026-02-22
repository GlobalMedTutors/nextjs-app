import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { getCurrentUser } from '@/lib/auth/get-session'
import Link from 'next/link'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/sign-in')
  }

  const user = await getCurrentUser()
  
  if (user?.student) {
    redirect('/student')
  } else if (user?.instructor) {
    redirect('/instructor')
  }

  // If user exists but has no role, show role selection
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Choose Your Role</h1>
        <p className="text-gray-600 text-center mb-8">
          Select whether you want to join as an instructor or a student
        </p>
        <div className="space-y-4">
          <Link
            href="/instructor/onboarding"
            className="block w-full px-6 py-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-center font-medium transition"
          >
            I'm an Instructor
          </Link>
          <Link
            href="/student/onboarding"
            className="block w-full px-6 py-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-center font-medium transition"
          >
            I'm a Student
          </Link>
        </div>
      </div>
    </div>
  )
}
