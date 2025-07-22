"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, CalendarIcon, Plus } from "lucide-react"
import { useAuth } from "@/components/auth/AuthProvider"
import { BookAppointmentModal } from "@/components/appointments/book-appointment-modal"

// Use dynamic imports with correct typing for components with props
const Sidebar = dynamic(() => import("@/components/layout/sidebar").then(mod => mod.Sidebar), { ssr: false })
const Navbar = dynamic(() => import("@/components/layout/navbar").then(mod => mod.Navbar), { ssr: false })

export default function BookAppointmentPage() {
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  if (loading || !user) {
    return null // Global overlay or redirect will handle loading/auth
  }

  useEffect(() => {
    if (!user) {
      router.push("/auth/sign-in")
    }
  }, [router, user])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-hidden">
      <Sidebar user={user} isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
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
                  <BreadcrumbPage>Book Appointment</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Book New Appointment
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-12">
                <div className="space-y-4">
                  <div className="h-24 w-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <CalendarIcon className="h-12 w-12 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Ready to book an appointment?</h3>
                    <p className="text-muted-foreground mb-6">
                      Click the button below to open the appointment booking form.
                    </p>
                    <BookAppointmentModal 
                      trigger={
                        <Button className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Book Appointment
                          </Button>
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
