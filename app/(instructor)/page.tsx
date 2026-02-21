import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { getCurrentUser } from '@/lib/auth/get-session'
import Link from 'next/link'

export default async function InstructorHomePage() {
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
          href="/instructor/inbox"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">Inbox</h2>
          <p className="text-gray-600">View messages and conversations</p>
        </Link>
        
        <Link
          href="/instructor/availability"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">Availability</h2>
          <p className="text-gray-600">Manage your availability schedule</p>
        </Link>
        
        <Link
          href="/instructor/profile"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">Profile</h2>
          <p className="text-gray-600">Update your instructor profile</p>
        </Link>
      </div>
    </div>
  )
}
