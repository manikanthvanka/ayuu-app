
export interface LoginFormData {
  username: string
  password: string
  role: string
}

export interface RegFormData {
  username: string
  password: string
  role: string
  email: string
  phone: string
  fullName: string
}

export interface Role {
  id: string
  role_name: string
  description: string
}
export interface User {
  id: string
  username: string
  email: string
  phone: string
  fullName: string
  role: "staff" | "doctor" | "admin"
  createdAt: Date
}

export interface Patient {
  id: string
  patientId: string
  fullName: string
  email: string
  phone: string
  dateOfBirth: Date
  address: string
  emergencyContact: string
  createdAt: Date
}

export interface Doctor {
  id: string
  name: string
  specialization: string
  department: string
}

export interface Appointment {
  id: string
  tokenNumber: number
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  appointmentSlot: string
  appointmentDate: Date
  status: "scheduled" | "vitals_done" | "with_doctor" | "completed" | "return_queue" | "cancelled"
  vitals?: {
    bloodPressure: string
    temperature: string
    pulse: string
    weight: string
    height: string
  }
  diagnosis?: string
  tests?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface FieldSetting {
  id: string
  screen: string
  field: string
  label: string
  description: string
  visible: boolean
}
