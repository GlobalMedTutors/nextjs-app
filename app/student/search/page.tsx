'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Subject {
  id: string
  name: string
  description?: string
}

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
  }
  ratePerHour?: number
  subjects: Subject[]
}

export default function SearchPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/subjects')
      const data = await res.json()
      setSubjects(data)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const searchInstructors = async () => {
    if (!selectedSubject) return

    setLoading(true)
    try {
      const res = await fetch(`/api/instructors?subjectId=${selectedSubject}`)
      if (res.ok) {
        const data = await res.json()
        console.log('Found instructors:', data)
        setInstructors(data)
      } else {
        const error = await res.json()
        console.error('Error searching instructors:', error)
        setInstructors([])
      }
    } catch (error) {
      console.error('Error searching instructors:', error)
      setInstructors([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Find an Instructor</h1>

      <div className="mb-6">
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          Select Subject
        </label>
        <select
          id="subject"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="block w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Choose a subject...</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
        <button
          onClick={searchInstructors}
          disabled={!selectedSubject || loading}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map((instructor) => (
          <Link
            key={instructor.id}
            href={`/student/instructor/${instructor.user.username}`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="flex items-center mb-4">
              {instructor.profilePage?.avatar && (
                <img
                  src={instructor.profilePage.avatar}
                  alt={`${instructor.user.firstName} ${instructor.user.lastName}`}
                  className="w-16 h-16 rounded-full mr-4"
                />
              )}
              <div>
                <h3 className="text-xl font-semibold">
                  {instructor.user.firstName} {instructor.user.lastName}
                </h3>
                {instructor.ratePerHour && (
                  <p className="text-gray-600">${instructor.ratePerHour}/hour</p>
                )}
              </div>
            </div>
            {instructor.profilePage?.bio && (
              <p className="text-gray-700 mb-2 line-clamp-2">{instructor.profilePage.bio}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              {instructor.subjects.map((subject) => (
                <span
                  key={subject.id}
                  className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded"
                >
                  {subject.name}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {instructors.length === 0 && selectedSubject && !loading && (
        <p className="text-center text-gray-500 mt-8">No instructors found for this subject.</p>
      )}
    </div>
  )
}
