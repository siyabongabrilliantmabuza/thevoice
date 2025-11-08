'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, ArrowLeft, Search } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function MessagesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [messageContent, setMessageContent] = useState('')

  // Mock data for demonstration
  const conversations = [
    { id: '1', name: 'Alex Chen', username: 'alexchen', avatar: 'AC' },
    { id: '2', name: 'Jordan Smith', username: 'jordansmith', avatar: 'JS' },
    { id: '3', name: 'Casey Lee', username: 'caseylee', avatar: 'CL' },
  ]

  const mockMessages = [
    { id: '1', content: 'Hey, how are you?', sender: 'them', time: '10:30 AM' },
    { id: '2', content: 'I\'m good, thanks! How about you?', sender: 'me', time: '10:32 AM' },
    { id: '3', content: 'Doing well. Have you tried the new voice feature?', sender: 'them', time: '10:35 AM' },
    { id: '4', content: 'Yes, it\'s amazing! I love how it captures the tone.', sender: 'me', time: '10:38 AM' },
  ]

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageContent.trim()) return
    
    // In a real app, this would send to the API
    console.log('Sending message:', messageContent)
    setMessageContent('')
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center text-white">
          <p>Please log in to view messages</p>
          <Button 
            onClick={() => router.push('/auth/login')}
            className="mt-4 bg-purple-600 hover:bg-purple-700"
          >
            Log In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Conversations List */}
      <aside className="w-80 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-gray-700 p-4"
        >
          <h2 className="text-xl font-bold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 bg-gray-900 border-gray-700 rounded-full"
            />
          </div>
        </motion.div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-700">
          {conversations.map((conversation) => (
            <motion.button
              key={conversation.id}
              whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
              onClick={() => setSelectedUser(conversation.id)}
              className={`w-full p-4 text-left transition-colors ${
                selectedUser === conversation.id ? 'bg-purple-900/20' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-purple-600">
                    {conversation.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{conversation.name}</p>
                  <p className="text-xs text-gray-500 truncate">@{conversation.username}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-gray-700 p-4 flex items-center gap-4"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedUser(null)}
                className="hover:bg-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <p className="font-bold">Jordan Smith</p>
                <p className="text-sm text-gray-500">@jordansmith</p>
              </div>
            </motion.div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((message, i) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex ${
                    message.sender === 'me' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === 'me'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-900 text-gray-100'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{message.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSendMessage}
              className="border-t border-gray-700 p-4 flex gap-2"
            >
              <Input
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type a message..."
                className="bg-gray-900 border-gray-700"
              />
              <Button
                type="submit"
                disabled={!messageContent.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Send className="w-5 h-5" />
              </Button>
            </motion.form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </main>
    </div>
  )
}
