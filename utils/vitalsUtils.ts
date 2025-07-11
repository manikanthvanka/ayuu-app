export interface VitalRange {
  min: number
  max: number
  unit: string
  critical?: {
    low: number
    high: number
  }
}

export interface VitalRanges {
  systolic: VitalRange
  diastolic: VitalRange
  pulse: VitalRange
  temperature: VitalRange
  spo2: VitalRange
}

export function getVitalRanges(age: number): VitalRanges {
  // Age-based vital sign ranges
  if (age < 18) {
    return {
      systolic: { min: 90, max: 120, unit: "mmHg", critical: { low: 70, high: 140 } },
      diastolic: { min: 60, max: 80, unit: "mmHg", critical: { low: 40, high: 90 } },
      pulse: { min: 70, max: 120, unit: "bpm", critical: { low: 50, high: 150 } },
      temperature: { min: 36.1, max: 37.2, unit: "°C", critical: { low: 35.0, high: 39.0 } },
      spo2: { min: 95, max: 100, unit: "%", critical: { low: 90, high: 100 } },
    }
  } else if (age >= 65) {
    return {
      systolic: { min: 120, max: 140, unit: "mmHg", critical: { low: 90, high: 180 } },
      diastolic: { min: 70, max: 90, unit: "mmHg", critical: { low: 50, high: 110 } },
      pulse: { min: 60, max: 90, unit: "bpm", critical: { low: 45, high: 120 } },
      temperature: { min: 36.1, max: 37.2, unit: "°C", critical: { low: 35.0, high: 39.0 } },
      spo2: { min: 95, max: 100, unit: "%", critical: { low: 88, high: 100 } },
    }
  } else {
    return {
      systolic: { min: 90, max: 120, unit: "mmHg", critical: { low: 80, high: 180 } },
      diastolic: { min: 60, max: 80, unit: "mmHg", critical: { low: 50, high: 110 } },
      pulse: { min: 60, max: 100, unit: "bpm", critical: { low: 50, high: 120 } },
      temperature: { min: 36.1, max: 37.2, unit: "°C", critical: { low: 35.0, high: 39.0 } },
      spo2: { min: 95, max: 100, unit: "%", critical: { low: 90, high: 100 } },
    }
  }
}

export function getVitalStatus(value: number, range: VitalRange): "normal" | "abnormal" | "critical" {
  if (range.critical) {
    if (value <= range.critical.low || value >= range.critical.high) {
      return "critical"
    }
  }

  if (value < range.min || value > range.max) {
    return "abnormal"
  }

  return "normal"
}

export function calculateBMI(height: number, weight: number): number {
  // Height in cm, weight in kg
  const heightInMeters = height / 100
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight"
  if (bmi < 25) return "Normal"
  if (bmi < 30) return "Overweight"
  if (bmi < 35) return "Obese Class I"
  if (bmi < 40) return "Obese Class II"
  return "Obese Class III"
}
