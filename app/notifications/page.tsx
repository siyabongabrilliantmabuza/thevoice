'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, UserPlus, Mail, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface Notification {
  id: string
  type: string
  message: string
  relatedId?: string
  isRead: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setNotifications(data)
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [token])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />
      case 'reply':
        return <MessageCircle className="w-5 h-5 text-blue-500" />
      case 'interest':
        return <UserPlus className="w-5 h-5 text-purple-500" />
      case 'message':
        return <Mail className="w-5 h-5 text-green-500" />
      default:
        return null
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Main Content */}
      <main className="flex-1 max-w-2xl border-r border-gray-700 overflow-y-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-10 backdrop-blur bg-black/80 border-b border-gray-700 px-4 py-3 flex items-center gap-4"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-bold">Notifications</h2>
        </motion.div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-700">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No notifications yet</div>
          ) : (
            notifications.map((notification, i) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 hover:bg-gray-900/30 transition-colors cursor-pointer ${
                  !notification.isRead ? 'bg-purple-900/10' : ''
                }`}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1">
                    <p className="text-white">{notification.message}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
