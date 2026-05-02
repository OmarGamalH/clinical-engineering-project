"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAppointments } from "@/lib/contexts/appointment-context"
import { useDashboard } from "@/app/doctor/layout"
import { doctors } from "@/lib/mock-data/doctors"
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  MapPin,
  User,
} from "lucide-react"
import type { Appointment } from "@/lib/types"

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export default function SchedulePage() {
  const { user } = useDashboard()
  const { getAppointmentsByDoctor } = useAppointments()
  const [selectedDate, setSelectedDate] = useState(new Date())

  const currentDoctor = useMemo(() => {
    const found = doctors.find(d => d.name === user?.name)
    return found || doctors[0]
  }, [user?.name])

  const doctorId = currentDoctor.id

  const doctorAppointments = useMemo(() => {
    return getAppointmentsByDoctor(doctorId)
  }, [getAppointmentsByDoctor, doctorId])

  // Get appointments for selected week
  const weekDays = useMemo(() => {
    const days = []
    const startOfWeek = new Date(selectedDate)
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay())

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
    return days
  }, [selectedDate])

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return doctorAppointments
      .filter((a) => a.date === dateStr)
      .sort((a, b) => a.time.localeCompare(b.time))
  }

  const navigateWeek = (direction: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + direction * 7)
    setSelectedDate(newDate)
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  const formatDayHeader = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" })
  }

  const formatDayNumber = (date: Date) => {
    return date.getDate()
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "booked":
        return "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
      case "completed":
        return "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
      case "cancelled":
        return "bg-red-500/20 border-red-500/50 text-red-400"
      default:
        return "bg-secondary border-border text-muted-foreground"
    }
  }

  const weekRange = useMemo(() => {
    const start = weekDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const end = weekDays[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    return `${start} - ${end}`
  }, [weekDays])

  // Time slots for the schedule grid
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Schedule</h1>
          <p className="text-muted-foreground">
            View your weekly appointment schedule
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigateWeek(-1)}>
            <ChevronLeft className="size-4" />
          </Button>
          <span className="px-4 text-sm font-medium min-w-[200px] text-center">
            {weekRange}
          </span>
          <Button variant="outline" size="icon" onClick={() => navigateWeek(1)}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Weekly Calendar View */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="grid grid-cols-8 border-b border-border">
            {/* Time column header */}
            <div className="p-3 text-center border-r border-border">
              <Clock className="size-4 mx-auto text-muted-foreground" />
            </div>
            {/* Day headers */}
            {weekDays.map((day, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 text-center border-r border-border last:border-r-0",
                  isToday(day) && "bg-primary/10"
                )}
              >
                <p className="text-xs text-muted-foreground">{formatDayHeader(day)}</p>
                <p className={cn(
                  "text-lg font-semibold",
                  isToday(day) ? "text-primary" : "text-foreground"
                )}>
                  {formatDayNumber(day)}
                </p>
                {isToday(day) && (
                  <Badge variant="outline" className="text-xs mt-1">Today</Badge>
                )}
              </div>
            ))}
          </div>

          {/* Time grid */}
          <div className="max-h-[600px] overflow-y-auto">
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-8 border-b border-border last:border-b-0">
                {/* Time label */}
                <div className="p-3 text-center border-r border-border text-sm text-muted-foreground">
                  {time}
                </div>
                {/* Day cells */}
                {weekDays.map((day, dayIndex) => {
                  const dayAppointments = getAppointmentsForDate(day)
                  const appointmentAtTime = dayAppointments.find((a) => a.time === time)

                  return (
                    <div
                      key={dayIndex}
                      className={cn(
                        "p-2 border-r border-border last:border-r-0 min-h-[80px]",
                        isToday(day) && "bg-primary/5"
                      )}
                    >
                      {appointmentAtTime && (
                        <div className={cn(
                          "p-2 rounded-lg border text-xs",
                          getStatusColor(appointmentAtTime.status)
                        )}>
                          <div className="flex items-center gap-1 mb-1">
                            <User className="size-3" />
                            <span className="font-medium truncate">
                              {appointmentAtTime.patientName || "Available"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="size-3" />
                            <span>{appointmentAtTime.roomNumber}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-muted-foreground">Legend:</span>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded bg-cyan-500/50" />
              <span className="text-sm">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded bg-emerald-500/50" />
              <span className="text-sm">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded bg-red-500/50" />
              <span className="text-sm">Cancelled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded bg-secondary border border-border" />
              <span className="text-sm">Available</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
