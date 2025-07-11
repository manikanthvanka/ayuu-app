"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { SmartVitalsModal } from "@/components/vitals/smart-vitals-modal"
import { sampleAppointments } from "@/lib/sample-data"
import type { Appointment } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Activity } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AppointmentsTableProps {
  userRole: "staff" | "doctor" | "admin"
  onStatusUpdate?: (appointmentId: string, newStatus: string) => void
}

export function AppointmentsTable({ userRole, onStatusUpdate }: AppointmentsTableProps) {
  const [appointments, setAppointments] = useState(sampleAppointments)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showVitalsModal, setShowVitalsModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const { toast } = useToast()

  const today = new Date().toDateString()
  const todayAppointments = appointments.filter((apt) => apt.appointmentDate.toDateString() === today)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: {
        label: "Scheduled",
        className: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-800",
      },
      vitals_done: {
        label: "Vitals Done",
        className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800",
      },
      with_doctor: {
        label: "With Doctor",
        className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800",
      },
      completed: {
        label: "Completed",
        className: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-800",
      },
      return_queue: {
        label: "Return Queue",
        className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800",
      },
      cancelled: {
        label: "Cancelled",
        className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800",
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={cn("font-medium border transition-colors", config.className)}>{config.label}</Badge>
  }

  const updateAppointmentStatus = (appointmentId: string, newStatus: string, additionalData?: any) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: newStatus as any, updatedAt: new Date(), ...additionalData } : apt,
      ),
    )
    // Notify parent component about status change
    onStatusUpdate?.(appointmentId, newStatus)
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

  const handleVitalsClick = async (appointment: Appointment) => {
    if (appointment.status === "completed") {
      toast({
        title: "⚠️ Cannot Update Vitals",
        description: "Vitals cannot be updated for completed patients",
        variant: "destructive",
      })
      return
    }

    setLoadingAction(`vitals-${appointment.id}`)

    // Simulate loading
    setTimeout(() => {
      setSelectedAppointment(appointment)
      setShowVitalsModal(true)
      setLoadingAction(null)
    }, 1000)
  }

  return (
    <>
      <LoadingOverlay isLoading={isLoading} message="Loading appointments...">
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 pb-4">
            <CardTitle className="text-gray-900">{"Today's Appointments"}</CardTitle>
            <CardDescription className="text-gray-600">
              Overview of all appointments scheduled for today
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Token</TableHead>
                    <TableHead className="font-semibold text-gray-700">Patient ID</TableHead>
                    <TableHead className="font-semibold text-gray-700">Patient Name</TableHead>
                    <TableHead className="font-semibold text-gray-700">Slot</TableHead>
                    <TableHead className="font-semibold text-gray-700">Doctor</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAppointments.map((appointment, index) => {
                    const isLoadingVitals = loadingAction === `vitals-${appointment.id}`

                    return (
                      <TableRow
                        key={appointment.id}
                        className={cn("hover:bg-gray-50", index % 2 === 0 ? "bg-white" : "bg-gray-50/50")}
                      >
                        <TableCell className="font-bold text-primary">#{appointment.tokenNumber}</TableCell>
                        <TableCell className="font-medium">{appointment.patientId}</TableCell>
                        <TableCell className="font-medium">{appointment.patientName}</TableCell>
                        <TableCell>{appointment.appointmentSlot}</TableCell>
                        <TableCell>{appointment.doctorName}</TableCell>
                        <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {/* Admin Status Dropdown - Only status updates */}
                            {userRole === "admin" && (
                              <Select
                                value={appointment.status}
                                onValueChange={(value) => handleStatusChange(appointment.id, value)}
                              >
                                <SelectTrigger className="w-40 border-primary/20 focus:border-primary">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="scheduled">Scheduled</SelectItem>
                                  <SelectItem value="vitals_done">Vitals Done</SelectItem>
                                  <SelectItem value="with_doctor">With Doctor</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="return_queue">Return Queue</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            )}

                            {/* Staff Record Vitals */}
                            {userRole === "staff" && appointment.status === "scheduled" && (
                              <Button
                                size="sm"
                                onClick={() => handleVitalsClick(appointment)}
                                disabled={isLoadingVitals}
                                className="bg-[#088F8F] hover:bg-[#000080] text-white mr-2"                              >
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
                              </Button>
                            )}

                            {/* Doctor Actions - Simplified */}
                            {userRole === "doctor" && (
                              <div className="flex gap-2">
                                {appointment.status === "vitals_done" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(appointment.id, "with_doctor")}
                                    className="border-primary text-primary hover:bg-primary hover:text-white"
                                  >
                                    Start Consultation
                                  </Button>
                                )}
                                {appointment.status === "with_doctor" && (
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleStatusChange(appointment.id, "return_queue")}
                                      className="border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white"
                                    >
                                      Tests
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleStatusChange(appointment.id, "completed")}
                                      className="bg-primary hover:bg-primary/90 text-white"
                                    >
                                      Complete
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </LoadingOverlay>

      {/* Smart Vitals Modal */}
      <SmartVitalsModal
        isOpen={showVitalsModal}
        onClose={() => {
          setShowVitalsModal(false)
          setSelectedAppointment(null)
        }}
        onSave={handleVitalsUpdate}
        patientName={selectedAppointment?.patientName || ""}
        mrNumber={selectedAppointment?.patientId || ""}
        existingVitals={selectedAppointment?.vitals}
        patientAge={35}
        isCompleted={selectedAppointment?.status === "completed"}
      />
    </>
  )
}
