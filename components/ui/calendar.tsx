"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Calendar as MantineCalendar, CalendarProps as MantineCalendarProps } from "@mantine/dates"
import '@mantine/dates/styles.css';

import { cn } from "@/lib/utils"

export type CalendarProps = Omit<MantineCalendarProps, 'value' | 'onChange'> & {
  date?: Date | null;
  onDateChange?: (date: Date | null) => void;
}

function Calendar({
  className,
  date,
  onDateChange,
  ...props
}: CalendarProps) {
  const handleDateChange = (d: any) => {
    if (typeof d === 'string') {
      const parsed = new Date(d)
      onDateChange?.(isNaN(parsed.getTime()) ? null : parsed)
    } else {
      onDateChange?.(d ?? null)
    }
  }
  return (
    <MantineCalendar
      className={cn("p-3", className)}
      nextIcon={<ChevronRight className="h-4 w-4" />}
      previousIcon={<ChevronLeft className="h-4 w-4" />}
      date={date === null ? undefined : date}
      onDateChange={handleDateChange}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
