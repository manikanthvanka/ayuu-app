"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { sampleAppointments } from "@/lib/sample-data"

export function LiveQueue() {
  const [appointments, setAppointments] = useState(sampleAppointments)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would fetch from an API or WebSocket
      setAppointments((prev) => [...prev])
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const today = new Date().toDateString()
  const todayAppointments = appointments
    .filter((apt) => apt.appointmentDate.toDateString() === today)
    .sort((a, b) => a.tokenNumber - b.tokenNumber)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: "Waiting", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
      vitals_done: { label: "Vitals Done", variant: "default" as const, color: "bg-blue-100 text-blue-800" },
      with_doctor: { label: "With Doctor", variant: "default" as const, color: "bg-green-100 text-green-800" },
      completed: { label: "Completed", variant: "default" as const, color: "bg-gray-100 text-gray-800" },
      return_queue: { label: "Return Queue", variant: "destructive" as const, color: "bg-red-100 text-red-800" },
      cancelled: { label: "Cancelled", variant: "destructive" as const, color: "bg-red-100 text-red-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getEstimatedWaitTime = (tokenNumber: number, currentStatus: string) => {
    if (currentStatus === "completed" || currentStatus === "cancelled") return "N/A"
    if (currentStatus === "with_doctor") return "In Progress"

    const activeAppointments = todayAppointments.filter(
      (apt) => apt.tokenNumber < tokenNumber && ["scheduled", "vitals_done", "with_doctor"].includes(apt.status),
    ).length

    return `${activeAppointments * 15} min`
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Waiting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayAppointments.filter((apt) => apt.status === "scheduled").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vitals Done</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayAppointments.filter((apt) => apt.status === "vitals_done").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">With Doctor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayAppointments.filter((apt) => apt.status === "with_doctor").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayAppointments.filter((apt) => apt.status === "completed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Queue - {"Today's Appointments"}</CardTitle>
          <CardDescription>Real-time view of patient appointments ordered by token number</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token #</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Slot</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Est. Wait</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todayAppointments.map((appointment) => (
                <TableRow key={appointment.id} className={appointment.status === "with_doctor" ? "bg-green-50" : ""}>
                  <TableCell className="font-bold text-lg">#{appointment.tokenNumber}</TableCell>
                  <TableCell className="font-medium">{appointment.patientName}</TableCell>
                  <TableCell>{appointment.doctorName}</TableCell>
                  <TableCell>{appointment.appointmentSlot}</TableCell>
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell>{getEstimatedWaitTime(appointment.tokenNumber, appointment.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
