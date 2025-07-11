export interface CardiovascularRisk {
  score: number
  level: "low" | "moderate" | "high" | "critical"
  message: string
  recommendations: string[]
  factors: {
    bloodPressure: string
    heartRate: string
    temperature: string
    oxygenSaturation: string
    age: string
    bmi?: string
  }
}

export function calculateCardiovascularRisk(vitals: {
  systolic: number
  diastolic: number
  pulse: number
  temperature: number
  spo2: number
  age: number
  bmi?: number
}): CardiovascularRisk {
  let riskScore = 0
  const factors: CardiovascularRisk["factors"] = {
    bloodPressure: "Normal",
    heartRate: "Normal",
    temperature: "Normal",
    oxygenSaturation: "Normal",
    age: "Normal",
  }

  // Blood Pressure Risk Assessment (40% weight)
  const meanArterialPressure = (vitals.systolic + 2 * vitals.diastolic) / 3
  if (vitals.systolic >= 180 || vitals.diastolic >= 120) {
    riskScore += 40
    factors.bloodPressure = "Hypertensive Crisis"
  } else if (vitals.systolic >= 160 || vitals.diastolic >= 100) {
    riskScore += 30
    factors.bloodPressure = "Stage 2 Hypertension"
  } else if (vitals.systolic >= 140 || vitals.diastolic >= 90) {
    riskScore += 20
    factors.bloodPressure = "Stage 1 Hypertension"
  } else if (vitals.systolic >= 130 || vitals.diastolic >= 80) {
    riskScore += 10
    factors.bloodPressure = "Elevated"
  } else if (vitals.systolic < 90 || vitals.diastolic < 60) {
    riskScore += 15
    factors.bloodPressure = "Hypotension"
  }

  // Heart Rate Risk Assessment (25% weight)
  if (vitals.pulse > 120) {
    riskScore += 25
    factors.heartRate = "Severe Tachycardia"
  } else if (vitals.pulse > 100) {
    riskScore += 15
    factors.heartRate = "Tachycardia"
  } else if (vitals.pulse < 50) {
    riskScore += 20
    factors.heartRate = "Bradycardia"
  } else if (vitals.pulse < 60) {
    riskScore += 10
    factors.heartRate = "Mild Bradycardia"
  }

  // Temperature Risk Assessment (15% weight)
  const tempC = vitals.temperature > 50 ? ((vitals.temperature - 32) * 5) / 9 : vitals.temperature
  if (tempC >= 39.0) {
    riskScore += 15
    factors.temperature = "High Fever"
  } else if (tempC >= 38.0) {
    riskScore += 10
    factors.temperature = "Moderate Fever"
  } else if (tempC < 36.0) {
    riskScore += 12
    factors.temperature = "Hypothermia"
  }

  // Oxygen Saturation Risk Assessment (15% weight)
  if (vitals.spo2 < 90) {
    riskScore += 15
    factors.oxygenSaturation = "Severe Hypoxemia"
  } else if (vitals.spo2 < 95) {
    riskScore += 10
    factors.oxygenSaturation = "Mild Hypoxemia"
  }

  // Age Risk Assessment (5% weight)
  if (vitals.age >= 75) {
    riskScore += 5
    factors.age = "High Risk Age"
  } else if (vitals.age >= 65) {
    riskScore += 3
    factors.age = "Moderate Risk Age"
  }

  // BMI Risk Assessment (if available)
  if (vitals.bmi) {
    if (vitals.bmi >= 35) {
      riskScore += 8
      factors.bmi = "Severely Obese"
    } else if (vitals.bmi >= 30) {
      riskScore += 5
      factors.bmi = "Obese"
    } else if (vitals.bmi < 18.5) {
      riskScore += 3
      factors.bmi = "Underweight"
    }
  }

  // Determine risk level and recommendations
  let level: CardiovascularRisk["level"]
  let message: string
  let recommendations: string[]

  if (riskScore >= 60) {
    level = "critical"
    message = "Critical cardiovascular risk detected. Immediate medical intervention required."
    recommendations = [
      "Immediate physician evaluation required",
      "Consider emergency department referral",
      "Continuous cardiac monitoring",
      "IV access and emergency medications ready",
      "Frequent vital sign monitoring (every 15 minutes)",
    ]
  } else if (riskScore >= 40) {
    level = "high"
    message = "High cardiovascular risk. Close monitoring and intervention needed."
    recommendations = [
      "Urgent physician consultation within 1 hour",
      "Cardiac monitoring recommended",
      "Repeat vitals every 30 minutes",
      "Consider ECG and cardiac enzymes",
      "Prepare for potential interventions",
    ]
  } else if (riskScore >= 20) {
    level = "moderate"
    message = "Moderate cardiovascular risk. Enhanced monitoring recommended."
    recommendations = [
      "Physician evaluation within 2-4 hours",
      "Monitor vitals every hour",
      "Consider basic cardiac workup",
      "Patient education on warning signs",
      "Follow-up appointment scheduled",
    ]
  } else {
    level = "low"
    message = "Low cardiovascular risk. Routine monitoring appropriate."
    recommendations = [
      "Standard monitoring protocols",
      "Routine physician evaluation",
      "Patient education on healthy lifestyle",
      "Regular follow-up as scheduled",
      "Continue current treatment plan",
    ]
  }

  return {
    score: riskScore,
    level,
    message,
    recommendations,
    factors,
  }
}
