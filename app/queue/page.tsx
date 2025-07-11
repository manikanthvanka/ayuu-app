"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LiveQueue } from "@/components/queue/live-queue"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import type { User } from "@/lib/types"

export default function QueuePage() {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false) // Hidden by default
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/auth/sign-in")
    }
  }, [router])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen) // Toggle open/close
  }

  const closeSidebar = () => {
    setSidebarOpen(false) // Close sidebar
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading Queue...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar user={user} isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <Navbar user={user} onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Live Queue</h1>
              <p className="text-gray-600">Real-time patient appointment tracking</p>
            </div>

            {/* Queue Content */}
            <LiveQueue />
          </div>
        </div>
      </div>
    </div>
  )
}
