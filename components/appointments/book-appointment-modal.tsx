"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CalendarIcon, Clock, Search, User, Phone } from "lucide-react"
import { format } from "date-fns"
import { sampleDoctors, samplePatients } from "@/lib/sample-data"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface BookAppointmentModalProps {
  trigger?: React.ReactNode
  patient?: any // Accept a patient object to pre-fill and lock patient selection
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function BookAppointmentModal({ trigger, patient, open: controlledOpen, onOpenChange }: BookAppointmentModalProps) {
  const [open, setOpen] = useState(false)
  const isControlled = controlledOpen !== undefined && onOpenChange !== undefined;
  const modalOpen = isControlled ? controlledOpen : open;
  const setModalOpen = isControlled ? onOpenChange! : setOpen;

  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date()) // Default to today
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    patientId: patient?.id || "",
    doctorId: "",
    timeSlot: "",
  })
  const { toast } = useToast()

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ]

  // Filter patients based on search query
  const filteredPatients = samplePatients.filter((patient) =>
    patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  )

  // If patient is provided, lock patientId and hide search
  const showPatientSearch = !patient;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Find patient and doctor details for toast
    const patient = samplePatients.find(p => p.id === formData.patientId)
    const doctor = sampleDoctors.find(d => d.id === formData.doctorId)
    
    // Handle appointment booking logic here
    console.log("Booking appointment:", { ...formData, date: selectedDate })
    
    // Show success toast
    toast({
      title: "Appointment Booked Successfully!",
      description: `${patient?.fullName} scheduled with Dr. ${doctor?.name} on ${format(selectedDate, "PPP")} at ${formData.timeSlot}`,
      variant: "default",
    })
    
    // Reset form and close modal
    setFormData({ patientId: "", doctorId: "", timeSlot: "" })
    setSelectedDate(new Date()) // Reset to today
    setSearchQuery("")
    setModalOpen(false)
  }

  const handlePatientSelect = (patientId: string) => {
    setFormData(prev => ({ ...prev, patientId }))
    setSearchQuery("") // Clear search after selection
  }

  const handleInputDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    if (value) {
      const date = new Date(value)
      setSelectedDate(date)
    }
  }

  const setToday = () => {
    setSelectedDate(new Date())
  }

  const setTomorrow = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setSelectedDate(tomorrow)
  }

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Book Appointment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Book New Appointment
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              {showPatientSearch ? (
                <>
                  <Label htmlFor="patient">Search Patient</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="patient"
                      placeholder="Search by name or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {/* Patient search results */}
                  {searchQuery && (
                    <div className="max-h-40 overflow-y-auto border rounded-md">
                      {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
                          <div
                            key={patient.id}
                            className={cn(
                              "p-3 cursor-pointer hover:bg-muted/50 border-b last:border-b-0",
                              formData.patientId === patient.id && "bg-primary/10 border-primary"
                            )}
                            onClick={() => handlePatientSelect(patient.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{patient.fullName}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {patient.phone}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-muted-foreground">
                          No patients found
                        </div>
                      )}
                    </div>
                  )}
                  {/* Selected patient display */}
                  {formData.patientId && !searchQuery && (
                    <div className="p-3 border rounded-md bg-muted/30">
                      {(() => {
                        const patient = samplePatients.find(p => p.id === formData.patientId)
                        return patient ? (
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{patient.fullName}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {patient.phone}
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setFormData(prev => ({ ...prev, patientId: "" }))}
                            >
                              ×
                            </Button>
                          </div>
                        ) : null
                      })()}
                    </div>
                  )}
                </>
              ) : (
                <div className="p-3 border rounded-md bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{patient?.fullName || patient?.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {patient?.phone}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor">Select Doctor</Label>
              <Select
                value={formData.doctorId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, doctorId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose doctor" />
                </SelectTrigger>
                <SelectContent>
                  {sampleDoctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Select Date</Label>
              
              
                             {/* Date input */}
               <div className="space-y-2">
                 <Input
                   type="date"
                   value={selectedDate.toISOString().split('T')[0]}
                   onChange={handleInputDateChange}
                   min={new Date().toISOString().split('T')[0]}
                   className="w-full"
                 />
                 <div className="text-xs text-muted-foreground">
                   Selected: {format(selectedDate, "PPP")}
                 </div>
               </div>
              
              {/* Quick selection buttons */}
              <div className="flex gap-2 mb-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={setToday}
                  className={cn(
                    "text-xs",
                    format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") && "bg-primary text-primary-foreground"
                  )}
                >
                  Today
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={setTomorrow}
                  className={cn(
                    "text-xs",
                    format(selectedDate, "yyyy-MM-dd") === format(new Date(Date.now() + 24*60*60*1000), "yyyy-MM-dd") && "bg-primary text-primary-foreground"
                  )}
                >
                  Tomorrow
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeSlot">Select Time Slot</Label>
              <Select
                value={formData.timeSlot}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, timeSlot: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {slot}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!formData.patientId || !formData.doctorId || !formData.timeSlot}
            >
              Book Appointment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}