"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Activity,
  Settings,
  LogOut,
  UserPlus,
  CalendarPlus,
  Stethoscope,
  Monitor,
  Shield,
  X,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { User } from "@/lib/types"

interface SidebarProps {
  user: User
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/auth/sign-in")
  }

  const handleLinkClick = () => {
    onClose() // Close sidebar when any link is clicked
  }

  const staffMenuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Activity },
    { href: "/patients/register", label: "Register Patient", icon: UserPlus },
    { href: "/appointments/book", label: "Book Appointment", icon: CalendarPlus },
    { href: "/queue", label: "Live Queue", icon: Monitor },
    { href: "/tracking", label: "Stage Tracking", icon: TrendingUp },
  ]

  const doctorMenuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Activity },
    { href: "/queue", label: "Live Queue", icon: Monitor },
    { href: "/consultations", label: "Consultations", icon: Stethoscope },
    { href: "/tracking", label: "Stage Tracking", icon: TrendingUp },
  ]

  const adminMenuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Activity },
    { href: "/patients/register", label: "Register Patient", icon: UserPlus },
    { href: "/appointments/book", label: "Book Appointment", icon: CalendarPlus },
    { href: "/queue", label: "Live Queue", icon: Monitor },
    { href: "/tracking", label: "Stage Tracking", icon: TrendingUp },
    { href: "/roles", label: "Role Management", icon: Shield },
    { href: "/settings", label: "Field Settings", icon: Settings },
  ]

  const getMenuItems = () => {
    switch (user.role) {
      case "staff":
        return staffMenuItems
      case "doctor":
        return doctorMenuItems
      case "admin":
        return adminMenuItems
      default:
        return []
    }
  }

  const menuItems = getMenuItems()

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-primary text-white z-50 transform transition-transform duration-200 ease-out shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Ayuu</h1>
              <p className="text-xs text-white/80 leading-none">Healthcare System</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/10 text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium group relative",
                    isActive
                      ? "bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30"
                      : "text-white/80 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-white/70")} />
                  <span className="truncate">{item.label}</span>
                  {isActive && <div className="absolute right-3 h-2 w-2 rounded-full bg-white/80" />}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Logout Section */}
        <div className="border-t border-white/20 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-white/80 hover:bg-white/10 hover:text-white group"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </>
  )
}
