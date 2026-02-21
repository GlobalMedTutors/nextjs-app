import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { redirect } from 'next/navigation'

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <a href="/instructor" className="flex items-center px-4 text-xl font-bold">
                Global Med Tutors - Instructor
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/instructor/inbox" className="px-3 py-2 rounded-md text-sm font-medium">
                Inbox
              </a>
              <a href="/instructor/availability" className="px-3 py-2 rounded-md text-sm font-medium">
                Availability
              </a>
              <a href="/instructor/profile" className="px-3 py-2 rounded-md text-sm font-medium">
                Profile
              </a>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
