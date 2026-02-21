import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { getCurrentUser } from '@/lib/auth/get-session'
import Link from 'next/link'

export default async function StudentHomePage() {
  const session = await getServerSession(authOptions)
  const user = await getCurrentUser()

  if (!session || !user) {
    return <div>Please sign in</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.firstName}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/student/search"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">Find Instructors</h2>
          <p className="text-gray-600">Search for instructors by subject</p>
        </Link>
        
        <Link
          href="/student/lessons"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">My Lessons</h2>
          <p className="text-gray-600">View and manage your lessons</p>
        </Link>
        
        <Link
          href="/student/profile"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">Profile</h2>
          <p className="text-gray-600">Update your profile information</p>
        </Link>
      </div>
    </div>
  )
}
