'use client'

import { useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  username: string
  instructor?: {
    id: string
    ratePerHour?: number
    profilePage?: {
      bio?: string
      avatar?: string
    }
  }
}

export default function InstructorProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>User not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Instructor Profile</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <p className="text-gray-900">
            {user.firstName} {user.lastName}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <p className="text-gray-900">{user.username}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="text-gray-900">{user.email}</p>
        </div>
        {user.instructor?.ratePerHour && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Rate per Hour</label>
            <p className="text-gray-900">${user.instructor.ratePerHour}</p>
          </div>
        )}
        {user.instructor?.profilePage?.bio && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <p className="text-gray-900">{user.instructor.profilePage.bio}</p>
          </div>
        )}
      </div>
    </div>
  )
}
