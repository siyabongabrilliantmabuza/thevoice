'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Heart, MessageCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface UserProfile {
  id: string
  username: string
  displayName: string
  bio?: string
  avatar?: string
  coverImage?: string
  createdAt: string
  _count: {
    posts: number
    interests: number
    interestedBy: number
  }
  isInterested?: boolean
}

export default function ProfilePage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const params = useParams()
  const username = params.username as string

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isInterested, setIsInterested] = useState(false)

  useEffect(() => {
    if (!token) return

    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/users/profile?username=${username}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setProfile(data)
          setIsInterested(data.isInterested || false)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token, username])

  const handleInterest = async () => {
    if (!profile || !token) return

    try {
      const response = await fetch(`/api/users/interest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: profile.id,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsInterested(data.interested)
      }
    } catch (error) {
      console.error('Failed to toggle interest:', error)
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <p className="text-gray-400">User not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-black text-white">
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
          <div>
            <h2 className="text-xl font-bold">{profile.displayName}</h2>
            <p className="text-sm text-gray-500">{profile._count.posts} posts</p>
          </div>
        </motion.div>

        {/* Cover Image */}
        {profile.coverImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-48 bg-gradient-to-r from-purple-600 to-pink-600 relative"
          >
            <img
              src={profile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pb-4"
        >
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-16 mb-4">
            <Avatar className="w-32 h-32 border-4 border-black">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="bg-purple-600 text-2xl">
                {profile.displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {user.id !== profile.id && (
              <Button
                onClick={handleInterest}
                className={`${
                  isInterested
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                } font-semibold px-6 rounded-full`}
              >
                {isInterested ? 'Interested ✓' : 'Interested'}
              </Button>
            )}
          </div>

          {/* User Details */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold">{profile.displayName}</h1>
            <p className="text-gray-500">@{profile.username}</p>
            {profile.bio && <p className="mt-2 text-gray-300">{profile.bio}</p>}
            <p className="text-sm text-gray-500 mt-2">
              Joined {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mb-4 pb-4 border-b border-gray-700">
            <div className="cursor-pointer hover:opacity-80">
              <p className="font-bold">{profile._count.interests}</p>
              <p className="text-sm text-gray-500">Interested In</p>
            </div>
            <div className="cursor-pointer hover:opacity-80">
              <p className="font-bold">{profile._count.interestedBy}</p>
              <p className="text-sm text-gray-500">Interested By</p>
            </div>
            <div className="cursor-pointer hover:opacity-80">
              <p className="font-bold">{profile._count.posts}</p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
          </div>

          {/* Action Buttons */}
          {user.id !== profile.id && (
            <div className="flex gap-2">
              <Button
                onClick={() => router.push(`/messages?user=${profile.id}`)}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white border border-gray-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          )}
        </motion.div>

        {/* Posts Section */}
        <div className="border-t border-gray-700 p-4">
          <h3 className="text-xl font-bold mb-4">Posts</h3>
          <div className="text-center text-gray-400 py-8">
            No posts yet
          </div>
        </div>
      </main>
    </div>
  )
}
