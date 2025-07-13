"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Home, User, X, FileText, Calendar, BookOpen, Briefcase, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  user: {
    name?: string
    email?: string
  }
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/dashboard",
      icon: Home,
      label: "ダッシュボード",
      isActive: pathname === "/dashboard"
    },
    {
      href: "/self-analysis",
      icon: User,
      label: "自己分析",
      isActive: pathname === "/self-analysis"
    },
    {
      href: "/es-manager",
      icon: FileText,
      label: "ES管理",
      isActive: pathname === "/es-manager"
    },
    {
      href: "/research",
      icon: BarChart3,
      label: "研究管理",
      isActive: pathname === "/research"
    },
    {
      href: "/calendar",
      icon: Calendar,
      label: "カレンダー",
      isActive: pathname === "/calendar"
    }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
          
          {/* Sidebar */}
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-md border-r border-gray-100 shadow-xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Briefcase className="w-5 h-5 text-white" />
                  </motion.div>
                  <span className="text-xl font-bold text-gray-900">AnalyzMe</span>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-8">
                  {/* User Profile */}
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Avatar className="w-16 h-16 mx-auto mb-4 border-4 border-white shadow-lg">
                      <AvatarImage src="/placeholder.svg?height=64&width=64" />
                      <AvatarFallback className="bg-gray-900 text-white text-xl font-semibold">
                        {user.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{user.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">就活生</p>
                    <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
                      アクティブ
                    </Badge>
                  </motion.div>

                  {/* Navigation */}
                  <motion.nav 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {navItems.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          <Link
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 group ${
                              item.isActive
                                ? "bg-gray-900 text-white shadow-lg"
                                : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                            }`}
                          >
                            <Icon className={`w-5 h-5 transition-transform duration-300 ${
                              item.isActive ? "" : "group-hover:scale-110"
                            }`} />
                            <span className="text-sm">{item.label}</span>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </motion.nav>
                </div>
              </div>
              
              {/* Footer */}
              <motion.div 
                className="p-6 border-t border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-center text-xs text-gray-500">
                  <p>© 2025 AnalyzMe</p>
                  <p>あなたの就活をサポート</p>
                </div>
              </motion.div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
