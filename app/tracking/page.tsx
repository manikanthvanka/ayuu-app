"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PatientStageTracking } from "@/components/tracking/patient-stage-tracking"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import type { User } from "@/lib/types"
import { useAuth } from "@/components/auth/AuthProvider"

export default function TrackingPage() {
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
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

  const handleBack = () => {
    router.push("/dashboard")
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-hidden">
      <Sidebar user={user} isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        <div className="flex-1 overflow-auto">
          <PatientStageTracking onBack={handleBack} />
        </div>
      </div>
    </div>
  )
}
