"use client"

import PatientRegistration from "@/components/patients/patient-registration";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BookAppointmentModal } from "@/components/appointments/book-appointment-modal";

export default function RegisterPatientPage() {
  const router = useRouter();
  const [showBookModal, setShowBookModal] = useState(false);
  const [registeredPatient, setRegisteredPatient] = useState<any>(null);
  const [appointmentIntent, setAppointmentIntent] = useState<'now' | 'later' | 'none'>('none');

  // Handler for registration form submit
  const handleRegistration = (patientData: any) => {
    setRegisteredPatient(patientData);
    setAppointmentIntent(patientData.appointmentIntent || 'none');
    if (patientData.appointmentIntent === 'now' || patientData.appointmentIntent === 'later') {
      setShowBookModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center py-8">
      <PatientRegistration
        onSubmit={handleRegistration}
        onBack={() => router.push("/dashboard")}
      />
      {showBookModal && registeredPatient && (
        <BookAppointmentModal
          trigger={null}
          patient={registeredPatient}
          open={showBookModal}
          onOpenChange={setShowBookModal}
        />
      )}
    </div>
  );
} 