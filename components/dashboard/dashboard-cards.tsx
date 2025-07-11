"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardCardsProps {
  counts?: {
    active: number
    completed: number
    returnQueue: number
  }
}

export function DashboardCards({ counts = { active: 3, completed: 1, returnQueue: 0 } }: DashboardCardsProps) {
  const cards = [
    {
      title: "Active Appointments",
      value: counts.active,
      icon: Calendar,
      iconBg: "bg-[hsl(var(--ayuu-blue))]/10",
      iconColor: "text-[hsl(var(--ayuu-blue))]",
    },
    {
      title: "Completed Appointments",
      value: counts.completed,
      icon: CheckCircle,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600",
    },
    {
      title: "Return Tokens",
      value: counts.returnQueue,
      icon: RotateCcw,
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="bg-white shadow-sm border hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--ayuu-text-muted))]">{card.title}</CardTitle>
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", card.iconBg)}>
                <Icon className={cn("h-4 w-4", card.iconColor)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[hsl(var(--ayuu-text))]">{card.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
