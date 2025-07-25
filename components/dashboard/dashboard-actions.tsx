"use client"

import { Button } from "@/components/ui/button"
import { UserPlus, CalendarPlus, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/types"
\import React from "react"
import { useScreenFields } from '@/contexts/ScreenFieldsContext'
import { useState, lazy, Suspense, useEffect } from "react";

// Dynamic import for the modal to reduce initial bundle size
const BookAppointmentModal = lazy(() => import("@/components/appointments/BookAppointmentModal").then(mod => ({ default: mod.BookAppointmentModal })));
interface DashboardActionsProps {
  user: User
}

export function DashboardActions({ user }: DashboardActionsProps) {
  const router = useRouter()
  const { getFieldValue } = useScreenFields()
  const [showBookModal, setShowBookModal] = useState(false);

  // Preload routes for faster navigation
  useEffect(() => {
    // Preload patient registration and search pages
    const preloadRoutes = () => {
      if (user.role !== "doctor") {
        // Preload patient registration page
        import("@/components/patients/patient-registration");
        // Preload patient search page
        import("@/app/patients/search/page");
      }
    };
    
    preloadRoutes();
  }, [user.role]);

  const staffAdminActions = [
    {
      label: getFieldValue('register_patient_btn', 'dashboard'),
      icon: UserPlus,
      onClick: () => router.push("/patients/register"),
      className: "bg-emerald-500 hover:bg-emerald-600 text-white",
    },
    {
      label: getFieldValue('patient_search_btn', 'dashboard'),
      label: "Book Appointment",
      icon: CalendarPlus,
      onClick: () => setShowBookModal(true),
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
      label: getFieldValue('patient_search_btn', 'dashboard'),
      icon: Search,
      onClick: () => router.push("/patients/search"),
      className: "bg-purple-500 hover:bg-purple-600 text-white",
    },
  ]

  const actions = user.role === "doctor" ? doctorActions : staffAdminActions

  return (
    <>
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
      {/* Book Appointment Modal for staff/admin */}
      {user.role !== "doctor" && showBookModal && (
        <Suspense fallback={<div>Loading...</div>}>
          <BookAppointmentModal open={showBookModal} onClose={() => setShowBookModal(false)} user={user} />
        </Suspense>
      )}
    </>
  )
}
