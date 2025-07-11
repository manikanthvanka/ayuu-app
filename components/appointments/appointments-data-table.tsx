"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Search, ChevronLeft, ChevronRight, Activity, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { SmartVitalsModal } from "@/components/vitals/smart-vitals-modal"
import { RescheduleModal } from "@/components/appointments/reschedule-modal"
import { DoctorConsultationPage } from "@/components/doctor/doctor-consultation-page"
import { useToast } from "@/hooks/use-toast"
import { useScreenFields } from "@/contexts/ScreenFieldsContext"
import { useGlobalLoading } from "@/components/ui/GlobalLoadingProvider"

interface Patient {
  id: string
  name: string
  email?: string
  phone?: string
  mr_number: string
  status: string
  gender?: string
  age?: number
  address?: string
  emergency_contact?: string
  created_at: string
  updated_at: string
}

interface Appointment {
  id: string
  patient_id?: string
  doctor_name?: string
  appointment_date: string
  appointment_time: string
  department?: string
  reason?: string
  status: string
  token?: number
  notes?: string
  created_at: string
  updated_at: string
  patients?: Patient
}

interface AppointmentsDataTableProps {
  appointments: Appointment[]
  patients: Patient[]
  userRole: string
  onUpdateStatus: (patientId: string, newStatus: string) => void
}

export const AppointmentsDataTable: React.FC<AppointmentsDataTableProps> = ({
  appointments,
  patients,
  userRole,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [vitalsModalOpen, setVitalsModalOpen] = useState(false)
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [showConsultationPage, setShowConsultationPage] = useState(false)
  const [selectedPatientVitals, setSelectedPatientVitals] = useState<any>(null)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const { toast } = useToast()
  const { getFieldValue } = useScreenFields()
  const { setLoading } = useGlobalLoading()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Vitals Done":
        return "bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100"
      case "With Doctor":
        return "bg-orange-50 text-orange-900 border-orange-200 hover:bg-orange-100"
      case "Sent for Tests":
        return "bg-yellow-50 text-yellow-900 border-yellow-200 hover:bg-yellow-100"
      case "Re-check Pending":
        return "bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100"
      case "Completed":
        return "bg-green-50 text-green-900 border-green-200 hover:bg-green-100"
      default:
        return "bg-gray-50 text-gray-900 border-gray-200 hover:bg-gray-100"
    }
  }

  const getMRNumber = (patient: Patient) => {
    return patient.mr_number
  }

  const filteredAppointments = useMemo(() => {
    const appointmentsWithPatients = appointments
      .map((appointment) => {
        const patient = appointment.patients || patients.find((p) => p.id === appointment.patient_id)
        return { ...appointment, patient }
      })
      .filter((item) => item.patient)

    if (!searchTerm) return appointmentsWithPatients

    return appointmentsWithPatients.filter(
      (item) =>
        item.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.token?.toString().includes(searchTerm) ||
        getMRNumber(item.patient!).toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [appointments, patients, searchTerm])

  // Sort appointments: Completed ones go to the end, others by token number
  const sortedAppointments = useMemo(() => {
    return [...filteredAppointments].sort((a, b) => {
      if (a.status === "Completed" && b.status !== "Completed") return 1
      if (a.status !== "Completed" && b.status === "Completed") return -1
      return (a.token || 0) - (b.token || 0)
    })
  }, [filteredAppointments])

  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAppointments = sortedAppointments.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleVitalsClick = async (appointment: any) => {
    if (appointment.status === "Completed") {
      toast({
        title: "⚠️ Cannot Update Vitals",
        description: "Vitals cannot be updated for completed patients",
        variant: "destructive",
      })
      return
    }
    setLoading(true);
    setLoadingAction(`vitals-${appointment.id}`)
    const mockVitals =
      appointment.status === "Vitals Done"
        ? {
            bloodPressure: "120/80",
            heartRate: "72",
            temperature: "98.6",
            weight: "150",
            height: "5'6\"",
            oxygenSaturation: "98",
            notes: "Patient appears comfortable",
          }
        : null
    setSelectedAppointment(appointment)
    setSelectedPatientVitals(mockVitals)
    setVitalsModalOpen(true)
    setLoadingAction(null)
    setLoading(false);
  }

  const handleRescheduleClick = (appointment: any) => {
    setSelectedAppointment(appointment)
    setRescheduleModalOpen(true)
  }

  const handleWithDoctorClick = (appointment: any) => {
    setSelectedAppointment(appointment)
    setShowConsultationPage(true)
  }

  const handleVitalsSave = (vitalsData: any) => {
    onUpdateStatus(selectedAppointment.patient_id, "Vitals Done")
    setVitalsModalOpen(false)
  }

  const handleReschedule = (newDate: string, newTime: string) => {
    toast({
      title: "✅ Appointment Rescheduled",
      description: `Appointment rescheduled to ${newDate} at ${newTime}`,
    })
    setRescheduleModalOpen(false)
  }

  const handleConsultationUpdate = (consultationData: any) => {
    onUpdateStatus(selectedAppointment.patient_id, "With Doctor")
    setShowConsultationPage(false)
  }

  const getActionButtons = (appointment: any) => {
    const buttons = []
    const isLoadingVitals = loadingAction === `vitals-${appointment.id}`

    if (userRole === "staff") {
      buttons.push(
        <Button
          key="vitals"
          size="sm"
          onClick={() => handleVitalsClick(appointment)}
          disabled={isLoadingVitals}
          className="bg-[#088F8F] hover:bg-[#000080] text-white mr-2"
        >
          {isLoadingVitals ? (
            <>
              <LoadingSpinner size="sm" className="mr-1" />
              Loading...
            </>
          ) : (
            <>
              <Activity className="w-4 h-4 mr-1" />
              Record Vitals
            </>
          )}
        </Button>,
      )
      buttons.push(
        <Button
          key="reschedule"
          size="sm"
          variant="outline"
          onClick={() => handleRescheduleClick(appointment)}
          className="border-primary text-primary hover:bg-primary hover:text-white mr-2 transition-all duration-200"
        >
          <Calendar className="w-4 h-4 mr-1" />
          Reschedule
        </Button>,
      )
    }

    if (userRole === "doctor") {
      buttons.push(
        <Button
          key="vitals"
          size="sm"
          onClick={() => handleVitalsClick(appointment)}
          disabled={isLoadingVitals}
          className="bg-primary hover:bg-white hover:text-primary hover:border-primary text-white border border-primary mr-2 shadow-sm hover:shadow-md transition-all duration-200"
        >
          {isLoadingVitals ? (
            <>
              <LoadingSpinner size="sm" className="mr-1" />
              Loading...
            </>
          ) : (
            <>
              <Activity className="w-4 h-4 mr-1" />
              {appointment.status === "Vitals Done" ? "Update Vitals" : "Record Vitals"}
            </>
          )}
        </Button>,
      )

      buttons.push(
        <Select
          onValueChange={(value) => {
            if (value === "With Doctor") {
              handleWithDoctorClick(appointment)
            } else {
              onUpdateStatus(appointment.patient_id!, value)
            }
          }}
        >
          <SelectTrigger className="w-36 border-primary/20 focus:border-primary">
            <SelectValue placeholder="Update Status" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="With Doctor">With Doctor</SelectItem>
            <SelectItem value="Sent for Tests">Sent for Tests</SelectItem>
            <SelectItem value="Re-check Pending">Re-check Pending</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>,
      )
    }

    if (userRole === "admin") {
      buttons.push(
        <Select onValueChange={(value) => onUpdateStatus(appointment.patient_id!, value)}>
          <SelectTrigger className="w-36 border-primary/20 focus:border-primary">
            <SelectValue placeholder="Update" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="Vitals Done">Vitals Done</SelectItem>
            <SelectItem value="With Doctor">With Doctor</SelectItem>
            <SelectItem value="Sent for Tests">Sent for Tests</SelectItem>
            <SelectItem value="Re-check Pending">Re-check Pending</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>,
      )
    }

    return buttons
  }

  if (showConsultationPage && selectedAppointment) {
    return (
      <DoctorConsultationPage
        patient={selectedAppointment.patient}
        onBack={() => setShowConsultationPage(false)}
        onUpdatePatientStatus={onUpdateStatus}
      />
    )
  }

  return (
    <>
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="text-xl text-gray-900">
              {getFieldValue("appointments_table_title", "dashboard") || "Today's Appointments"}
            </CardTitle>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64 border-gray-300 focus:border-primary focus:ring-primary/20"
                />
              </div>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-full sm:w-32 border-gray-300 focus:border-primary">
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
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-700">
                    {getFieldValue("token_column", "dashboard") || "Token"}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    {getFieldValue("mr_number_column", "dashboard") || "MR Number"}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    {getFieldValue("patient_name_column", "dashboard") || "Patient Name"}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    {getFieldValue("doctor_column", "dashboard") || "Doctor"}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    {getFieldValue("time_column", "dashboard") || "Time"}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    {getFieldValue("status_column", "dashboard") || "Status"}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    {getFieldValue("actions_column", "dashboard") || "Actions"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAppointments.map((appointment, index) => (
                  <TableRow
                    key={appointment.id}
                    className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <TableCell>
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                        {appointment.token || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-primary font-bold">{getMRNumber(appointment.patient!)}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patient?.name}</p>
                        <p className="text-sm text-gray-500">{appointment.patient?.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900">{appointment.doctor_name}</TableCell>
                    <TableCell className="text-gray-900">{appointment.appointment_time}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(appointment.status)} border transition-colors font-medium`}>
                        {appointment.status}
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
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mt-6 p-6 border-t border-gray-100">
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
                className="border-gray-300 hover:border-primary hover:text-primary"
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
                      className={
                        currentPage === page
                          ? "bg-primary hover:bg-primary-hover text-white"
                          : "border-gray-300 hover:border-primary hover:text-primary"
                      }
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
                className="border-gray-300 hover:border-primary hover:text-primary"
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
          <SmartVitalsModal
            isOpen={vitalsModalOpen}
            onClose={() => setVitalsModalOpen(false)}
            onSave={handleVitalsSave}
            patientName={selectedAppointment.patient?.name || ""}
            mrNumber={getMRNumber(selectedAppointment.patient!)}
            existingVitals={selectedPatientVitals}
            patientAge={selectedAppointment.patient?.age || 35}
            isCompleted={selectedAppointment.status === "Completed"}
          />
          <RescheduleModal
            isOpen={rescheduleModalOpen}
            onClose={() => setRescheduleModalOpen(false)}
            onReschedule={handleReschedule}
            patientName={selectedAppointment.patient?.name || ""}
            currentDate={selectedAppointment.appointment_date}
            currentTime={selectedAppointment.appointment_time}
          />
        </>
      )}
    </>
  )
}
