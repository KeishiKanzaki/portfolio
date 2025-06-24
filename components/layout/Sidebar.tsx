"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Home, User } from "lucide-react"

interface SidebarProps {
  user: {
    name?: string
    email?: string
  }
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/dashboard",
      icon: Home,
      label: "ダッシュボード",
      isActive: pathname === "/dashboard"
    },
    {
      href: "/self-analysis-page",
      icon: User,
      label: "自己分析",
      isActive: pathname === "/self-analysis-page"
    }
  ]

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6">
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
