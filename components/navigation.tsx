"use client"

import { motion } from "framer-motion"
import { Home, Bell, Mail, Bookmark, MoreHorizontal, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

/**
 * Navigation component - Left sidebar with main navigation menu
 * Features:
 * - Home, Notifications, Messages, Bookmarks navigation
 * - Animated hover effects using Framer Motion
 * - User profile section at bottom
 * - Responsive design with icons and labels
 */
export default function Navigation() {
  const navItems = [
    { icon: Home, label: "Home", href: "#" },
    { icon: Bell, label: "Notifications", href: "#" },
    { icon: Mail, label: "Messages", href: "#" },
    { icon: Bookmark, label: "Bookmarks", href: "#" },
  ]

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-gray-700 p-4 bg-black sticky top-0 h-screen">
      {/* Logo/Brand */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8 flex items-center gap-2"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">P</span>
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Peculiar
        </span>
      </motion.div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-4">
        {navItems.map((item, i) => (
          <motion.a
            key={i}
            href={item.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ x: 5 }}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-900/50 transition-colors group cursor-pointer"
          >
            <item.icon className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
            <span className="text-xl text-gray-200 group-hover:text-white transition-colors">{item.label}</span>
          </motion.a>
        ))}
      </nav>

      {/* Post Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 rounded-full text-lg">
          Share Your Thought
        </Button>
      </motion.div>

      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="border-t border-gray-700 pt-4"
      >
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-900/50 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600">SB</AvatarFallback>
            </Avatar>
            <div className="hidden lg:block">
              <p className="font-bold text-sm">Siyabonga</p>
              <p className="text-xs text-gray-500">@siyabonga</p>
            </div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
        </div>
      </motion.div>
    </aside>
  )
}
