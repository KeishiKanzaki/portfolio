"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, Menu } from "lucide-react"
import LogoutButton from "@/components/dashboard/LogoutButton"

interface HeaderProps {
  user: {
    name?: string
    email?: string
  }
  notificationCount?: number
  onMenuClick: () => void
}

export default function Header({ user, notificationCount = 0, onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
      {/* Menu button for all screen sizes */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onMenuClick}
      >
        <Menu className="w-4 h-4" />
      </Button>
      
      <div className="flex flex-1 items-center justify-end md:justify-between">
        <div className="flex items-center gap-4 md:gap-2 lg:gap-4">
          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <Badge className="ml-1" variant="secondary">
                {notificationCount}
              </Badge>
            )}
          </Button>
          <Button variant="ghost" size="sm">
            <Search className="w-4 h-4" />
          </Button>
          <LogoutButton />
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
