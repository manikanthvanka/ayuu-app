"use client"

import { Download, X, FileText, User, Calendar, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface PatientReportModalProps {
  open: boolean
  onClose: () => void
  patient: any
  consultationData?: any
}

export function PatientReportModal({ open, onClose, patient, consultationData }: PatientReportModalProps) {
  const generatePDF = () => {
    // Generate PDF with consultation data
    const reportContent = `
      MEDICAL CONSULTATION REPORT
      
      Patient Information:
      Name: ${patient?.name || "N/A"}
      MR Number: ${patient?.mrNumber || "N/A"}
      Age: ${patient?.age || "N/A"} years
      Gender: ${patient?.gender || "N/A"}
      Date: ${new Date().toLocaleDateString()}
      
      Doctor's Notes:
      ${consultationData?.notes || "No notes available"}
      
      Medications Prescribed:
      ${consultationData?.medications || "No medications prescribed"}
      
      Tests Ordered:
      ${consultationData?.testsOrdered || "No tests ordered"}
      
      Next Visit:
      Date: ${consultationData?.nextVisitDate || "Not scheduled"}
      Reason: ${consultationData?.nextVisitReason || "N/A"}
      
      Generated on: ${new Date().toLocaleString()}
    `

    // Create a blob and download
    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${patient?.name || "Patient"}_Report_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>Medical Report</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-primary mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Name:</span> {patient?.name || "N/A"}
              </div>
              <div>
                <span className="font-medium">MR Number:</span> {patient?.mrNumber || "N/A"}
              </div>
              <div>
                <span className="font-medium">Age:</span> {patient?.age || "N/A"} years
              </div>
              <div>
                <span className="font-medium">Gender:</span> {patient?.gender || "N/A"}
              </div>
            </div>
          </div>

          {/* Consultation Date */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Consultation Date
            </h3>
            <p className="text-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Doctor's Notes */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
              <Stethoscope className="w-4 h-4 mr-2" />
              Doctor's Notes
            </h3>
            <div className="text-sm whitespace-pre-wrap bg-white p-3 rounded border">
              {consultationData?.notes || "No consultation notes available"}
            </div>
          </div>

          {/* Medications */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-3">Medications Prescribed</h3>
            <div className="text-sm whitespace-pre-wrap bg-white p-3 rounded border">
              {consultationData?.medications || "No medications prescribed"}
            </div>
          </div>

          {/* Tests Ordered */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-700 mb-3">Tests Ordered</h3>
            <div className="text-sm whitespace-pre-wrap bg-white p-3 rounded border">
              {consultationData?.testsOrdered || "No tests ordered"}
            </div>
          </div>

          {/* Next Visit */}
          {consultationData?.nextVisitDate && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-700 mb-3">Next Visit</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Date:</span> {consultationData.nextVisitDate}
                </div>
                <div>
                  <span className="font-medium">Reason:</span> {consultationData.nextVisitReason || "Follow-up"}
                </div>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="flex justify-center">
            <Badge className="bg-green-100 text-green-800">Consultation Completed</Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t print:hidden">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
          <div className="flex gap-2">
            <Button onClick={() => window.print()} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Print Report
            </Button>
            <Button onClick={generatePDF} className="bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
