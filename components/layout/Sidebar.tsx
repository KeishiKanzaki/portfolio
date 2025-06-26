"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Home, User, X } from "lucide-react"
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
    }
  ]

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-white border-r min-h-screen p-6
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Close button */}
      <div className="flex justify-end mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="p-2"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
        
        <div className="space-y-6">
        {/* User Profile */}
        <div className="text-center">
          <Avatar className="w-16 h-16 mx-auto mb-3">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-500">就活生</p>
          <Badge className="mt-2 bg-green-100 text-green-700">アクティブ</Badge>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  item.isActive
                    ? "bg-blue-50 text-blue-700"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
