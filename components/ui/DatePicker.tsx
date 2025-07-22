"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

export function DatePicker({ value, onChange, label }: {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex flex-col gap-2">
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
            data-empty={!value}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            selected={value ?? undefined}
            onSelect={(date) => onChange(date ?? null)}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
} 