'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function InstructorOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    bio: '',
    ratePerHour: '',
    subjects: [] as string[],
  })
  const [availableSubjects, setAvailableSubjects] = useState<Array<{ id: string; name: string }>>([])
  const [submitting, setSubmitting] = useState(false)
  const [loadingSubjects, setLoadingSubjects] = useState(true)
  const [subjectsError, setSubjectsError] = useState<string | null>(null)

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    setLoadingSubjects(true)
    setSubjectsError(null)
    try {
      const res = await fetch('/api/subjects')
      if (res.ok) {
        const data = await res.json()
        if (!data || data.length === 0) {
          // Auto-seed subjects if none exist
          const seedRes = await fetch('/api/subjects/seed', { method: 'POST' })
          if (seedRes.ok) {
            // Fetch again after seeding
            const res2 = await fetch('/api/subjects')
            if (res2.ok) {
              const data2 = await res2.json()
              setAvailableSubjects(data2 || [])
            } else {
              setSubjectsError('Failed to load subjects after seeding. Please refresh the page.')
            }
          } else {
            setSubjectsError('Failed to seed subjects. Please contact support.')
          }
        } else {
          setAvailableSubjects(data)
        }
      } else {
        setSubjectsError('Failed to load subjects. Please refresh the page.')
      }
    } catch (error) {
      console.error('Error fetching subjects:', error)
      setSubjectsError('Failed to load subjects. Please refresh the page.')
    } finally {
      setLoadingSubjects(false)
    }
  }

  const toggleSubject = (subjectId: string) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.includes(subjectId)
        ? formData.subjects.filter((id) => id !== subjectId)
        : [...formData.subjects, subjectId],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Update user profile
      const userRes = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
        }),
      })

      if (!userRes.ok) {
        throw new Error('Failed to update profile')
      }

      // Create instructor profile
      const instructorRes = await fetch('/api/instructors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: formData.bio,
          ratePerHour: formData.ratePerHour,
          subjects: formData.subjects,
        }),
      })

      if (!instructorRes.ok) {
        const error = await instructorRes.json()
        throw new Error(error.error || 'Failed to create instructor profile')
      }

      router.push('/instructor')
    } catch (error: any) {
      console.error('Error completing onboarding:', error)
      alert(error.message || 'Failed to complete onboarding')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Instructor Setup</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {step} of 3</span>
            <div className="flex gap-1">
              <div className={`h-2 w-8 rounded ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
              <div className={`h-2 w-8 rounded ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
              <div className={`h-2 w-8 rounded ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
            </div>
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={(e) => {
            e.preventDefault()
            if (formData.firstName && formData.lastName && formData.username) {
              setStep(2)
            }
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Next
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={(e) => {
            e.preventDefault()
            // Validate form
            if (!formData.bio || !formData.bio.trim()) {
              alert('Please enter a bio')
              return
            }
            if (!formData.ratePerHour || parseFloat(formData.ratePerHour) <= 0) {
              alert('Please enter a valid rate per hour')
              return
            }
            if (formData.subjects.length === 0) {
              alert('Please select at least one subject you teach')
              return
            }
            setStep(3)
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio *
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Tell students about your teaching experience..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate per Hour ($) *
              </label>
              <input
                type="number"
                value={formData.ratePerHour}
                onChange={(e) => setFormData({ ...formData, ratePerHour: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subjects You Teach *
              </label>
              {loadingSubjects ? (
                <div className="p-4 text-center text-gray-500">Loading subjects...</div>
              ) : subjectsError ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                  {subjectsError}
                </div>
              ) : availableSubjects.length === 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
                  No subjects available. Loading default subjects...
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {availableSubjects.map((subject) => (
                    <label key={subject.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={formData.subjects.includes(subject.id)}
                        onChange={() => toggleSubject(subject.id)}
                        className="rounded"
                      />
                      <span className="flex-1">{subject.name}</span>
                    </label>
                  ))}
                </div>
              )}
              {formData.subjects.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  {formData.subjects.length} subject{formData.subjects.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Next
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-md p-4">
              <p className="text-sm text-indigo-800">
                Next, you'll need to set up your payment account and availability schedule.
                You can do this after completing your profile.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {submitting ? 'Completing...' : 'Complete Setup'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
