"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, MessageCircle, Share2, Volume2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

/**
 * PostFeed component - Displays feed of posts/voices
 * Features:
 * - Different feed types: text posts, voice messages, trending
 * - Animated post cards with hover effects
 * - Like, reply, share, and voice playback interactions
 * - Staggered animation for multiple posts
 */
interface Post {
  id: string
  author: string
  handle: string
  avatar: string
  content: string
  timestamp: string
  likes: number
  replies: number
  shares: number
  hasVoice?: boolean
  voiceDuration?: string
}

const mockPosts: Post[] = [
  {
    id: "1",
    author: "Alex Chen",
    handle: "@alexchen",
    avatar: "AC",
    content: "Just launched my new project! Feeling excited about the possibilities. Check it out and let me know what you think!",
    timestamp: "2h ago",
    likes: 234,
    replies: 45,
    shares: 12,
    hasVoice: true,
    voiceDuration: "0:45",
  },
  {
    id: "2",
    author: "Jordan Smith",
    handle: "@jordansmith",
    avatar: "JS",
    content: "The future of social media is about authenticity. Voice adds a human touch that text alone can't capture.",
    timestamp: "4h ago",
    likes: 567,
    replies: 89,
    shares: 34,
  },
  {
    id: "3",
    author: "Casey Lee",
    handle: "@caseylee",
    avatar: "CL",
    content: "Building in public is the best way to learn. Every failure is a lesson, every success is a milestone.",
    timestamp: "6h ago",
    likes: 892,
    replies: 156,
    shares: 78,
    hasVoice: true,
    voiceDuration: "1:23",
  },
  {
    id: "4",
    author: "Morgan Davis",
    handle: "@morgandavis",
    avatar: "MD",
    content: "Peculiar is changing how we communicate. Text + Voice = The perfect balance of expression.",
    timestamp: "8h ago",
    likes: 1203,
    replies: 234,
    shares: 145,
  },
]

export default function PostFeed({ type }: { type: "text" | "voice" | "trending" }) {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  // Filter posts based on type
  const filteredPosts = mockPosts.filter((post) => {
    if (type === "voice") return post.hasVoice
    if (type === "trending") return post.likes > 500
    return true
  })

  const toggleLike = (postId: string) => {
    const newLiked = new Set(likedPosts)
    if (newLiked.has(postId)) {
      newLiked.delete(postId)
    } else {
      newLiked.add(postId)
    }
    setLikedPosts(newLiked)
  }

  return (
    <div className="divide-y divide-gray-700">
      {filteredPosts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border-b border-gray-700 p-4 hover:bg-gray-900/30 transition-colors cursor-pointer group"
        >
          <div className="flex gap-4">
            {/* Avatar */}
            <Avatar className="w-12 h-12 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600">
                {post.avatar}
              </AvatarFallback>
            </Avatar>

            {/* Post Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <p className="font-bold text-white hover:underline">{post.author}</p>
                  <p className="text-gray-500">{post.handle}</p>
                  <p className="text-gray-500">·</p>
                  <p className="text-gray-500 text-sm">{post.timestamp}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-purple-900/20 rounded-full text-gray-500 hover:text-purple-400"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Content */}
              <p className="text-white mb-3 break-words">{post.content}</p>

              {/* Voice Message */}
              {post.hasVoice && (
                <motion.div
                  whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                  className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg mb-3 border border-gray-700"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-700 hover:to-pink-700 flex-shrink-0"
                  >
                    <Volume2 className="w-4 h-4 text-white" />
                  </motion.button>
                  <div className="flex-1">
                    <div className="flex gap-1 h-6 items-center">
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: ["20%", "100%", "20%"] }}
                          transition={{
                            duration: 0.3,
                            repeat: Infinity,
                            delay: i * 0.05,
                          }}
                          className="flex-1 bg-gradient-to-t from-purple-600 to-pink-600 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{post.voiceDuration}</span>
                </motion.div>
              )}

              {/* Engagement Stats */}
              <div className="flex gap-8 text-gray-500 text-sm mb-3 py-2">
                <span className="hover:text-purple-400 cursor-pointer">{post.replies} replies</span>
                <span className="hover:text-purple-400 cursor-pointer">{post.likes} likes</span>
                <span className="hover:text-purple-400 cursor-pointer">{post.shares} shares</span>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-blue-900/20 hover:text-blue-400 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-2 p-2 rounded-full transition-colors ${
                    likedPosts.has(post.id)
                      ? "text-red-500 bg-red-900/20"
                      : "hover:bg-red-900/20 hover:text-red-400"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-green-900/20 hover:text-green-400 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
