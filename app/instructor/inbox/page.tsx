'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Conversation {
  id: string
  student: {
    user: {
      firstName: string
      lastName: string
    }
  }
  messages: Array<{
    content?: string
    createdAt: string
  }>
  updatedAt: string
}

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/conversations')
      if (res.ok) {
        const data = await res.json()
        setConversations(data)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Inbox</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading conversations...</p>
      ) : conversations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No conversations yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/instructor/inbox/${conversation.id}`}
              className="block bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {conversation.student.user.firstName} {conversation.student.user.lastName}
                  </h3>
                  {conversation.messages.length > 0 && (
                    <p className="text-gray-600 line-clamp-2">
                      {conversation.messages[0].content || 'No message content'}
                    </p>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(conversation.updatedAt)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
