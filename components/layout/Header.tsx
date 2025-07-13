"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, Menu, Briefcase, Home, FileText, User, Calendar, BarChart3 } from "lucide-react"
import LogoutButton from "@/components/dashboard/LogoutButton"
import Link from "next/link"

interface HeaderProps {
  user: {
    name?: string
    email?: string
  }
  notificationCount?: number
  onMenuClick: () => void
  currentPage?: string
}

export default function Header({ user, notificationCount = 0, onMenuClick, currentPage }: HeaderProps) {
  const navigationItems = [
    { label: 'ダッシュボード', href: '/dashboard', icon: Home },
    { label: 'ES管理', href: '/es-manager', icon: FileText },
    { label: '自己分析', href: '/self-analysis', icon: User },
    { label: '研究', href: '/research', icon: BarChart3 },
    { label: 'カレンダー', href: '/calendar', icon: Calendar },
  ]

  return (
    <motion.header 
      className="border-b border-gray-100 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-4 h-4" />
          </Button>
          
          <Link href="/dashboard" className="flex items-center space-x-3">
            <motion.div 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 rounded-lg flex items-center justify-center"
              whileHover={{ 
                scale: 1.05,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.div>
            <motion.span 
              className="text-xl sm:text-2xl font-bold text-gray-900"
              whileHover={{ scale: 1.02 }}
            >
              AnalyzMe
            </motion.span>
          </Link>
        </motion.div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navigationItems.map((item, index) => {
            const Icon = item.icon
            const isActive = currentPage === item.href.split('/')[1]
            
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 300 }}
                whileHover={{ 
                  y: -2, 
                }}
                className="relative group"
              >
                <Link 
                  href={item.href} 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm lg:text-base font-medium ${
                    isActive 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              </motion.div>
            )
          })}
        </nav>
        
        {/* Right side controls */}
        <motion.div 
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white border-white">
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
            </Button>
          </motion.div>
          
          <LogoutButton />
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback className="bg-gray-900 text-white font-semibold">
                {user.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  )
}
