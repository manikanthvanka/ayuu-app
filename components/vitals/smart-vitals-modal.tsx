"use client"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { AlertTriangle, Info, Heart, Activity, Stethoscope, User, TrendingUp, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getVitalRanges, getVitalStatus, calculateBMI, getBMICategory } from "@/utils/vitalsUtils"
import { calculateCardiovascularRisk, type CardiovascularRisk } from "@/utils/mlPrediction"
import { createCriticalVitalsNotification, notificationStore } from "@/utils/notificationUtils"
import { useGlobalLoading } from "@/components/ui/GlobalLoadingProvider"

interface VitalsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (vitalsData: any) => void
  patientName: string
  mrNumber: string
  existingVitals?: any
  patientAge?: number
  isCompleted?: boolean
}

export function SmartVitalsModal({
  isOpen,
  onClose,
  onSave,
  patientName,
  mrNumber,
  existingVitals,
  patientAge = 35,
  isCompleted = false,
}: VitalsModalProps) {
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
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { toast } = useToast()
  const { setLoading } = useGlobalLoading()

  // Memoise to prevent a new object each render (avoids infinite effect loop)
  const vitalRanges = useMemo(() => getVitalRanges(patientAge), [patientAge])

  // Convert Celsius to Fahrenheit for temperature ranges
  const tempRangeF = {
    min: (vitalRanges.temperature.min * 9) / 5 + 32,
    max: (vitalRanges.temperature.max * 9) / 5 + 32,
    unit: "°F",
  }

  useEffect(() => {
    if (existingVitals && isOpen) {
      setLoading(true)
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
      setLoading(false)
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
  }, [existingVitals, isOpen, setLoading])

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

    // Check for critical values with enhanced detection
    const warnings: string[] = []

    // Enhanced critical value detection
    const systolicValue = Number.parseFloat(vitals.systolic)
    const diastolicValue = Number.parseFloat(vitals.diastolic)
    const pulseValue = Number.parseFloat(vitals.pulse)
    const spo2Value = Number.parseFloat(vitals.spo2)

    // Critical BP detection (systolic > 180 as specified)
    if (systolicValue > 180) {
      warnings.push("🚨 CRITICAL: Systolic BP > 180 mmHg - Hypertensive Crisis!")
    }
    if (diastolicValue > 120) {
      warnings.push("🚨 CRITICAL: Diastolic BP > 120 mmHg - Hypertensive Crisis!")
    }
    if (systolicValue < 90) {
      warnings.push("⚠️ CRITICAL: Systolic BP < 90 mmHg - Severe Hypotension!")
    }

    // Critical pulse detection
    if (pulseValue > 120) {
      warnings.push("🚨 CRITICAL: Heart Rate > 120 bpm - Severe Tachycardia!")
    }
    if (pulseValue < 50) {
      warnings.push("⚠️ CRITICAL: Heart Rate < 50 bpm - Severe Bradycardia!")
    }

    // Critical SpO2 detection
    if (spo2Value < 90) {
      warnings.push("🚨 CRITICAL: SpO2 < 90% - Severe Hypoxemia!")
    }

    // Critical temperature detection
    if (vitals.temperature) {
      const tempF = Number.parseFloat(vitals.temperature)
      const tempC = ((tempF - 32) * 5) / 9
      if (tempC > 39.0) {
        warnings.push("🚨 CRITICAL: Temperature > 39°C (102.2°F) - High Fever!")
      }
      if (tempC < 35.0) {
        warnings.push("⚠️ CRITICAL: Temperature < 35°C (95°F) - Hypothermia!")
      }
    }

    setCriticalWarnings(warnings)

    // Run ML prediction if sufficient vital signs are available
    if (vitals.systolic && vitals.diastolic && vitals.pulse) {
      setIsAnalyzing(true)
      // Simulate ML processing time
      setTimeout(() => {
        const mlInput = {
          systolic: systolicValue,
          diastolic: diastolicValue,
          pulse: pulseValue,
          temperature: vitals.temperature ? Number.parseFloat(vitals.temperature) : 98.6,
          spo2: spo2Value || 98,
          age: patientAge,
          bmi: bmi > 0 ? bmi : undefined,
        }

        const risk = calculateCardiovascularRisk(mlInput)
        setRiskAssessment(risk)
        setIsAnalyzing(false)
      }, 1500)
    } else {
      setRiskAssessment(null)
      setIsAnalyzing(false)
    }
  }, [vitals, vitalRanges, bmi])

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

    setLoading(true)

    try {
      // Simulate save processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

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
        riskAssessment: riskAssessment,
      }

      // Check for critical vitals and send notification
      const systolic = Number.parseFloat(vitals.systolic)
      const spo2 = Number.parseFloat(vitals.spo2)

      if (systolic > 180 || spo2 < 90 || criticalWarnings.length > 0) {
        const notification = createCriticalVitalsNotification(patientName, mrNumber, {
          systolic,
          spo2,
          warnings: criticalWarnings,
        })
        notificationStore.addNotification(notification)

        toast({
          title: "🚨 Critical Alert Sent",
          description: "Doctor has been notified of critical vitals immediately",
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
      setCriticalWarnings([])

      toast({
        title: "✅ Vitals Recorded Successfully",
        description: "Patient vitals have been saved with ML risk analysis",
      })

      onClose()
    } catch (error) {
      toast({
        title: "❌ Error Saving Vitals",
        description: "Please try again or contact support",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getInputClassName = (value: string, range: any) => {
    if (!value) return "border-gray-300 focus:border-primary focus:ring-primary/20"
    const numValue = Number.parseFloat(value)
    const status = getVitalStatus(numValue, range)

    switch (status) {
      case "critical":
        return "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200 animate-pulse"
      case "abnormal":
        return "border-yellow-500 bg-yellow-50 focus:border-yellow-500 focus:ring-yellow-200"
      default:
        return "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-200"
    }
  }

  const getTemperatureInputClassName = (value: string) => {
    if (!value) return "border-gray-300 focus:border-primary focus:ring-primary/20"
    const tempF = Number.parseFloat(value)
    const tempC = ((tempF - 32) * 5) / 9
    const status = getVitalStatus(tempC, vitalRanges.temperature)

    switch (status) {
      case "critical":
        return "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200 animate-pulse"
      case "abnormal":
        return "border-yellow-500 bg-yellow-50 focus:border-yellow-500 focus:ring-yellow-200"
      default:
        return "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-200"
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

  const getRiskProgressColor = (score: number) => {
    if (score >= 60) return "bg-red-500"
    if (score >= 40) return "bg-orange-500"
    if (score >= 20) return "bg-yellow-500"
    return "bg-green-500"
  }

  if (isCompleted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Vitals - Completed Patient
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600">Cannot update vitals for completed patients.</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={onClose} className="bg-primary hover:bg-primary-hover">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg sm:max-w-2xl md:max-w-4xl lg:max-w-7xl max-h-[95vh] overflow-y-auto p-0">
        <div className="bg-gradient-to-r from-primary to-primary-hover text-white p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <Stethoscope className="h-6 w-6" />
              Smart Vitals System
            </DialogTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-2 text-blue-100">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>
                  {patientName} (Age: {patientAge})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>MR: {mrNumber}</span>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="flex flex-col md:flex-row flex-1">
          {/* Left Side - Vitals Input */}
          <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6">
            {criticalWarnings.length > 0 && (
              <Alert className="border-red-200 bg-red-50 animate-pulse">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>CRITICAL VALUES DETECTED:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {criticalWarnings.map((warning, index) => (
                      <li key={index} className="font-medium">
                        {warning}
                      </li>
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
                  {Number.parseFloat(vitals.spo2) < 90 && (
                    <p className="text-xs text-red-600 font-bold mt-1 animate-pulse">{"🚨 CRITICAL: < 90%"}</p>
                  )}
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
                    className="text-lg font-semibold text-center border-gray-300 focus:border-primary focus:ring-primary/20"
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
                    className="text-lg font-semibold text-center border-gray-300 focus:border-primary focus:ring-primary/20"
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
                      <Badge variant="outline" className="border-primary text-primary">
                        {getBMICategory(bmi)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Clinical Notes */}
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
                  className="border-gray-300 focus:border-primary focus:ring-primary/20"
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-300 hover:border-primary hover:text-primary bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!vitals.systolic || !vitals.diastolic || !vitals.pulse || !vitals.temperature}
                className="bg-primary hover:bg-primary-hover text-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Activity className="w-4 h-4 mr-2" />
                {existingVitals ? "Update Vitals" : "Save Vitals"}
              </Button>
            </div>
          </div>

          {/* Right Side - ML Risk Assessment */}
          <div className="w-96 bg-gray-50 border-l p-6">
            <div className="sticky top-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  ML Risk Assessment
                </h3>

                {isAnalyzing ? (
                  <Card className="bg-white border-2 border-blue-200">
                    <CardContent className="p-6 text-center">
                      <LoadingSpinner size="lg" className="mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-2">Analyzing vitals...</p>
                      <p className="text-xs text-gray-500">ML algorithms processing cardiovascular risk</p>
                    </CardContent>
                  </Card>
                ) : riskAssessment ? (
                  <div className="space-y-4">
                    {/* Overall Risk Score */}
                    <Card className={`border-2 ${getRiskColor(riskAssessment.level)}`}>
                      <CardContent className="p-4">
                        <div className="text-center mb-4">
                          <div className="text-3xl font-bold text-gray-900 mb-1">{riskAssessment.score}</div>
                          <div className="text-sm text-gray-500 mb-3">Risk Score (0-100)</div>
                          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                            <div
                              className={`h-3 rounded-full ${getRiskProgressColor(riskAssessment.score)} transition-all duration-1000`}
                              style={{ width: `${Math.min(riskAssessment.score, 100)}%` }}
                            />
                          </div>
                          <Badge className={`text-sm px-3 py-1 ${getRiskColor(riskAssessment.level)}`}>
                            {riskAssessment.level.toUpperCase()} RISK
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 text-center">{riskAssessment.message}</p>
                      </CardContent>
                    </Card>

                    {/* Risk Factors */}
                    <Card className="bg-white">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-900">Risk Factors Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {Object.entries(riskAssessment.factors).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                            <Badge
                              variant="outline"
                              className={
                                value === "Normal"
                                  ? "border-green-500 text-green-700"
                                  : "border-orange-500 text-orange-700"
                              }
                            >
                              {value}
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Clinical Recommendations */}
                    <Card className="bg-white">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Clinical Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {riskAssessment.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <Heart className="h-12 w-12 mx-auto" />
                    </div>
                    <p className="text-sm text-gray-500">Enter vital signs to see ML risk assessment</p>
                  </div>
                )}

                {/* Information Alert */}
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 text-sm">
                    <p className="font-medium mb-2">Smart Vitals System Features:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Real-time critical value detection</li>
                      <li>Age-specific normal ranges ({patientAge} years)</li>
                      <li>Automatic BMI calculation</li>
                      <li>ML-powered cardiovascular risk scoring</li>
                      <li>Instant critical alerts to medical team</li>
                      <li>Evidence-based clinical recommendations</li>
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
