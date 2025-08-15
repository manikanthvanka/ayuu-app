"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Info, Heart, Activity, Stethoscope, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SimpleVitalsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (vitalsData: any) => void
  patientName: string
  mrNumber: string
  existingVitals?: any
  patientAge?: number
  isCompleted?: boolean
}

export function SimpleVitalsModal({
  isOpen,
  onClose,
  onSave,
  patientName,
  mrNumber,
  existingVitals,
  patientAge = 35,
  isCompleted = false,
}: SimpleVitalsModalProps) {
  const [vitals, setVitals] = useState({
    systolic: "",
    diastolic: "",
    pulse: "",
    temperature: "",
    spo2: "",
    height: "",
    weight: "",
    notes: "",
  })
  const [bmi, setBmi] = useState(0)
  const [criticalWarnings, setCriticalWarnings] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (existingVitals && isOpen) {
      const bpParts = existingVitals.bloodPressure?.split("/") || ["", ""]
      const tempF = existingVitals.temperature ? (Number.parseFloat(existingVitals.temperature) * 9) / 5 + 32 : ""

      setVitals({
        systolic: bpParts[0] || "",
        diastolic: bpParts[1] || "",
        pulse: existingVitals.heartRate || "",
        temperature: tempF.toString(),
        spo2: existingVitals.oxygenSaturation || "",
        height: existingVitals.height || "",
        weight: existingVitals.weight || "",
        notes: existingVitals.notes || "",
      })
    } else if (isOpen) {
      setVitals({
        systolic: "",
        diastolic: "",
        pulse: "",
        temperature: "",
        spo2: "",
        height: "",
        weight: "",
        notes: "",
      })
    }
  }, [existingVitals, isOpen])

  // Simple BMI calculation and critical value detection
  useEffect(() => {
    const height = Number.parseFloat(vitals.height)
    const weight = Number.parseFloat(vitals.weight)

    if (height > 0 && weight > 0) {
      const calculatedBMI = (weight / (height * height)) * 703 // Imperial formula
      setBmi(calculatedBMI)
    } else {
      setBmi(0)
    }

    // Simple critical value detection
    const warnings: string[] = []
    const systolicValue = Number.parseFloat(vitals.systolic)
    const diastolicValue = Number.parseFloat(vitals.diastolic)
    const pulseValue = Number.parseFloat(vitals.pulse)
    const spo2Value = Number.parseFloat(vitals.spo2)

    if (systolicValue > 180) {
      warnings.push("🚨 CRITICAL: Systolic BP > 180 mmHg")
    }
    if (diastolicValue > 120) {
      warnings.push("🚨 CRITICAL: Diastolic BP > 120 mmHg")
    }
    if (pulseValue > 120) {
      warnings.push("🚨 CRITICAL: Heart Rate > 120 bpm")
    }
    if (spo2Value < 90) {
      warnings.push("🚨 CRITICAL: SpO2 < 90%")
    }

    setCriticalWarnings(warnings)
  }, [vitals])

  const handleSave = async () => {
    // Validate required fields
    if (!vitals.systolic || !vitals.diastolic || !vitals.pulse || !vitals.temperature) {
      toast({
        title: "⚠️ Missing Information",
        description: "Please fill in Blood Pressure, Pulse Rate, and Temperature",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Convert temperature back to Celsius for storage
      const tempC = ((Number.parseFloat(vitals.temperature) - 32) * 5) / 9

      const vitalsData = {
        bloodPressure: `${vitals.systolic}/${vitals.diastolic}`,
        heartRate: vitals.pulse,
        temperature: tempC.toFixed(1),
        oxygenSaturation: vitals.spo2,
        height: vitals.height,
        weight: vitals.weight,
        bmi: bmi > 0 ? bmi.toString() : "",
        notes: vitals.notes,
        takenBy: "Current Staff User",
        takenAt: new Date().toISOString(),
        patientName,
        mrNumber,
      }

      onSave(vitalsData)

      // Reset form
      setVitals({
        systolic: "",
        diastolic: "",
        pulse: "",
        temperature: "",
        spo2: "",
        height: "",
        weight: "",
        notes: "",
      })
      setBmi(0)
      setCriticalWarnings([])

      toast({
        title: "✅ Vitals Recorded",
        description: "Patient vitals have been successfully recorded",
      })

      onClose()
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to save vitals. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getInputClassName = (value: string, min: number, max: number) => {
    if (!value) return ""
    const numValue = Number.parseFloat(value)
    if (numValue < min || numValue > max) return "border-red-500 focus:border-red-500"
    return "border-green-500 focus:border-green-500"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Record Patient Vitals
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-900">Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-blue-700">Patient Name</Label>
                  <p className="text-blue-900 font-semibold">{patientName}</p>
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-medium text-blue-700">MR Number</Label>
                  <p className="text-blue-900 font-semibold">{mrNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical Warnings */}
          {criticalWarnings.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  {criticalWarnings.map((warning, index) => (
                    <p key={index} className="text-sm font-medium">{warning}</p>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Vitals Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Blood Pressure */}
            <div className="space-y-2">
              <Label htmlFor="systolic" className="text-sm font-medium">
                Blood Pressure (mmHg)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="systolic"
                  placeholder="Systolic"
                  value={vitals.systolic}
                  onChange={(e) => setVitals(prev => ({ ...prev, systolic: e.target.value }))}
                  className={getInputClassName(vitals.systolic, 70, 200)}
                  disabled={isSaving}
                />
                <span className="flex items-center text-gray-500">/</span>
                <Input
                  placeholder="Diastolic"
                  value={vitals.diastolic}
                  onChange={(e) => setVitals(prev => ({ ...prev, diastolic: e.target.value }))}
                  className={getInputClassName(vitals.diastolic, 40, 130)}
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* Pulse Rate */}
            <div className="space-y-2">
              <Label htmlFor="pulse" className="text-sm font-medium">
                Pulse Rate (bpm)
              </Label>
              <Input
                id="pulse"
                placeholder="e.g., 72"
                value={vitals.pulse}
                onChange={(e) => setVitals(prev => ({ ...prev, pulse: e.target.value }))}
                className={getInputClassName(vitals.pulse, 50, 120)}
                disabled={isSaving}
              />
            </div>

            {/* Temperature */}
            <div className="space-y-2">
              <Label htmlFor="temperature" className="text-sm font-medium">
                Temperature (°F)
              </Label>
              <Input
                id="temperature"
                placeholder="e.g., 98.6"
                value={vitals.temperature}
                onChange={(e) => setVitals(prev => ({ ...prev, temperature: e.target.value }))}
                className={getInputClassName(vitals.temperature, 95, 105)}
                disabled={isSaving}
              />
            </div>

            {/* SpO2 */}
            <div className="space-y-2">
              <Label htmlFor="spo2" className="text-sm font-medium">
                SpO2 (%)
              </Label>
              <Input
                id="spo2"
                placeholder="e.g., 98"
                value={vitals.spo2}
                onChange={(e) => setVitals(prev => ({ ...prev, spo2: e.target.value }))}
                className={getInputClassName(vitals.spo2, 90, 100)}
                disabled={isSaving}
              />
            </div>

            {/* Height */}
            <div className="space-y-2">
              <Label htmlFor="height" className="text-sm font-medium">
                Height (inches)
              </Label>
              <Input
                id="height"
                placeholder="e.g., 70"
                value={vitals.height}
                onChange={(e) => setVitals(prev => ({ ...prev, height: e.target.value }))}
                disabled={isSaving}
              />
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-medium">
                Weight (lbs)
              </Label>
              <Input
                id="weight"
                placeholder="e.g., 150"
                value={vitals.weight}
                onChange={(e) => setVitals(prev => ({ ...prev, weight: e.target.value }))}
                disabled={isSaving}
              />
            </div>
          </div>

          {/* BMI Display */}
          {bmi > 0 && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-green-700">BMI</Label>
                    <p className="text-green-900 font-semibold text-lg">{bmi.toFixed(1)}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Clinical Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Enter any additional observations..."
              value={vitals.notes}
              onChange={(e) => setVitals(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isCompleted || isSaving}>
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving Vitals...</span>
              </div>
            ) : isCompleted ? (
              "Completed"
            ) : (
              "Save Vitals"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 