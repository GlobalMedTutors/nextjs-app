'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Instructor {
  id: string
  user: {
    firstName: string
    lastName: string
    username: string
  }
  profilePage?: {
    bio?: string
    avatar?: string
    coverMedia?: string
  }
  ratePerHour?: number
  subjects: Array<{ id: string; name: string }>
}

export default function InstructorPage() {
  const params = useParams()
  const username = params.username as string
  const [instructor, setInstructor] = useState<Instructor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInstructor()
  }, [username])

  const fetchInstructor = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/instructors?username=${username}`)
      if (res.ok) {
        const data = await res.json()
        setInstructor(data)
      }
    } catch (error) {
      console.error('Error fetching instructor:', error)
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

  if (!instructor) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>Instructor not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {instructor.profilePage?.coverMedia && (
          <img
            src={instructor.profilePage.coverMedia}
            alt="Cover"
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-8">
          <div className="flex items-start gap-6">
            {instructor.profilePage?.avatar && (
              <img
                src={instructor.profilePage.avatar}
                alt={`${instructor.user.firstName} ${instructor.user.lastName}`}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {instructor.user.firstName} {instructor.user.lastName}
              </h1>
              {instructor.ratePerHour && (
                <p className="text-2xl text-indigo-600 font-semibold mb-4">
                  ${instructor.ratePerHour}/hour
                </p>
              )}
              {instructor.profilePage?.bio && (
                <p className="text-gray-700 mb-4">{instructor.profilePage.bio}</p>
              )}
              <div className="flex flex-wrap gap-2 mb-6">
                {instructor.subjects.map((subject) => (
                  <span
                    key={subject.id}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  >
                    {subject.name}
                  </span>
                ))}
              </div>
              <Link
                href={`/student/schedule/${username}`}
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
              >
                Schedule a Lesson
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
