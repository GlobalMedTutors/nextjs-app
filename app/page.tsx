import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { getCurrentUser } from '@/lib/auth/get-session'

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

  // If user exists but has no role, redirect to onboarding
  redirect('/student/onboarding')
}
