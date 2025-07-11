"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { lazy, Suspense } from "react"
import PatientRegistration from "@/components/patients/patient-registration"

// Dynamic import for the modal
const BookAppointmentModal = lazy(() => import("@/components/appointments/BookAppointmentModal").then(mod => ({ default: mod.BookAppointmentModal })));
import type { User } from "@/lib/types"

export default function PatientRegisterPage() {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showBookModal, setShowBookModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
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
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const handleBack = () => {
    router.push("/dashboard")
  }

  const handleRegistrationSubmit = (patientData: any) => {
    // Here you would typically save the patient data to your backend
    console.log("Patient registered:", patientData)
    // You could also update the global patient list here
  }

  const handleBookAppointment = (patientData: any) => {
    setSelectedPatient(patientData)
    setShowBookModal(true)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-hidden">
      <Sidebar user={user} isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <PatientRegistration
              onSubmit={handleRegistrationSubmit}
              onBack={handleBack}
              onBookAppointment={handleBookAppointment}
            />
          </div>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {showBookModal && selectedPatient && (
        <Suspense fallback={<div>Loading appointment modal...</div>}>
          <BookAppointmentModal 
            open={showBookModal} 
            onClose={() => {
              setShowBookModal(false)
              setSelectedPatient(null)
            }} 
            user={user}
            preSelectedPatient={selectedPatient}
          />
        </Suspense>
      )}
    </div>
  )
} 