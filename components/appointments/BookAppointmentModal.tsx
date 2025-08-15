"use client"

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { sampleDoctors, samplePatients } from "@/lib/sample-data";
import type { User } from "@/lib/types";
import Calendar from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import AppointmentCard from "./appointment-card";

interface BookAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
  preSelectedPatient?: any;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({ open, onClose, user, preSelectedPatient }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    patientId: preSelectedPatient?.mrNumber || "",
    doctorId: "",
    timeSlot: "",
  });

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
  ];

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId || !selectedDate || !formData.timeSlot) {
      return;
    }
    setShowPreview(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle appointment booking logic here
    console.log("Booking appointment:", { ...formData, date: selectedDate });
    alert("Appointment booked successfully!");
    onClose();
    setShowPreview(false);
  };

  const handleBackToForm = () => {
    setShowPreview(false);
  };

  // Create preview appointment data
  const previewAppointment = formData.patientId && formData.doctorId && selectedDate && formData.timeSlot ? {
    id: "preview",
    patientName: samplePatients.find(p => p.id === formData.patientId)?.fullName || "",
    patientId: samplePatients.find(p => p.id === formData.patientId)?.patientId || "",
    doctorName: sampleDoctors.find(d => d.id === formData.doctorId)?.name || "",
    appointmentTime: formData.timeSlot,
    appointmentDate: selectedDate ? format(selectedDate, "PPP") : "",
    appointmentType: sampleDoctors.find(d => d.id === formData.doctorId)?.specialization || "",
    status: "Pending",
    phone: samplePatients.find(p => p.id === formData.patientId)?.phone || "",
  } : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Book New Appointment
          </DialogTitle>
          <DialogDescription>Fill in the details to book a new appointment.</DialogDescription>
        </DialogHeader>
        <Card className="shadow-none border-0">
          <CardContent>
            {!showPreview ? (
              <form onSubmit={handlePreview} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="patient">Select Patient</Label>
                  <Select
                    value={formData.patientId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, patientId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {samplePatients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.patientId} - {patient.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="date" className="px-1">Select Date</Label>
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date"
                        className="w-full justify-between font-normal"
                        data-empty={!selectedDate}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date: Date | undefined) => {
                          setSelectedDate(date as Date | undefined);
                          setDatePickerOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
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
                            {/* Clock icon was removed from imports, so it's commented out */}
                            {/* <Clock className="h-4 w-4" /> */}
                            {slot}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!formData.patientId || !formData.doctorId || !selectedDate || !formData.timeSlot}
              >
                Preview Appointment
              </Button>
            </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Appointment Preview</h3>
                  <p className="text-sm text-gray-600">Please review the appointment details before confirming.</p>
                </div>
                
                {previewAppointment && (
                  <AppointmentCard 
                    appointment={previewAppointment}
                    showActions={false}
                    variant="preview"
                  />
                )}
                
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToForm}
                    className="flex-1"
                  >
                    Back to Form
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1"
                  >
                    Confirm Booking
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}; 