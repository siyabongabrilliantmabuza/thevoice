'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Image, Video, Mic } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface CreatePostProps {
  onPostCreated?: (post: any) => void
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user, token } = useAuth()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !token) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          images: [],
          videos: [],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      const newPost = await response.json()
      setContent('')
      onPostCreated?.(newPost)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-gray-700 p-4"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-purple-600">
              {user.displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="bg-transparent border-0 text-xl resize-none focus:outline-none"
              rows={3}
            />

            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-purple-400 hover:bg-purple-900/20"
                >
                  <Image className="w-5 h-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-purple-400 hover:bg-purple-900/20"
                >
                  <Video className="w-5 h-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-purple-400 hover:bg-purple-900/20"
                >
                  <Mic className="w-5 h-5" />
                </Button>
              </div>

              <Button
                type="submit"
                disabled={!content.trim() || loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 rounded-full disabled:opacity-50"
              >
                {loading ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
