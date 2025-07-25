"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { cn } from "@/lib/utils"

export interface CalendarProps {
  className?: string
  mode?: "single" | "multiple" | "range"
  selected?: Date | Date[] | { from: Date; to: Date } | undefined
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  captionLayout?: "label" | "dropdown" | "dropdown-months" | "dropdown-years"
  month?: Date
  onMonthChange?: (month: Date) => void
  required?: boolean
}

export function Calendar({
  className,
  mode = "single",
  selected,
  onSelect,
  disabled,
  captionLayout = "dropdown",
  month,
  onMonthChange,
  required,
}: CalendarProps) {
  const dayPickerProps: any = {
    mode,
    selected,
    onSelect,
    disabled,
    captionLayout,
    month,
    onMonthChange,
    className: cn("rounded-md border p-3", className),
  };
  if (required && (mode === "range" || mode === "multiple")) {
    dayPickerProps.required = true;
  }
  return <DayPicker {...dayPickerProps} />;
}
export default Calendar
