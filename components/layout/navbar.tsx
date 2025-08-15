"use client"

import { Button } from "@/components/ui/button"
import { Menu, Bell, Stethoscope } from "lucide-react"
import type { User as UserType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface NavbarProps {
  user: UserType
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

export function Navbar({ user, onToggleSidebar, sidebarOpen }: NavbarProps) {
  return (
    <nav className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
      <div className="flex items-center gap-4">
        {/* Hamburger Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <Menu className={cn("h-5 w-5 text-gray-700", sidebarOpen && "rotate-90")} />
        </Button>

        {/* App Logo/Title with Ayuu branding */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-md">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Ayuu</h1>
            <p className="text-xs text-gray-600 leading-none">Healthcare Management System</p>
          </div>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="hover:bg-gray-100 relative">
          <Bell className="h-5 w-5 text-gray-700" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
            <span className="h-2 w-2 bg-red-500 rounded-full"></span>
          </span>
        </Button>

        {/* User Profile */}
        
      </div>
    </nav>
  )
}
