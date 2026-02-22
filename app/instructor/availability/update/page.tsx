'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AvailabilitySlot {
  dayOfWeek: number
  startTime: string
  endTime: string
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function UpdateAvailabilityPage() {
  const router = useRouter()
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAvailability()
  }, [])

  const fetchAvailability = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/availability')
      if (res.ok) {
        const data = await res.json()
        // Convert availability data to slots format
        const existingSlots: AvailabilitySlot[] = data.map((av: any) => {
          const startTime = new Date(av.startTime)
          const endTime = new Date(av.endTime)
          return {
            dayOfWeek: av.dayOfWeek,
            startTime: `${String(startTime.getHours()).padStart(2, '0')}:${String(startTime.getMinutes()).padStart(2, '0')}`,
            endTime: `${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}`,
          }
        })
        setSlots(existingSlots)
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
    } finally {
      setLoading(false)
    }
  }

  const addSlot = () => {
    setSlots([
      ...slots,
      {
        dayOfWeek: 0,
        startTime: '09:00',
        endTime: '17:00',
      },
    ])
  }

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index))
  }

  const updateSlot = (index: number, field: keyof AvailabilitySlot, value: string | number) => {
    const updated = [...slots]
    updated[index] = { ...updated[index], [field]: value }
    setSlots(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Convert time strings to full datetime
      const availabilities = slots.map((slot) => {
        const today = new Date()
        const dayOfWeek = today.getDay()
        const daysUntilTarget = (slot.dayOfWeek - dayOfWeek + 7) % 7
        const targetDate = new Date(today)
        targetDate.setDate(today.getDate() + daysUntilTarget)

        const [startHours, startMinutes] = slot.startTime.split(':').map(Number)
        const [endHours, endMinutes] = slot.endTime.split(':').map(Number)

        const startTime = new Date(targetDate)
        startTime.setHours(startHours, startMinutes, 0, 0)

        const endTime = new Date(targetDate)
        endTime.setHours(endHours, endMinutes, 0, 0)

        return {
          dayOfWeek: slot.dayOfWeek,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        }
      })

      const res = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availabilities }),
      })

      if (res.ok) {
        alert('Availability updated successfully!')
        router.push('/instructor/availability')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to update availability')
      }
    } catch (error) {
      console.error('Error updating availability:', error)
      alert('Failed to update availability')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>Loading availability...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Update Availability</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {slots.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No availability slots added yet. Click "Add Time Slot" to add your first availability.</p>
        ) : (
          <div className="space-y-4">
            {slots.map((slot, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">Slot {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeSlot(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                  <select
                    value={slot.dayOfWeek}
                    onChange={(e) => updateSlot(index, 'dayOfWeek', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {DAYS.map((day, i) => (
                      <option key={i} value={i}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateSlot(index, 'startTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateSlot(index, 'endTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={addSlot}
          className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-indigo-500 hover:text-indigo-600"
        >
          + Add Time Slot
        </button>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Availability'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
