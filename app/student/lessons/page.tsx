'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Lesson {
  id: string
  name: string
  startTime: string
  endTime: string
  status: string
  videoLink?: string
  instructor: {
    user: {
      firstName: string
      lastName: string
    }
  }
  subject?: {
    name: string
  }
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')

  useEffect(() => {
    fetchLessons()
  }, [filter])

  const fetchLessons = async () => {
    setLoading(true)
    try {
      const url = filter === 'upcoming' ? '/api/lessons?upcoming=true' : '/api/lessons'
      const res = await fetch(url)
      const data = await res.json()
      setLessons(data || [])
    } catch (error) {
      console.error('Error fetching lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'CANCELED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Lessons</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-md ${
              filter === 'upcoming' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Upcoming
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading lessons...</p>
      ) : lessons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No lessons found.</p>
          <Link
            href="/student/search"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Find an instructor to book a lesson
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{lesson.name}</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>
                      <strong>Instructor:</strong> {lesson.instructor.user.firstName}{' '}
                      {lesson.instructor.user.lastName}
                    </p>
                    {lesson.subject && (
                      <p>
                        <strong>Subject:</strong> {lesson.subject.name}
                      </p>
                    )}
                    <p>
                      <strong>Start:</strong> {formatDate(lesson.startTime)}
                    </p>
                    <p>
                      <strong>End:</strong> {formatDate(lesson.endTime)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      lesson.status
                    )}`}
                  >
                    {lesson.status}
                  </span>
                  {lesson.videoLink && lesson.status === 'CONFIRMED' && (
                    <a
                      href={lesson.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                    >
                      Join Meeting
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
