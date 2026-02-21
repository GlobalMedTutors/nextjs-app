'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Availability {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function AvailabilityPage() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchAvailability()
  }, [])

  const fetchAvailability = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/availability')
      if (res.ok) {
        const data = await res.json()
        setAvailabilities(data)
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const groupedByDay = availabilities.reduce((acc, av) => {
    if (!acc[av.dayOfWeek]) {
      acc[av.dayOfWeek] = []
    }
    acc[av.dayOfWeek].push(av)
    return acc
  }, {} as Record<number, Availability[]>)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Availability</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading availability...</p>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            {DAYS.map((day, dayIndex) => (
              <div key={dayIndex} className="border-b pb-4 last:border-b-0">
                <h3 className="font-semibold mb-2">{day}</h3>
                {groupedByDay[dayIndex] && groupedByDay[dayIndex].length > 0 ? (
                  <div className="space-y-2">
                    {groupedByDay[dayIndex].map((av) => (
                      <div key={av.id} className="text-gray-600">
                        {formatTime(av.startTime)} - {formatTime(av.endTime)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No availability set</p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/instructor/availability/update"
              className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Update Availability
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
