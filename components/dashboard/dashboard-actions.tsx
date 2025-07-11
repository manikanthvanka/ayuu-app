"use client"

import { Button } from "@/components/ui/button"
import { UserPlus, CalendarPlus, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/types"

interface DashboardActionsProps {
  user: User
}

export function DashboardActions({ user }: DashboardActionsProps) {
  const router = useRouter()

  const staffAdminActions = [
    {
      label: "Register Patient",
      icon: UserPlus,
      onClick: () => router.push("/patients/register"),
      className: "bg-emerald-500 hover:bg-emerald-600 text-white",
    },
    {
      label: "Book Appointment",
      icon: CalendarPlus,
      onClick: () => router.push("/appointments/book"),
      className: "bg-blue-500 hover:bg-blue-600 text-white",
    },
    {
      label: "Patient Search",
      icon: Search,
      onClick: () => router.push("/patients/search"),
      className: "bg-purple-500 hover:bg-purple-600 text-white",
    },
  ]

  const doctorActions = [
    {
      label: "Patient Search",
      icon: Search,
      onClick: () => router.push("/patients/search"),
      className: "bg-purple-500 hover:bg-purple-600 text-white",
    },
  ]

  const actions = user.role === "doctor" ? doctorActions : staffAdminActions

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Button
            key={action.label}
            onClick={action.onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${action.className}`}
          >
            <Icon className="h-4 w-4" />
            {action.label}
          </Button>
        )
      })}
    </div>
  )
}
