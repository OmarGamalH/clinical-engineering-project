"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useAppointments } from "@/lib/contexts/appointment-context"
import { useDashboard } from "@/app/doctor/layout"
import { doctors } from "@/lib/mock-data/doctors"
import {
  Calendar,
  Clock,
  Search,
  MapPin,
  CalendarCheck,
  CalendarX,
  CheckCircle2,
  XCircle,
  User,
  Filter,
} from "lucide-react"
import type { Appointment } from "@/lib/types"

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

function AppointmentCard({
  appointment,
  onComplete,
  onCancel,
  onViewDetails,
}: {
  appointment: Appointment
  onComplete?: (appointment: Appointment) => void
  onCancel?: (appointment: Appointment) => void
  onViewDetails: (appointment: Appointment) => void
}) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "booked":
        return <Badge className="bg-cyan-500/20 text-cyan-400">Scheduled</Badge>
      case "completed":
        return <Badge className="bg-emerald-500/20 text-emerald-400">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-500/20 text-red-400">Cancelled</Badge>
      default:
        return <Badge className="bg-secondary text-muted-foreground">Available</Badge>
    }
  }

  const isPast = new Date(`${appointment.date}T${appointment.time}`) < new Date()
  const isToday = appointment.date === new Date().toISOString().split("T")[0]

  return (
    <Card className={cn(
      "bg-card border-border hover:border-primary/50 transition-colors",
      isToday && appointment.status === "booked" && "border-l-4 border-l-cyan-500"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/10 min-w-[80px]">
              <span className="text-xs text-muted-foreground">{formatDate(appointment.date)}</span>
              <span className="text-lg font-semibold text-primary">{appointment.time}</span>
              {isToday && <Badge variant="outline" className="text-xs mt-1">Today</Badge>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-secondary flex items-center justify-center">
                  <User className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{appointment.patientName || "No patient"}</p>
                  <p className="text-xs text-muted-foreground">
                    {appointment.patientId ? `ID: ${appointment.patientId}` : "Slot available"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  {appointment.roomNumber}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {appointment.duration} min
                </span>
              </div>
              {appointment.notes && (
                <p className="text-sm text-muted-foreground bg-secondary/50 p-2 rounded">
                  {appointment.notes}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(appointment.status)}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(appointment)}
              >
                Details
              </Button>
              {appointment.status === "booked" && !isPast && onComplete && (
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => onComplete(appointment)}
                >
                  <CheckCircle2 className="size-4 mr-1" />
                  Complete
                </Button>
              )}
              {appointment.status === "booked" && !isPast && onCancel && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onCancel(appointment)}
                >
                  <XCircle className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AppointmentsPage() {
  const { user } = useDashboard()
  const {
    completeAppointment,
    cancelAppointment,
    getAppointmentsByDoctor,
  } = useAppointments()

  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [appointmentToComplete, setAppointmentToComplete] = useState<Appointment | null>(null)
  const [completionNotes, setCompletionNotes] = useState("")
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)

  const currentDoctor = useMemo(() => {
    const found = doctors.find(d => d.name === user?.name)
    return found || doctors[0]
  }, [user?.name])

  const doctorId = currentDoctor.id

  const doctorAppointments = useMemo(() => {
    return getAppointmentsByDoctor(doctorId)
  }, [getAppointmentsByDoctor, doctorId])

  const filteredAppointments = useMemo(() => {
    let filtered = doctorAppointments

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (a) =>
          a.patientName?.toLowerCase().includes(query) ||
          a.patientId?.toLowerCase().includes(query)
      )
    }

    const today = new Date().toISOString().split("T")[0]
    if (dateFilter === "today") {
      filtered = filtered.filter((a) => a.date === today)
    } else if (dateFilter === "upcoming") {
      filtered = filtered.filter((a) => a.date >= today)
    } else if (dateFilter === "past") {
      filtered = filtered.filter((a) => a.date < today)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter)
    }

    return filtered.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return a.time.localeCompare(b.time)
    })
  }, [doctorAppointments, searchQuery, dateFilter, statusFilter])

  const handleCompleteAppointment = () => {
    if (!appointmentToComplete) return
    completeAppointment(appointmentToComplete.id, completionNotes)
    setShowCompleteDialog(false)
    setAppointmentToComplete(null)
    setCompletionNotes("")
  }

  const handleCancelAppointment = (appointment: Appointment) => {
    cancelAppointment(appointment.id)
  }

  const openCompleteDialog = (appointment: Appointment) => {
    setAppointmentToComplete(appointment)
    setShowCompleteDialog(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
        <p className="text-muted-foreground">
          Manage and view all your appointments
        </p>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50"
              />
            </div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-[150px] bg-secondary/50">
                <Calendar className="size-4 mr-2" />
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px] bg-secondary/50">
                <Filter className="size-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onComplete={appointment.status === "booked" ? openCompleteDialog : undefined}
              onCancel={appointment.status === "booked" ? handleCancelAppointment : undefined}
              onViewDetails={setSelectedAppointment}
            />
          ))
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <CalendarX className="size-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Appointments Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Appointment Details Dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              View full appointment information
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Patient</p>
                  <p className="font-medium">{selectedAppointment.patientName || "No patient"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Patient ID</p>
                  <p className="font-medium">{selectedAppointment.patientId || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedAppointment.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedAppointment.time}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedAppointment.duration} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Room</p>
                  <p className="font-medium">{selectedAppointment.roomNumber}</p>
                </div>
              </div>
              {selectedAppointment.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium bg-secondary/50 p-2 rounded mt-1">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Appointment Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Complete Appointment</DialogTitle>
            <DialogDescription>
              Mark this appointment as completed and add any notes.
            </DialogDescription>
          </DialogHeader>
          {appointmentToComplete && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="font-medium">{appointmentToComplete.patientName}</p>
                <p className="text-sm text-muted-foreground">
                  {appointmentToComplete.date} at {appointmentToComplete.time}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Completion Notes (optional)
                </label>
                <Textarea
                  placeholder="Add any notes about this appointment..."
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleCompleteAppointment}
            >
              <CheckCircle2 className="size-4 mr-2" />
              Complete Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
