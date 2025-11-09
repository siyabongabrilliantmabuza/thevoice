'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, Mic, Volume2, Search, Home, Bell, Mail, Bookmark, MoreHorizontal, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/lib/auth-context'
import Navigation from '@/components/navigation'
import CreatePost from '@/components/create-post'
import VoiceRecorder from '@/components/voice-recorder'

interface Post {
  id: string
  content: string
  author: {
    id: string
    username: string
    displayName: string
    avatar?: string
  }
  images: string[]
  videos: string[]
  voiceUrl?: string
  voiceDuration?: number
  createdAt: string
  _count: {
    likes: number
    replies: number
  }
}

export default function HomePage() {
  const { user, token, logout } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('feed')
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !loading) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  // Fetch posts
  useEffect(() => {
    if (!token) return

    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setPosts(data)
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [token])

  const handleLike = async (postId: string) => {
    if (!token) return

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.liked) {
          setLikedPosts(prev => new Set([...prev, postId]))
        } else {
          setLikedPosts(prev => {
            const newSet = new Set(prev)
            newSet.delete(postId)
            return newSet
          })
        }
      }
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  }

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts])
    setShowVoiceRecorder(false)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="text-4xl font-bold gradient-text mb-4">Peculiar</div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-gray-700 p-4 overflow-y-auto flex flex-col">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <div className="text-3xl font-bold gradient-text">Peculiar</div>
        </motion.div>

        <nav className="space-y-4 flex-1">
          {[
            { icon: Home, label: 'Home', href: '/' },
            { icon: Bell, label: 'Notifications', href: '/notifications' },
            { icon: Mail, label: 'Messages', href: '/messages' },
            { icon: Bookmark, label: 'Bookmarks', href: '/bookmarks' },
          ].map((item, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => router.push(item.href)}
              className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-900/50 transition-colors text-left"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-semibold">{item.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* User Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-gray-700 pt-4 space-y-4"
        >
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-900/50 cursor-pointer transition-colors">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-purple-600">
                {user.displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{user.displayName}</p>
              <p className="text-xs text-gray-500 truncate">@{user.username}</p>
            </div>
          </div>

          <Button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </motion.div>
      </aside>

      {/* Main Feed */}
      <main className="flex-1 border-r border-gray-700 max-w-2xl overflow-y-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-10 backdrop-blur bg-black/80 border-b border-gray-700 px-4 py-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">For You</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
              className="hover:bg-purple-900/20 text-purple-400"
            >
              <Mic className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Voice Recorder */}
        {showVoiceRecorder && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="border-b border-gray-700"
          >
            <VoiceRecorder onClose={() => setShowVoiceRecorder(false)} />
          </motion.div>
        )}

        {/* Create Post */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Posts Feed */}
        <div className="divide-y divide-gray-700">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No posts yet. Be the first to share!</div>
          ) : (
            posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 hover:bg-gray-900/30 transition-colors cursor-pointer"
              >
                <div className="flex gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback className="bg-purple-600">
                      {post.author.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{post.author.displayName}</p>
                      <p className="text-gray-500">@{post.author.username}</p>
                      <p className="text-gray-500 text-sm">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <p className="mt-2 text-white">{post.content}</p>

                    {post.voiceUrl && (
                      <div className="mt-3 p-3 bg-gray-900 rounded-lg flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-purple-400" />
                        <audio controls className="flex-1 h-6">
                          <source src={post.voiceUrl} type="audio/webm" />
                        </audio>
                      </div>
                    )}

                    {post.images.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {post.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt="Post"
                            className="rounded-lg w-full h-40 object-cover"
                          />
                        ))}
                      </div>
                    )}

                    {post.videos.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {post.videos.map((vid, idx) => (
                          <video
                            key={idx}
                            controls
                            className="rounded-lg w-full h-40 object-cover"
                          >
                            <source src={vid} type="video/mp4" />
                          </video>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 flex justify-between text-gray-500 max-w-md">
                      <button className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{post._count.replies}</span>
                      </button>

                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 transition-colors ${
                          likedPosts.has(post.id)
                            ? 'text-red-500'
                            : 'hover:text-red-400'
                        }`}
                      >
                        <Heart
                          className="w-4 h-4"
                          fill={likedPosts.has(post.id) ? 'currentColor' : 'none'}
                        />
                        <span className="text-sm">{post._count.likes}</span>
                      </button>

                      <button className="flex items-center gap-2 hover:text-green-400 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

      {/* Right Sidebar - Trending */}
      <aside className="hidden lg:block w-80 border-l border-gray-700 p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <Input
              placeholder="Search Peculiar..."
              className="pl-10 bg-gray-900 border-gray-700 rounded-full"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 rounded-2xl p-4"
        >
          <h3 className="text-xl font-bold mb-4">WhatWhat's happeningapos;s happening</h3>
          {[
            { tag: '#VoiceMatters', posts: '125K posts' },
            { tag: '#PeculiarCommunity', posts: '89K posts' },
            { tag: '#AuthenticVoices', posts: '234K posts' },
            { tag: '#ThreadsOfThought', posts: '156K posts' },
          ].map((trend, i) => (
            <motion.div
              key={i}
              whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
              className="p-3 rounded-lg cursor-pointer transition-colors mb-2"
            >
              <p className="font-bold text-purple-400">{trend.tag}</p>
              <p className="text-sm text-gray-500">{trend.posts}</p>
            </motion.div>
          ))}
        </motion.div>
      </aside>
    </div>
  )
}
