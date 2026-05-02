"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Users,
  CheckCircle2,
  XCircle,
  User,
  Phone,
  Stethoscope,
  ClipboardList,
  TrendingUp,
  AlertCircle,
  Filter,
  CalendarDays,
} from "lucide-react"
import type { Appointment } from "@/lib/types"

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

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export default function DoctorDashboard() {
  const { user } = useDashboard()
  const {
    appointments,
    completeAppointment,
    cancelAppointment,
    getAppointmentsByDoctor,
    getUpcomingAppointmentsForDoctor,
  } = useAppointments()

  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [appointmentToComplete, setAppointmentToComplete] = useState<Appointment | null>(null)
  const [completionNotes, setCompletionNotes] = useState("")
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)

  // Find the doctor based on user name - for demo, use first doctor if not found
  const currentDoctor = useMemo(() => {
    const found = doctors.find(d => d.name === user?.name)
    return found || doctors[0]
  }, [user?.name])

  const doctorId = currentDoctor.id

  // Get all appointments for this doctor
  const doctorAppointments = useMemo(() => {
    return getAppointmentsByDoctor(doctorId)
  }, [getAppointmentsByDoctor, doctorId])

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    let filtered = doctorAppointments

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (a) =>
          a.patientName?.toLowerCase().includes(query) ||
          a.patientId?.toLowerCase().includes(query)
      )
    }

    // Date filter
    const today = new Date().toISOString().split("T")[0]
    if (dateFilter === "today") {
      filtered = filtered.filter((a) => a.date === today)
    } else if (dateFilter === "upcoming") {
      filtered = filtered.filter((a) => a.date >= today)
    } else if (dateFilter === "past") {
      filtered = filtered.filter((a) => a.date < today)
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter)
    }

    // Sort by date and time
    return filtered.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return a.time.localeCompare(b.time)
    })
  }, [doctorAppointments, searchQuery, dateFilter, statusFilter])

  // Get upcoming booked appointments
  const upcomingBookedAppointments = useMemo(() => {
    return getUpcomingAppointmentsForDoctor(doctorId)
  }, [getUpcomingAppointmentsForDoctor, doctorId])

  // Get today's appointments
  const todayAppointments = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    return doctorAppointments.filter(
      (a) => a.date === today && a.status === "booked"
    ).sort((a, b) => a.time.localeCompare(b.time))
  }, [doctorAppointments])

  // Stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    const booked = doctorAppointments.filter((a) => a.status === "booked")
    const completed = doctorAppointments.filter((a) => a.status === "completed")
    const todayBooked = doctorAppointments.filter((a) => a.date === today && a.status === "booked")

    return {
      totalPatients: new Set(doctorAppointments.filter(a => a.patientId).map(a => a.patientId)).size,
      todayAppointments: todayBooked.length,
      upcomingAppointments: booked.filter(a => a.date >= today).length,
      completedThisMonth: completed.filter(a => {
        const appointmentMonth = new Date(a.date).getMonth()
        const currentMonth = new Date().getMonth()
        return appointmentMonth === currentMonth
      }).length,
    }
  }, [doctorAppointments])

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
        <h1 className="text-2xl font-bold text-foreground">Doctor Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {currentDoctor.name}. Manage your appointments and patients.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <CalendarCheck className="size-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.todayAppointments}</p>
                <p className="text-sm text-muted-foreground">Today&apos;s Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CalendarDays className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.upcomingAppointments}</p>
                <p className="text-sm text-muted-foreground">Upcoming Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Users className="size-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalPatients}</p>
                <p className="text-sm text-muted-foreground">Total Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <TrendingUp className="size-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completedThisMonth}</p>
                <p className="text-sm text-muted-foreground">Completed This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule Quick View */}
      {todayAppointments.length > 0 && (
        <Card className="bg-card border-border border-l-4 border-l-cyan-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-5 text-cyan-400" />
                <CardTitle className="text-base">Today&apos;s Schedule</CardTitle>
              </div>
              <Badge className="bg-cyan-500/20 text-cyan-400">
                {todayAppointments.length} appointments
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {todayAppointments.slice(0, 5).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex-shrink-0 p-3 rounded-lg bg-secondary/50 border border-border min-w-[200px]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {appointment.time}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{appointment.duration} min</span>
                  </div>
                  <p className="font-medium text-sm truncate">{appointment.patientName}</p>
                  <p className="text-xs text-muted-foreground">{appointment.roomNumber}</p>
                </div>
              ))}
              {todayAppointments.length > 5 && (
                <div className="flex-shrink-0 p-3 rounded-lg bg-secondary/30 border border-dashed border-border min-w-[100px] flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">
                    +{todayAppointments.length - 5} more
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="upcoming" className="gap-2">
            <CalendarCheck className="size-4" />
            Booked Appointments
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2">
            <Calendar className="size-4" />
            All Appointments
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2">
            <ClipboardList className="size-4" />
            My Schedule
          </TabsTrigger>
        </TabsList>

        {/* Booked Appointments Tab */}
        <TabsContent value="upcoming" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Upcoming Booked Appointments</CardTitle>
              <CardDescription>
                Patients who have booked appointments with you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingBookedAppointments.length > 0 ? (
                upcomingBookedAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onComplete={openCompleteDialog}
                    onCancel={handleCancelAppointment}
                    onViewDetails={setSelectedAppointment}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <CalendarX className="size-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Upcoming Appointments</h3>
                  <p className="text-muted-foreground">
                    You don&apos;t have any booked appointments at the moment.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Appointments Tab */}
        <TabsContent value="all" className="space-y-4">
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
                  <Search className="size-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Appointments Found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* My Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>My Practice Information</CardTitle>
              <CardDescription>Your professional details and availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xl font-semibold text-primary">
                        {currentDoctor.name.split(" ").slice(1).map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{currentDoctor.name}</h3>
                      <p className="text-muted-foreground">{currentDoctor.specialization}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Stethoscope className="size-4 text-muted-foreground" />
                      <span>{currentDoctor.department} Department</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="size-4 text-muted-foreground" />
                      <span>{currentDoctor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="size-4 text-muted-foreground" />
                      <span>{currentDoctor.yearsOfExperience} years of experience</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Weekly Availability</h4>
                  <div className="space-y-2">
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, index) => {
                      const availability = currentDoctor.availability.find(a => a.dayOfWeek === index)
                      return (
                        <div key={day} className="flex items-center justify-between p-2 rounded bg-secondary/30">
                          <span className="text-sm">{day}</span>
                          {availability ? (
                            <Badge variant="outline" className="text-xs">
                              {availability.startTime} - {availability.endTime}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              Off
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Appointment Details Dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="size-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{selectedAppointment.patientName || "No patient"}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedAppointment.patientId || "Slot available"}
                  </p>
                </div>
              </div>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between p-2 rounded bg-background">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">
                    {new Date(selectedAppointment.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded bg-background">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">{selectedAppointment.time}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-background">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{selectedAppointment.duration} minutes</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-background">
                  <span className="text-muted-foreground">Room</span>
                  <span className="font-medium">{selectedAppointment.roomNumber}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-background">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className={cn(
                    selectedAppointment.status === "booked" && "bg-cyan-500/20 text-cyan-400",
                    selectedAppointment.status === "completed" && "bg-emerald-500/20 text-emerald-400",
                    selectedAppointment.status === "cancelled" && "bg-red-500/20 text-red-400",
                    selectedAppointment.status === "available" && "bg-secondary text-muted-foreground"
                  )}>
                    {selectedAppointment.status}
                  </Badge>
                </div>
                {selectedAppointment.notes && (
                  <div className="p-2 rounded bg-background">
                    <span className="text-muted-foreground block mb-1">Notes</span>
                    <span className="font-medium">{selectedAppointment.notes}</span>
                  </div>
                )}
              </div>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Appointment</DialogTitle>
            <DialogDescription>
              Mark this appointment as completed and add any notes.
            </DialogDescription>
          </DialogHeader>
          {appointmentToComplete && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="font-semibold">{appointmentToComplete.patientName}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(appointmentToComplete.date).toLocaleDateString()} at {appointmentToComplete.time}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Appointment Notes (Optional)</label>
                <Textarea
                  placeholder="Add any notes about the appointment..."
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteAppointment} className="bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle2 className="size-4 mr-2" />
              Mark as Completed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
