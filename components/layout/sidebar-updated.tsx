"use client"

import type React from "react"
import { Home, UserPlus, Calendar, Users, RotateCcw, LogOut, Stethoscope, Search, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SettingsDropdown } from "@/components/settings/settings-dropdown"

type UserRole = "admin" | "doctor" | "staff" | "patient"
type ViewMode =
  | "dashboard"
  | "register"
  | "booking"
  | "queue"
  | "return-queue"
  | "search"
  | "role-management"
  | "user-management"
  | "patient-history"
  | "screen-fields"
  | "color-customization"
  | "stage-tracking"
  | "doctor-consultation"
  | "app-schedule"
  | "app-configuration"

interface SidebarProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
  onSignOut: () => void
  userRole: UserRole
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onSignOut, userRole }) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      roles: ["admin", "doctor", "staff", "patient"],
    },
    {
      id: "register",
      label: "Register Patient",
      icon: UserPlus,
      roles: ["admin", "staff"],
    },
    {
      id: "booking",
      label: "Book Appointment",
      icon: Calendar,
      roles: ["admin", "staff"],
    },
    {
      id: "search",
      label: "Patient Search",
      icon: Search,
      roles: ["admin", "staff", "doctor"],
    },
    {
      id: "queue",
      label: "Live Queue",
      icon: Users,
      roles: ["admin", "doctor", "staff"],
    },
    {
      id: "return-queue",
      label: "Return Queue",
      icon: RotateCcw,
      roles: ["admin", "doctor", "staff"],
    },
    {
      id: "stage-tracking",
      label: "Stage Tracking",
      icon: Clock,
      roles: ["admin"],
    },
    {
      id: "app-schedule",
      label: "Schedule View",
      icon: Calendar,
      roles: ["admin", "doctor", "staff"],
    },
  ]

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(userRole))

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col w-full shadow-sm">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
            <Stethoscope className="w-4 h-4 lg:w-5 lg:h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg lg:text-xl font-bold text-gray-900 truncate">Ayuu</h1>
            <p className="text-xs lg:text-sm text-gray-600 capitalize truncate">{userRole}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start h-10 lg:h-11 text-sm lg:text-base transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-sm hover:bg-primary/15"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => onViewChange(item.id as ViewMode)}
            >
              <Icon className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Button>
          )
        })}

        {/* Settings Dropdown for Admins */}
        {userRole === "admin" && <SettingsDropdown currentView={currentView} onViewChange={onViewChange} />}
      </nav>

      {/* Footer */}
      <div className="p-3 lg:p-4 border-t border-gray-100">
        <Button
          variant="ghost"
          onClick={onSignOut}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 h-10 lg:h-11 text-sm lg:text-base transition-all duration-200"
        >
          <LogOut className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3 flex-shrink-0" />
          <span className="truncate">Sign Out</span>
        </Button>

        <div className="text-center mt-3 lg:mt-4">
          <p className="text-xs text-gray-500">© 2024 Ayuu Healthcare System</p>
        </div>
      </div>
    </div>
  )
}
