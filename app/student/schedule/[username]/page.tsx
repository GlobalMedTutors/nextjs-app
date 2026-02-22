'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

interface Instructor {
  id: string
  user: {
    firstName: string
    lastName: string
    username: string
  }
  ratePerHour?: number
  subjects: Array<{ id: string; name: string }>
}

interface Availability {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function SchedulePage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const username = params.username as string
  const [instructor, setInstructor] = useState<Instructor | null>(null)
  const [availability, setAvailability] = useState<Availability[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [duration, setDuration] = useState<number>(60)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [creditBalance, setCreditBalance] = useState<number | null>(null)
  const [checkingCredits, setCheckingCredits] = useState(false)

  useEffect(() => {
    fetchInstructor()
  }, [username])

  useEffect(() => {
    // Check if returning from credit purchase
    const date = searchParams.get('date')
    const time = searchParams.get('time')
    const durationParam = searchParams.get('duration')
    if (date && time) {
      setSelectedDate(date)
      setSelectedTime(time)
      if (durationParam) {
        setDuration(Number(durationParam))
      }
      // Refresh credit balance after instructor loads
      if (instructor?.id) {
        setTimeout(() => {
          fetchCreditBalance()
        }, 1000)
      }
    }
  }, [searchParams, instructor?.id])

  useEffect(() => {
    if (instructor?.id) {
      fetchAvailability()
      fetchCreditBalance()
    }
  }, [instructor?.id])

  const fetchCreditBalance = async () => {
    if (!instructor?.id) return
    try {
      const res = await fetch(`/api/credits?instructorId=${instructor.id}`)
      if (res.ok) {
        const data = await res.json()
        setCreditBalance(data.balance || 0)
      }
    } catch (error) {
      console.error('Error fetching credit balance:', error)
    }
  }

  const fetchInstructor = async () => {
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

  const fetchAvailability = async () => {
    try {
      const res = await fetch(`/api/availability?instructorId=${instructor?.id}`)
      if (res.ok) {
        const data = await res.json()
        setAvailability(data)
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
    }
  }

  const getAvailableTimeSlots = (date: Date) => {
    if (!selectedDate || !instructor) return []

    const dayOfWeek = date.getDay()
    const dayAvailability = availability.filter((av) => av.dayOfWeek === dayOfWeek)

    if (dayAvailability.length === 0) return []

    const slots: string[] = []
    dayAvailability.forEach((av) => {
      const start = new Date(av.startTime)
      const end = new Date(av.endTime)
      const slotStart = new Date(date)
      slotStart.setHours(start.getHours(), start.getMinutes(), 0, 0)

      while (slotStart < end) {
        const slotEnd = new Date(slotStart)
        slotEnd.setMinutes(slotEnd.getMinutes() + duration)

        if (slotEnd <= end) {
          slots.push(slotStart.toISOString())
        }

        slotStart.setMinutes(slotStart.getMinutes() + 30) // 30-minute intervals
      }
    })

    return slots
  }

  const calculateRequiredCredits = () => {
    if (!instructor?.ratePerHour) return 0
    // 1 credit = 1 hour of lesson time
    return Math.ceil(duration / 60)
  }

  const calculateCost = () => {
    if (!instructor?.ratePerHour) return 0
    return (instructor.ratePerHour * duration) / 60
  }

  const handleBookLesson = async () => {
    if (!selectedDate || !selectedTime || !instructor) return

    const requiredCredits = calculateRequiredCredits()
    const cost = calculateCost()

    // Check if student has enough credits
    if (creditBalance !== null && creditBalance < requiredCredits) {
      const confirmPurchase = confirm(
        `You need ${requiredCredits} credits to book this lesson, but you only have ${creditBalance} credits.\n\n` +
        `Would you like to purchase credits for $${cost.toFixed(2)}?`
      )
      if (confirmPurchase) {
        router.push(
          `/student/purchase-credits?instructorId=${instructor.id}&amount=${cost}&credits=${requiredCredits}&returnTo=${encodeURIComponent(`/student/schedule/${username}?date=${selectedDate}&time=${selectedTime}&duration=${duration}`)}`
        )
        return
      }
      return
    }

    setBooking(true)
    try {
      const startTime = new Date(selectedTime)
      const endTime = new Date(startTime)
      endTime.setMinutes(endTime.getMinutes() + duration)

      // Get first subject for now
      const subjectId = instructor.subjects[0]?.id
      if (!subjectId) {
        alert('Instructor has no subjects')
        return
      }

      const res = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instructorId: instructor.id,
          subjectId,
          createLessonInputs: [
            {
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
            },
          ],
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.conflicts && data.conflicts.length > 0) {
          alert('There are scheduling conflicts. Please choose a different time.')
        } else {
          alert('Lesson booked successfully!')
          // Refresh credit balance
          await fetchCreditBalance()
          router.push('/student/lessons')
        }
      } else {
        const error = await res.json()
        if (error.error?.includes('Insufficient credits')) {
          const confirmPurchase = confirm(
            `You don't have enough credits. Would you like to purchase credits for $${cost.toFixed(2)}?`
          )
          if (confirmPurchase) {
            router.push(
              `/student/purchase-credits?instructorId=${instructor.id}&amount=${cost}&credits=${requiredCredits}&returnTo=${encodeURIComponent(`/student/schedule/${username}?date=${selectedDate}&time=${selectedTime}&duration=${duration}`)}`
            )
          }
        } else {
          alert(error.error || 'Failed to book lesson')
        }
      }
    } catch (error) {
      console.error('Error booking lesson:', error)
      alert('Failed to book lesson')
    } finally {
      setBooking(false)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
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

  const availableSlots = selectedDate ? getAvailableTimeSlots(new Date(selectedDate)) : []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Schedule a Lesson with {instructor.user.firstName} {instructor.user.lastName}
      </h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value)
              setSelectedTime('')
            }}
            min={new Date().toISOString().split('T')[0]}
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time
            </label>
            {availableSlots.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedTime === slot
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-300 hover:border-indigo-500'
                    }`}
                  >
                    {formatTime(slot)}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No available time slots for this date</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes)
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={90}>1.5 hours</option>
            <option value={120}>2 hours</option>
          </select>
        </div>

        {instructor.ratePerHour && (
          <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Rate per hour:</p>
              <p className="text-sm font-medium">${instructor.ratePerHour}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Duration:</p>
              <p className="text-sm font-medium">{duration} minutes</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Cost:</p>
              <p className="text-sm font-medium">${calculateCost().toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Credits required:</p>
              <p className="text-sm font-medium">{calculateRequiredCredits()}</p>
            </div>
            {creditBalance !== null && (
              <div className="flex justify-between pt-2 border-t">
                <p className="text-sm font-medium">Your credit balance:</p>
                <p className={`text-sm font-semibold ${creditBalance < calculateRequiredCredits() ? 'text-red-600' : 'text-green-600'}`}>
                  {creditBalance}
                </p>
              </div>
            )}
            {creditBalance !== null && creditBalance < calculateRequiredCredits() && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                ⚠️ Insufficient credits. You'll need to purchase credits to book this lesson.
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleBookLesson}
          disabled={!selectedDate || !selectedTime || booking}
          className="w-full max-w-md px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {booking ? 'Booking...' : 'Book Lesson'}
        </button>
      </div>
    </div>
  )
}
