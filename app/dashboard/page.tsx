"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardCards } from "@/components/dashboard/dashboard-cards"
import { DashboardActions } from "@/components/dashboard/dashboard-actions"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react"
import { EnhancedAppointmentsTable } from "@/components/dashboard/enhanced-appointments-table"
import { useAuth } from "@/components/auth/AuthProvider"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [appointmentCounts, setAppointmentCounts] = useState({
    active: 3,
    completed: 1,
    returnQueue: 0,
  })
  const router = useRouter()

  if (loading || !user) {
    return null // Global overlay or redirect will handle loading/auth
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const handleStatusUpdate = (appointmentId: string, newStatus: string) => {
    // Update counts based on status change
    setAppointmentCounts((prev) => {
      const newCounts = { ...prev }

      if (newStatus === "completed") {
        newCounts.completed += 1
        newCounts.active = Math.max(0, newCounts.active - 1)
      } else if (newStatus === "return_queue") {
        newCounts.returnQueue += 1
        newCounts.active = Math.max(0, newCounts.active - 1)
      } else if (["scheduled", "vitals_done", "with_doctor"].includes(newStatus)) {
        newCounts.active += 1
      }

      return newCounts
    })
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-hidden">
      <Sidebar user={user} isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Breadcrumb Navigation */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Quick Actions */}
            <DashboardActions user={user} />

            {/* Dashboard Cards */}
            <DashboardCards counts={appointmentCounts} />

            {/* Appointments Table */}
            <EnhancedAppointmentsTable userRole={user.role} onStatusUpdate={handleStatusUpdate} />
          </div>
        </div>
      </div>
    </div>
  )
}
