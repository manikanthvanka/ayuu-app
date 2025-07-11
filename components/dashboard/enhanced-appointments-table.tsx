"use client"

import { useState, useMemo } from "react"
import { Search, ChevronLeft, ChevronRight, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EnhancedVitalsModal } from "@/components/vitals/enhanced-vitals-modal"
import { PatientReportModal } from "@/components/reports/patient-report-modal"
import { useToast } from "@/hooks/use-toast"
import { sampleAppointments } from "@/lib/sample-data"
import type { Appointment } from "@/lib/types"
import { cn } from "@/lib/utils"

interface EnhancedAppointmentsTableProps {
  userRole: "staff" | "doctor" | "admin"
  onStatusUpdate?: (appointmentId: string, newStatus: string) => void
}

export function EnhancedAppointmentsTable({ userRole, onStatusUpdate }: EnhancedAppointmentsTableProps) {
  const [appointments, setAppointments] = useState(sampleAppointments)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showVitalsModal, setShowVitalsModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const { toast } = useToast()

  const today = new Date().toDateString()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vitals_done":
        return "bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100"
      case "with_doctor":
        return "bg-orange-50 text-orange-900 border-orange-200 hover:bg-orange-100"
      case "return_queue":
        return "bg-yellow-50 text-yellow-900 border-yellow-200 hover:bg-yellow-100"
      case "completed":
        return "bg-green-50 text-green-900 border-green-200 hover:bg-green-100"
      default:
        return "bg-gray-50 text-gray-900 border-gray-200 hover:bg-gray-100"
    }
  }

  const filteredAppointments = useMemo(() => {
    const todayAppointments = appointments.filter((apt) => apt.appointmentDate.toDateString() === today)

    if (!searchTerm) return todayAppointments

    return todayAppointments.filter(
      (item) =>
        item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tokenNumber?.toString().includes(searchTerm) ||
        item.patientId.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [appointments, searchTerm, today])

  // Sort appointments: Completed ones go to the end, others by token number
  const sortedAppointments = useMemo(() => {
    return [...filteredAppointments].sort((a, b) => {
      if (a.status === "completed" && b.status !== "completed") return 1
      if (a.status !== "completed" && b.status === "completed") return -1
      return (a.tokenNumber || 0) - (b.tokenNumber || 0)
    })
  }, [filteredAppointments])

  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAppointments = sortedAppointments.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleVitalsClick = (appointment: Appointment) => {
    // Prevent vitals update for completed patients
    if (appointment.status === "completed") {
      toast({
        title: "⚠️ Cannot Update Vitals",
        description: "Vitals cannot be updated for completed patients",
        variant: "destructive",
      })
      return
    }

    setSelectedAppointment(appointment)
    setShowVitalsModal(true)
  }

  const handleVitalsUpdate = (vitals: any) => {
    if (selectedAppointment) {
      updateAppointmentStatus(selectedAppointment.id, "vitals_done", { vitals })
      setSelectedAppointment(null)
    }
  }

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    updateAppointmentStatus(appointmentId, newStatus)
  }

  const updateAppointmentStatus = (appointmentId: string, newStatus: string, additionalData?: any) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: newStatus as any, updatedAt: new Date(), ...additionalData } : apt,
      ),
    )
    onStatusUpdate?.(appointmentId, newStatus)
  }

  const handleReportClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowReportModal(true)
  }

  const getActionButtons = (appointment: Appointment) => {
    const buttons = []

    if (userRole === "staff") {
      buttons.push(
        <Button
          key="vitals"
          size="sm"
          onClick={() => handleVitalsClick(appointment)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground mr-2"
        >
          <Activity className="w-4 h-4 mr-1" />
          Vitals
        </Button>,
      )
    }

    if (userRole === "doctor") {
      buttons.push(
        <Button
          key="vitals"
          size="sm"
          onClick={() => handleVitalsClick(appointment)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground mr-2"
        >
          <Activity className="w-4 h-4 mr-1" />
          {appointment.status === "vitals_done" ? "Update Vitals" : "Record Vitals"}
        </Button>,
      )

      buttons.push(
        <Select
          key="status"
          onValueChange={(value) => {
            if (value === "completed") {
              handleReportClick(appointment)
            }
            handleStatusChange(appointment.id, value)
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Update Status" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="with_doctor">With Doctor</SelectItem>
            <SelectItem value="return_queue">Return Queue</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>,
      )
    }

    if (userRole === "admin") {
      buttons.push(
        <Select key="admin-status" onValueChange={(value) => handleStatusChange(appointment.id, value)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Update" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="vitals_done">Vitals Done</SelectItem>
            <SelectItem value="with_doctor">With Doctor</SelectItem>
            <SelectItem value="return_queue">Return Queue</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>,
      )
    }

    return buttons
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="text-xl">{"Today's Appointments"}</CardTitle>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAppointments.map((appointment, index) => (
                  <TableRow
                    key={appointment.id}
                    className={cn("hover:bg-gray-50", index % 2 === 0 ? "bg-white" : "bg-gray-50/50")}
                  >
                    <TableCell>
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                        {appointment.tokenNumber || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-primary font-bold">{appointment.patientId}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointment.patientName}</p>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.doctorName}</TableCell>
                    <TableCell>{appointment.appointmentSlot}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(appointment.status)} border transition-colors`}>
                        {appointment.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">{getActionButtons(appointment)}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mt-6">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedAppointments.length)} of{" "}
              {sortedAppointments.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={currentPage === page ? "bg-primary hover:bg-primary/90" : ""}
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedAppointment && (
        <>
          <EnhancedVitalsModal
            isOpen={showVitalsModal}
            onClose={() => {
              setShowVitalsModal(false)
              setSelectedAppointment(null)
            }}
            appointment={selectedAppointment}
            onSave={handleVitalsUpdate}
          />
          <PatientReportModal
            open={showReportModal}
            onClose={() => {
              setShowReportModal(false)
              setSelectedAppointment(null)
            }}
            patient={{
              name: selectedAppointment.patientName,
              mrNumber: selectedAppointment.patientId,
              age: 35,
              gender: "N/A",
            }}
            consultationData={{
              notes: "Patient consultation completed successfully.",
              medications: "Prescribed medications as per consultation.",
              testsOrdered: "Blood test, X-ray recommended.",
              nextVisitDate: "2024-02-15",
              nextVisitReason: "Follow-up consultation",
            }}
          />
        </>
      )}
    </>
  )
}
