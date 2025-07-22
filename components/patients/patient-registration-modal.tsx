import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PatientRegistration from "@/components/patients/patient-registration";

interface PatientRegistrationModalProps {
  trigger?: React.ReactNode;
  onRegistered?: (patientData: any) => void;
}

const PatientRegistrationModal: React.FC<PatientRegistrationModalProps> = ({ trigger, onRegistered }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (val: boolean) => setOpen(val);

  const handleSubmit = (patientData: any) => {
    if (onRegistered) onRegistered(patientData);
    // Optionally close modal after registration
    // setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      )}
      <DialogContent className="max-w-3xl w-full h-[90vh] flex flex-col p-0">
        <DialogHeader>
          <DialogTitle className="text-[#0F52BA]">Register New Patient</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto p-0">
          <PatientRegistration onSubmit={handleSubmit} onBack={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientRegistrationModal; 