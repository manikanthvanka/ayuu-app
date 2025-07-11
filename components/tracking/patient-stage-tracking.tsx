"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

interface PatientStageTrackingProps {
  onBack: () => void
}

interface StageData {
  patientId: string
  patientName: string
  mrNumber: string
  vitalsTime: number // minutes
  waitingTime: number // minutes
  consultationTime: number // minutes
  totalTime: number // minutes
  currentStage: "vitals" | "waiting" | "consultation" | "completed"
  entryTime: Date
}

export function PatientStageTracking({ onBack }: PatientStageTrackingProps) {
  const [stageData, setStageData] = useState<StageData[]>([])

  useEffect(() => {
    // Mock data for demonstration
    const mockData: StageData[] = [
      {
        patientId: "1",
        patientName: "John Doe",
        mrNumber: "MR001",
        vitalsTime: 15,
        waitingTime: 45,
        consultationTime: 30,
        totalTime: 90,
        currentStage: "completed",
        entryTime: new Date(Date.now() - 90 * 60000),
      },
      {
        patientId: "2",
        patientName: "Jane Smith",
        mrNumber: "MR002",
        vitalsTime: 12,
        waitingTime: 30,
        consultationTime: 0,
        totalTime: 42,
        currentStage: "consultation",
        entryTime: new Date(Date.now() - 42 * 60000),
      },
      {
        patientId: "3",
        patientName: "Bob Johnson",
        mrNumber: "MR003",
        vitalsTime: 10,
        waitingTime: 0,
        consultationTime: 0,
        totalTime: 10,
        currentStage: "waiting",
        entryTime: new Date(Date.now() - 10 * 60000),
      },
    ]
    setStageData(mockData)
  }, [])

  const getStageProgress = (stage: string) => {
    switch (stage) {
      case "vitals":
        return 33
      case "waiting":
        return 66
      case "consultation":
        return 90
      case "completed":
        return 100
      default:
        return 0
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const avgTimes = {
    vitals: Math.round(stageData.reduce((sum, data) => sum + data.vitalsTime, 0) / stageData.length) || 0,
    waiting: Math.round(stageData.reduce((sum, data) => sum + data.waitingTime, 0) / stageData.length) || 0,
    consultation:
      Math.round(
        stageData.filter((d) => d.consultationTime > 0).reduce((sum, data) => sum + data.consultationTime, 0) /
          stageData.filter((d) => d.consultationTime > 0).length,
      ) || 0,
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="flex items-center bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Stage Tracking</h1>
            <p className="text-gray-600">Monitor patient flow and stage durations</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-600 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Avg. Vitals Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{formatTime(avgTimes.vitals)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-orange-600 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Avg. Waiting Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{formatTime(avgTimes.waiting)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-600 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Avg. Consultation Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{formatTime(avgTimes.consultation)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Flow Details</CardTitle>
          <CardDescription>Detailed breakdown of time spent in each stage</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>MR Number</TableHead>
                <TableHead>Current Stage</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Vitals Time</TableHead>
                <TableHead>Waiting Time</TableHead>
                <TableHead>Consultation Time</TableHead>
                <TableHead>Total Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stageData.map((patient) => (
                <TableRow key={patient.patientId}>
                  <TableCell className="font-medium">{patient.patientName}</TableCell>
                  <TableCell>{patient.mrNumber}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        patient.currentStage === "completed"
                          ? "bg-green-100 text-green-800"
                          : patient.currentStage === "consultation"
                            ? "bg-blue-100 text-blue-800"
                            : patient.currentStage === "waiting"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {patient.currentStage.charAt(0).toUpperCase() + patient.currentStage.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={getStageProgress(patient.currentStage)} className="w-16" />
                      <span className="text-xs text-gray-500">{getStageProgress(patient.currentStage)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatTime(patient.vitalsTime)}</TableCell>
                  <TableCell>{formatTime(patient.waitingTime)}</TableCell>
                  <TableCell>{patient.consultationTime > 0 ? formatTime(patient.consultationTime) : "-"}</TableCell>
                  <TableCell className="font-medium">{formatTime(patient.totalTime)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
