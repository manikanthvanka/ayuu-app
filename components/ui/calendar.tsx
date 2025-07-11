"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { cn } from "@/lib/utils"

const Calendar = ({ className, ...props }: any) => {
  return (
    <DayPicker
      showOutsideDays
      className={cn("p-3", className)}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export default Calendar
