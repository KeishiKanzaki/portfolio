"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, addMonths, subMonths } from "date-fns"

interface CustomCalendarProps {
  selected?: Date
  onSelect?: (date: Date) => void
  modifiers?: {
    hasTask?: (date: Date) => boolean
  }
  className?: string
}

export function CustomCalendar({ selected, onSelect, modifiers, className }: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const dateFormat = "yyyy年MM月"
  const dayFormat = "d"

  const onDateClick = (day: Date) => {
    onSelect?.(day)
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={prevMonth}
          className="h-9 w-9 p-0 hover:bg-gray-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold text-gray-800">
          {format(currentMonth, dateFormat)}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={nextMonth}
          className="h-9 w-9 p-0 hover:bg-gray-100"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  const renderDays = () => {
    const dayNames = ["日", "月", "火", "水", "木", "金", "土"]
    
    return (
      <div className="grid grid-cols-7 gap-1 mb-4">
        {dayNames.map((day, index) => (
          <div
            key={day}
            className={`p-3 text-center text-sm font-bold rounded-lg ${
              index === 0 
                ? "text-red-600 bg-gradient-to-br from-red-50 to-red-100 border border-red-200" 
                : index === 6 
                ? "text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200" 
                : "text-gray-700 bg-gray-50"
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    )
  }

  const renderCells = () => {
    const rows = []
    let days = []
    let day = startDate
    let formattedDate = ""

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dayFormat)
        const cloneDay = day
        const dayOfWeek = day.getDay()
        const isCurrentMonth = isSameMonth(day, monthStart)
        const isSelectedDay = selected && isSameDay(day, selected)
        const hasTask = modifiers?.hasTask?.(day)

        days.push(
          <div
            className={`
              relative p-3 text-center cursor-pointer transition-all duration-200 rounded-lg min-h-[40px] flex flex-col items-center justify-center
              ${!isCurrentMonth ? "text-gray-300" : "text-gray-900"}
              ${dayOfWeek === 0 && isCurrentMonth ? "text-red-600 bg-gradient-to-br from-red-50 to-red-100 border border-red-200" : ""}
              ${dayOfWeek === 6 && isCurrentMonth ? "text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200" : ""}
              ${isSelectedDay ? "bg-primary text-primary-foreground shadow-md scale-105" : ""}
              ${!isSelectedDay && isCurrentMonth && dayOfWeek !== 0 && dayOfWeek !== 6 ? "hover:bg-gray-100 hover:scale-105" : ""}
              ${!isSelectedDay && isCurrentMonth && dayOfWeek === 0 ? "hover:bg-gradient-to-br hover:from-red-100 hover:to-red-200 hover:scale-105" : ""}
              ${!isSelectedDay && isCurrentMonth && dayOfWeek === 6 ? "hover:bg-gradient-to-br hover:from-blue-100 hover:to-blue-200 hover:scale-105" : ""}
            `}
            key={day.toString()}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="text-sm font-medium">{formattedDate}</span>
            {hasTask && (
              <div className={`
                absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full
                ${isSelectedDay ? "bg-primary-foreground" : 
                  dayOfWeek === 0 ? "bg-red-500" : 
                  dayOfWeek === 6 ? "bg-blue-500" : "bg-primary"}
              `} />
            )}
          </div>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>
      )
      days = []
    }
    return <div className="space-y-1">{rows}</div>
  }

  return (
    <div className={`p-6 bg-white rounded-lg shadow-sm border ${className}`}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  )
}
