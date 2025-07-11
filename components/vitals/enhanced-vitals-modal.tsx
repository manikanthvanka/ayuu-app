"use client"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Info, Heart, Activity, User, Stethoscope, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getVitalRanges, getVitalStatus, calculateBMI, getBMICategory } from "@/utils/vitalsUtils"
import { calculateCardiovascularRisk, type CardiovascularRisk } from "@/utils/mlPrediction"
import { createCriticalVitalsNotification, notificationStore } from "@/utils/notificationUtils"
import type { Appointment } from "@/lib/types"

interface EnhancedVitalsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (vitalsData: any) => void
  appointment: Appointment | null
  existingVitals?: any
  isCompleted?: boolean
}

export function EnhancedVitalsModal({
  isOpen,
  onClose,
  onSave,
  appointment,
  existingVitals,
  isCompleted = false,
}: EnhancedVitalsModalProps) {
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
  const [riskAssessment, setRiskAssessment] = useState<CardiovascularRisk | null>(null)
  const { toast } = useToast()

  // Assume patient age for demo (in real app, this would come from patient data)
  const patientAge = 35

  // ✅ Memoise ranges so reference stays stable between renders
  const vitalRanges = useMemo(() => getVitalRanges(patientAge), [patientAge])

  // Convert Celsius to Fahrenheit for temperature ranges
  const tempRangeF = {
    min: (vitalRanges.temperature.min * 9) / 5 + 32,
    max: (vitalRanges.temperature.max * 9) / 5 + 32,
    unit: "°F",
  }

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

  // Auto-calculate BMI, check for critical values, and run ML prediction
  useEffect(() => {
    const height = Number.parseFloat(vitals.height)
    const weight = Number.parseFloat(vitals.weight)

    if (height > 0 && weight > 0) {
      const calculatedBMI = calculateBMI(height, weight)
      setBmi(calculatedBMI)
    } else {
      setBmi(0)
    }

    // Check for critical values
    const warnings: string[] = []

    if (vitals.systolic && getVitalStatus(Number.parseFloat(vitals.systolic), vitalRanges.systolic) === "critical") {
      warnings.push("Systolic BP is in critical range")
    }
    if (vitals.diastolic && getVitalStatus(Number.parseFloat(vitals.diastolic), vitalRanges.diastolic) === "critical") {
      warnings.push("Diastolic BP is in critical range")
    }
    if (vitals.pulse && getVitalStatus(Number.parseFloat(vitals.pulse), vitalRanges.pulse) === "critical") {
      warnings.push("Pulse rate is in critical range")
    }
    if (vitals.temperature) {
      const tempC = ((Number.parseFloat(vitals.temperature) - 32) * 5) / 9
      if (getVitalStatus(tempC, vitalRanges.temperature) === "critical") {
        warnings.push("Temperature is in critical range")
      }
    }
    if (vitals.spo2 && getVitalStatus(Number.parseFloat(vitals.spo2), vitalRanges.spo2) === "critical") {
      warnings.push("SpO2 is in critical range")
    }

    setCriticalWarnings(warnings)

    // Run ML prediction if all vital signs are available
    if (vitals.systolic && vitals.diastolic && vitals.pulse && vitals.temperature && vitals.spo2) {
      const mlInput = {
        systolic: Number.parseFloat(vitals.systolic),
        diastolic: Number.parseFloat(vitals.diastolic),
        pulse: Number.parseFloat(vitals.pulse),
        temperature: Number.parseFloat(vitals.temperature),
        spo2: Number.parseFloat(vitals.spo2),
        age: patientAge,
      }

      const risk = calculateCardiovascularRisk(mlInput)
      setRiskAssessment(risk)
    } else {
      setRiskAssessment(null)
    }
  }, [vitals, patientAge]) // vitalRanges is memoised, no longer a dependency

  const handleSave = () => {
    // Validate required fields
    if (!vitals.systolic || !vitals.diastolic || !vitals.pulse || !vitals.temperature) {
      toast({
        title: "⚠️ Missing Information",
        description: "Please fill in Blood Pressure, Pulse Rate, and Temperature",
        variant: "destructive",
      })
      return
    }

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
      patientName: appointment?.patientName || "",
      mrNumber: appointment?.patientId || "",
    }

    // Check for critical vitals and send notification
    const systolic = Number.parseFloat(vitals.systolic)
    const spo2 = Number.parseFloat(vitals.spo2)

    if (systolic > 180 || spo2 < 90) {
      const notification = createCriticalVitalsNotification(
        appointment?.patientName || "",
        appointment?.patientId || "",
        { systolic, spo2 },
      )
      notificationStore.addNotification(notification)

      toast({
        title: "🚨 Critical Alert Sent",
        description: "Doctor has been notified of critical vitals",
        variant: "destructive",
      })
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
    setRiskAssessment(null)

    toast({
      title: "✅ Vitals Recorded",
      description: "Patient vitals have been successfully recorded",
    })

    onClose()
  }

  const getInputClassName = (value: string, range: any) => {
    if (!value) return "border-gray-300"
    const numValue = Number.parseFloat(value)
    const status = getVitalStatus(numValue, range)

    switch (status) {
      case "critical":
        return "border-red-500 bg-red-50"
      case "abnormal":
        return "border-yellow-500 bg-yellow-50"
      default:
        return "border-green-500 bg-green-50"
    }
  }

  const getTemperatureInputClassName = (value: string) => {
    if (!value) return "border-gray-300"
    const tempF = Number.parseFloat(value)
    const tempC = ((tempF - 32) * 5) / 9
    const status = getVitalStatus(tempC, vitalRanges.temperature)

    switch (status) {
      case "critical":
        return "border-red-500 bg-red-50"
      case "abnormal":
        return "border-yellow-500 bg-yellow-50"
      default:
        return "border-green-500 bg-green-50"
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-100 border-red-500 text-red-800"
      case "high":
        return "bg-orange-100 border-orange-500 text-orange-800"
      case "moderate":
        return "bg-yellow-100 border-yellow-500 text-yellow-800"
      case "low":
        return "bg-green-100 border-green-500 text-green-800"
      default:
        return "bg-gray-100 border-gray-500 text-gray-800"
    }
  }

  const getRiskProgressColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "moderate":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  if (isCompleted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary">Vitals - Completed Patient</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600">Cannot update vitals for completed patients.</p>
          </div>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg sm:max-w-2xl md:max-w-4xl lg:max-w-7xl max-h-[95vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-hover text-white p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <Stethoscope className="h-6 w-6" />
              {existingVitals ? "Update Vitals" : "Record Vitals"}
            </DialogTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-2 text-blue-100">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>
                  {appointment?.patientName} (Age: {patientAge})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>Token #{appointment?.tokenNumber}</span>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="flex flex-col md:flex-row flex-1">
          {/* Left Side - Vitals Input */}
          <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6">
            {criticalWarnings.length > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Critical Values Detected:</strong>
                  <ul className="list-disc list-inside mt-2">
                    {criticalWarnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Blood Pressure */}
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg font-medium text-gray-900 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Blood Pressure *
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                  <div>
                    <Label htmlFor="systolic">Systolic (mmHg)</Label>
                    <Input
                      id="systolic"
                      type="number"
                      placeholder="120"
                      value={vitals.systolic}
                      onChange={(e) => setVitals({ ...vitals, systolic: e.target.value })}
                      className={`text-base md:text-lg font-semibold text-center ${getInputClassName(vitals.systolic, vitalRanges.systolic)}`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Normal: {vitalRanges.systolic.min}-{vitalRanges.systolic.max} {vitalRanges.systolic.unit}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
                    <Input
                      id="diastolic"
                      type="number"
                      placeholder="80"
                      value={vitals.diastolic}
                      onChange={(e) => setVitals({ ...vitals, diastolic: e.target.value })}
                      className={`text-base md:text-lg font-semibold text-center ${getInputClassName(vitals.diastolic, vitalRanges.diastolic)}`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Normal: {vitalRanges.diastolic.min}-{vitalRanges.diastolic.max} {vitalRanges.diastolic.unit}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pulse and Temperature */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base md:text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    Pulse Rate *
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="number"
                    placeholder="72"
                    value={vitals.pulse}
                    onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                    className={`text-base md:text-lg font-semibold text-center ${getInputClassName(vitals.pulse, vitalRanges.pulse)}`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Normal: {vitalRanges.pulse.min}-{vitalRanges.pulse.max} {vitalRanges.pulse.unit}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base md:text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-orange-500" />
                    Temperature * (°F)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="98.6"
                    value={vitals.temperature}
                    onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                    className={`text-base md:text-lg font-semibold text-center ${getTemperatureInputClassName(vitals.temperature)}`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Normal: {tempRangeF.min.toFixed(1)}-{tempRangeF.max.toFixed(1)} °F
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* SpO2 and Physical Measurements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-cyan-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium text-gray-900 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-cyan-500" />
                    SpO2 (%)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="number"
                    placeholder="98"
                    value={vitals.spo2}
                    onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                    className={`text-lg font-semibold text-center ${getInputClassName(vitals.spo2, vitalRanges.spo2)}`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Normal: {vitalRanges.spo2.min}-{vitalRanges.spo2.max} {vitalRanges.spo2.unit}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium text-gray-900">Height (cm)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="number"
                    placeholder="170"
                    value={vitals.height}
                    onChange={(e) => setVitals({ ...vitals, height: e.target.value })}
                    className="text-lg font-semibold text-center"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter height in centimeters</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-indigo-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium text-gray-900">Weight (kg)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="number"
                    placeholder="70"
                    value={vitals.weight}
                    onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                    className="text-lg font-semibold text-center"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter weight in kilograms</p>
                </CardContent>
              </Card>
            </div>

            {/* BMI Display */}
            {bmi > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">BMI</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">{bmi}</span>
                      <Badge variant="outline">{getBMICategory(bmi)}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-gray-900">Clinical Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Additional clinical observations, patient complaints, or relevant notes..."
                  value={vitals.notes}
                  onChange={(e) => setVitals({ ...vitals, notes: e.target.value })}
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                {existingVitals ? "Update Vitals" : "Save Vitals"}
              </Button>
            </div>
          </div>

          {/* Right Side - Risk Assessment */}
          <div className="w-96 bg-gray-50 border-l p-6">
            <div className="sticky top-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  ML Risk Assessment
                </h3>

                {riskAssessment ? (
                  <div className="space-y-4">
                    {/* Overall Risk Score */}
                    <Card className={`border-2 ${getRiskColor(riskAssessment.level)}`}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center space-x-2 text-lg">
                          <Heart className="w-5 h-5" />
                          <span>CV Risk Assessment</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold mb-2">{riskAssessment.score}</div>
                          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                            <div
                              className={`h-3 rounded-full ${getRiskProgressColor(riskAssessment.level)}`}
                              style={{ width: `${Math.min(riskAssessment.score, 100)}%` }}
                            />
                          </div>
                          <Badge className={`${getRiskColor(riskAssessment.level)} text-sm px-3 py-1`}>
                            {riskAssessment.level.toUpperCase()} RISK
                          </Badge>
                        </div>

                        <div className="text-sm">
                          <p className="font-medium mb-2">{riskAssessment.message}</p>

                          <div className="space-y-1">
                            <p className="font-medium text-gray-700">Recommendations:</p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                              {riskAssessment.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <TrendingUp className="h-12 w-12 mx-auto" />
                    </div>
                    <p className="text-sm text-gray-500">Enter all vital signs to see ML risk assessment</p>
                  </div>
                )}

                {/* Information Alert */}
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 text-sm">
                    <p className="font-medium mb-2">Smart Vitals System:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Values validated by patient age ({patientAge} years)</li>
                      <li>Temperature in Fahrenheit (°F)</li>
                      <li>Auto BMI calculation</li>
                      <li>ML-based cardiovascular risk assessment</li>
                      <li>Critical alerts sent to doctors automatically</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
