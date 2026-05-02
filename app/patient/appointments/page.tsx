"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppointments } from "@/lib/contexts/appointment-context"
import { useDashboard } from "../layout"
import {
  Calendar,
  Clock,
  MapPin,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  CalendarX,
  ArrowLeft,
} from "lucide-react"
import type { Appointment } from "@/lib/types"
import Link from "next/link"

function MyAppointmentCard({
  appointment,
  onCancel,
}: {
  appointment: Appointment
  onCancel: (id: string) => void
}) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "booked":
        return <Badge className="bg-cyan-500/20 text-cyan-400">Upcoming</Badge>
      case "completed":
        return <Badge className="bg-emerald-500/20 text-emerald-400">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-500/20 text-red-400">Cancelled</Badge>
      default:
        return null
    }
  }

  const isUpcoming = appointment.status === "booked"
  const isPast = new Date(`${appointment.date}T${appointment.time}`) < new Date()

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/10 min-w-[90px]">
              <Calendar className="size-5 text-primary mb-1" />
              <span className="text-xs text-muted-foreground text-center">
                {new Date(appointment.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
              <span className="text-sm font-semibold text-primary">{appointment.time}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{appointment.doctorName}</h3>
                {getStatusBadge(appointment.status)}
              </div>
              <p className="text-sm text-muted-foreground">{appointment.specialization}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  {appointment.roomNumber}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {appointment.duration} min
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{formatDate(appointment.date)}</p>
            </div>
          </div>
          {isUpcoming && !isPast && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onCancel(appointment.id)}
            >
              <XCircle className="size-4 mr-1" />
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function PatientAppointmentsPage() {
  const { user } = useDashboard()
  const { appointments, cancelAppointment } = useAppointments()

  const patientId = user?.id || "patient-demo"
  const patientName = user?.name || "Demo Patient"

  // Get patient's appointments
  const myAppointments = useMemo(() => {
    return appointments
      .filter((a) => a.patientId === patientId || a.patientName === patientName)
      .sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date)
        return b.time.localeCompare(a.time)
      })
  }, [appointments, patientId, patientName])

  const upcomingAppointments = myAppointments.filter((a) => a.status === "booked")
  const completedAppointments = myAppointments.filter((a) => a.status === "completed")
  const cancelledAppointments = myAppointments.filter((a) => a.status === "cancelled")

  const handleCancelAppointment = (appointmentId: string) => {
    cancelAppointment(appointmentId)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Appointments</h1>
          <p className="text-muted-foreground">
            View and manage all your appointments
          </p>
        </div>
        <Link href="/patient">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <CalendarCheck className="size-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="size-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedAppointments.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <XCircle className="size-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{cancelledAppointments.length}</p>
                <p className="text-sm text-muted-foreground">Cancelled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="upcoming" className="gap-2">
            <CalendarCheck className="size-4" />
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle2 className="size-4" />
            Completed ({completedAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="gap-2">
            <XCircle className="size-4" />
            Cancelled ({cancelledAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <MyAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={handleCancelAppointment}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <CalendarX className="size-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Upcoming Appointments</h3>
                <p className="text-muted-foreground mb-4">
                  You don&apos;t have any scheduled appointments.
                </p>
                <Link href="/patient">
                  <Button>Book an Appointment</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedAppointments.length > 0 ? (
            <div className="space-y-3">
              {completedAppointments.map((appointment) => (
                <MyAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={() => {}}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="size-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Completed Appointments</h3>
                <p className="text-muted-foreground">
                  Your completed appointments will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledAppointments.length > 0 ? (
            <div className="space-y-3">
              {cancelledAppointments.map((appointment) => (
                <MyAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={() => {}}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <XCircle className="size-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Cancelled Appointments</h3>
                <p className="text-muted-foreground">
                  You haven&apos;t cancelled any appointments.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
