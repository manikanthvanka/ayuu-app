export interface Notification {
  id: string
  type: "critical" | "warning" | "info"
  title: string
  message: string
  patientName: string
  mrNumber: string
  timestamp: Date
  read: boolean
  data?: any
}

class NotificationStore {
  private notifications: Notification[] = []
  private listeners: ((notifications: Notification[]) => void)[] = []

  addNotification(notification: Omit<Notification, "id" | "timestamp" | "read">) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }

    this.notifications.unshift(newNotification)
    this.notifyListeners()
  }

  getNotifications(): Notification[] {
    return this.notifications
  }

  markAsRead(id: string) {
    const notification = this.notifications.find((n) => n.id === id)
    if (notification) {
      notification.read = true
      this.notifyListeners()
    }
  }

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.notifications))
  }
}

export const notificationStore = new NotificationStore()

export function createCriticalVitalsNotification(
  patientName: string,
  mrNumber: string,
  vitals: {
    systolic?: number
    spo2?: number
    warnings?: string[]
  },
): Omit<Notification, "id" | "timestamp" | "read"> {
  const criticalValues = []

  if (vitals.systolic && vitals.systolic > 180) {
    criticalValues.push(`Systolic BP: ${vitals.systolic} mmHg`)
  }
  if (vitals.spo2 && vitals.spo2 < 90) {
    criticalValues.push(`SpO2: ${vitals.spo2}%`)
  }

  let message = "Critical vital signs detected"
  if (criticalValues.length > 0) {
    message += `: ${criticalValues.join(", ")}`
  }
  if (vitals.warnings && vitals.warnings.length > 0) {
    message += `. Additional warnings: ${vitals.warnings.length} critical values detected.`
  }

  return {
    type: "critical",
    title: "🚨 Critical Vitals Alert",
    message,
    patientName,
    mrNumber,
    data: vitals,
  }
}
