"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Home, Search, Calendar, Clock } from "lucide-react"
import { samplePatients } from "@/lib/sample-data"
import { useAuth } from "@/components/auth/AuthProvider"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Patient {
  id: string
  patientId: string
  fullName: string
  email: string
  phone: string
  dateOfBirth: Date
}

export default function PatientSearchPage() {
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Patient[]>([])
  const [rescheduleModal, setRescheduleModal] = useState<{
    isOpen: boolean
    patient: Patient | null
  }>({ isOpen: false, patient: null })
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"
  ]

  if (loading || !user) {
    return null // Global overlay or redirect will handle loading/auth
  }

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }

    const results = samplePatients.filter(
      (patient) =>
        patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm),
    )
    setSearchResults(results)
  }

  const openRescheduleModal = (patient: Patient) => {
    setRescheduleModal({ isOpen: true, patient })
    setNewDate("")
    setNewTime("")
  }

  const closeRescheduleModal = () => {
    setRescheduleModal({ isOpen: false, patient: null })
  }

  const handleReschedule = () => {
    if (!newDate || !newTime) {
      toast({
        title: "⚠️ Missing Information",
        description: "Please select both date and time",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "✅ Appointment Rescheduled",
      description: `${rescheduleModal.patient?.fullName}'s appointment rescheduled to ${newDate} at ${newTime}`,
    })

    closeRescheduleModal()
  }

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
                  <BreadcrumbPage>Patient Search</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Patient Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Search by name, patient ID, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Search Results ({searchResults.length})</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient ID</TableHead>
                          <TableHead>Full Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Date of Birth</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchResults.map((patient) => (
                          <TableRow key={patient.id}>
                            <TableCell className="font-medium">{patient.patientId}</TableCell>
                            <TableCell>{patient.fullName}</TableCell>
                            <TableCell>{patient.email}</TableCell>
                            <TableCell>{patient.phone}</TableCell>
                            <TableCell>{patient.dateOfBirth.toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openRescheduleModal(patient)}
                                className="flex items-center gap-1"
                              >
                                <Calendar className="h-3 w-3" />
                                Reschedule
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {searchTerm && searchResults.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No patients found matching your search criteria.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      <Dialog open={rescheduleModal.isOpen} onOpenChange={closeRescheduleModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#0F52BA]">Reschedule Appointment</DialogTitle>
            <div className="text-sm text-gray-600">
              <p><strong>Patient:</strong> {rescheduleModal.patient?.fullName}</p>
              <p><strong>Patient ID:</strong> {rescheduleModal.patient?.patientId}</p>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="newDate">New Date</Label>
              <Input
                id="newDate"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="newTime">New Time</Label>
              <Select value={newTime} onValueChange={setNewTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {time}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeRescheduleModal}>
              Cancel
            </Button>
            <Button onClick={handleReschedule} className="bg-[#4169E1] hover:bg-[#000080]">
              Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
