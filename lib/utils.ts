import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusColor(status: string) {
  const statusColors = {
    scheduled: "bg-yellow-100 text-yellow-800 border-yellow-300",
    vitals_done: "bg-blue-100 text-blue-800 border-blue-300",
    with_doctor: "bg-green-100 text-green-800 border-green-300",
    completed: "bg-gray-100 text-gray-800 border-gray-300",
    return_queue: "bg-red-100 text-red-800 border-red-300",
    cancelled: "bg-red-100 text-red-800 border-red-300",
  }

  return statusColors[status as keyof typeof statusColors] || statusColors.scheduled
}
