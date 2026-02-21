import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { redirect } from 'next/navigation'

export default async function StudentLayout({
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
              <a href="/student" className="flex items-center px-4 text-xl font-bold">
                Global Med Tutors
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/student/search" className="px-3 py-2 rounded-md text-sm font-medium">
                Search
              </a>
              <a href="/student/lessons" className="px-3 py-2 rounded-md text-sm font-medium">
                Lessons
              </a>
              <a href="/student/profile" className="px-3 py-2 rounded-md text-sm font-medium">
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
