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
import { useAppointments } from "@/lib/contexts/appointment-context"
import { doctors, specializations } from "@/lib/mock-data/doctors"
import { useDashboard } from "@/app/dashboard/layout"
import {
  Calendar,
  Clock,
  Search,
  MapPin,
  Star,
  Users,
  GraduationCap,
  CalendarCheck,
  CalendarX,
  Stethoscope,
  Filter,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import type { Appointment, Doctor } from "@/lib/types"

function DoctorCard({
  doctor,
  onViewAppointments,
}: {
  doctor: Doctor
  onViewAppointments: (doctor: Doctor) => void
}) {
  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="size-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-lg font-semibold text-primary">
              {doctor.name.split(" ").slice(1).map(n => n[0]).join("")}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">{doctor.name}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Stethoscope className="size-3" />
              {doctor.specialization}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="size-4 fill-current" />
            <span className="font-medium">{doctor.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="size-4" />
            <span>{doctor.totalPatients.toLocaleString()} patients</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <GraduationCap className="size-4 shrink-0" />
          <span className="truncate">{doctor.yearsOfExperience} years experience</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          <span>{doctor.department} Department</span>
        </div>
        <Button
          className="w-full mt-2"
          onClick={() => onViewAppointments(doctor)}
        >
          View Available Appointments
        </Button>
      </CardContent>
    </Card>
  )
}

function AppointmentSlot({
  appointment,
  onBook,
  isBooked,
}: {
  appointment: Appointment
  onBook: (appointment: Appointment) => void
  isBooked: boolean
}) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/10 min-w-[80px]">
          <span className="text-xs text-muted-foreground">{formatDate(appointment.date)}</span>
          <span className="text-lg font-semibold text-primary">{appointment.time}</span>
        </div>
        <div>
          <p className="font-medium text-foreground">{appointment.doctorName}</p>
          <p className="text-sm text-muted-foreground">{appointment.specialization}</p>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{appointment.roomNumber}</span>
            <Clock className="size-3 text-muted-foreground ml-2" />
            <span className="text-xs text-muted-foreground">{appointment.duration} min</span>
          </div>
        </div>
      </div>
      <Button
        onClick={() => onBook(appointment)}
        disabled={isBooked}
        variant={isBooked ? "outline" : "default"}
        size="sm"
      >
        {isBooked ? "Selected" : "Book Now"}
      </Button>
    </div>
  )
}

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

export default function PatientDashboard() {
  const { user } = useDashboard()
  const {
    appointments,
    bookAppointment,
    cancelAppointment,
    getAvailableAppointments,
  } = useAppointments()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("all")
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [appointmentToBook, setAppointmentToBook] = useState<Appointment | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null)

  // Get patient's ID from user
  const patientId = user?.id || "patient-demo"
  const patientName = user?.name || "Demo Patient"

  // Filter doctors based on search and specialization
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSpecialization =
        selectedSpecialization === "all" || doctor.specialization === selectedSpecialization
      return matchesSearch && matchesSpecialization
    })
  }, [searchQuery, selectedSpecialization])

  // Get available appointments for selected doctor
  const availableAppointmentsForDoctor = useMemo(() => {
    if (!selectedDoctor) return []
    const today = new Date().toISOString().split("T")[0]
    return appointments.filter(
      (a) => a.doctorId === selectedDoctor.id && a.status === "available" && a.date >= today
    ).sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return a.time.localeCompare(b.time)
    })
  }, [selectedDoctor, appointments])

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
  const pastAppointments = myAppointments.filter((a) => a.status === "completed")

  const handleBookAppointment = () => {
    if (!appointmentToBook) return

    const result = bookAppointment(appointmentToBook.id, patientId, patientName)
    if (result) {
      setBookedAppointment(result)
      setAppointmentToBook(null)
      setShowSuccessDialog(true)
      setSelectedDoctor(null)
    }
  }

  const handleCancelAppointment = (appointmentId: string) => {
    cancelAppointment(appointmentId)
  }

  // Stats
  const stats = {
    upcoming: upcomingAppointments.length,
    completed: pastAppointments.length,
    availableDoctors: doctors.length,
    availableSlots: getAvailableAppointments().length,
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Patient Portal</h1>
        <p className="text-muted-foreground">
          Welcome back, {patientName}. Book appointments and manage your healthcare.
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
                <p className="text-2xl font-bold">{stats.upcoming}</p>
                <p className="text-sm text-muted-foreground">Upcoming Appointments</p>
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
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed Visits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Stethoscope className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.availableDoctors}</p>
                <p className="text-sm text-muted-foreground">Available Doctors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Calendar className="size-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.availableSlots}</p>
                <p className="text-sm text-muted-foreground">Available Slots</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="book" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="book" className="gap-2">
            <Calendar className="size-4" />
            Book Appointment
          </TabsTrigger>
          <TabsTrigger value="my-appointments" className="gap-2">
            <CalendarCheck className="size-4" />
            My Appointments
          </TabsTrigger>
        </TabsList>

        {/* Book Appointment Tab */}
        <TabsContent value="book" className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search doctors by name or specialization..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-secondary/50"
                  />
                </div>
                <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                  <SelectTrigger className="w-full sm:w-[200px] bg-secondary/50">
                    <Filter className="size-4 mr-2" />
                    <SelectValue placeholder="Specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specializations</SelectItem>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Doctors Grid or Selected Doctor Appointments */}
          {selectedDoctor ? (
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {selectedDoctor.name.split(" ").slice(1).map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <CardTitle>{selectedDoctor.name}</CardTitle>
                      <CardDescription>{selectedDoctor.specialization}</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedDoctor(null)}>
                    Back to Doctors
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {availableAppointmentsForDoctor.length > 0 ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-4">
                      {availableAppointmentsForDoctor.length} available appointment slots
                    </p>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      {availableAppointmentsForDoctor.map((appointment) => (
                        <AppointmentSlot
                          key={appointment.id}
                          appointment={appointment}
                          onBook={setAppointmentToBook}
                          isBooked={appointmentToBook?.id === appointment.id}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <CalendarX className="size-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No available appointments for this doctor.</p>
                    <Button variant="outline" className="mt-4" onClick={() => setSelectedDoctor(null)}>
                      Choose Another Doctor
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onViewAppointments={setSelectedDoctor}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* My Appointments Tab */}
        <TabsContent value="my-appointments" className="space-y-6">
          {myAppointments.length > 0 ? (
            <div className="space-y-6">
              {upcomingAppointments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CalendarCheck className="size-5 text-cyan-400" />
                    Upcoming Appointments ({upcomingAppointments.length})
                  </h3>
                  <div className="space-y-3">
                    {upcomingAppointments.map((appointment) => (
                      <MyAppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onCancel={handleCancelAppointment}
                      />
                    ))}
                  </div>
                </div>
              )}

              {pastAppointments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-emerald-400" />
                    Past Appointments ({pastAppointments.length})
                  </h3>
                  <div className="space-y-3">
                    {pastAppointments.map((appointment) => (
                      <MyAppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onCancel={() => {}}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <CalendarX className="size-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Appointments Yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t booked any appointments yet. Browse our doctors and book your first appointment.
                </p>
                <Button>Book Your First Appointment</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Booking Confirmation Dialog */}
      <Dialog open={!!appointmentToBook} onOpenChange={() => setAppointmentToBook(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Appointment Booking</DialogTitle>
            <DialogDescription>
              Please review the appointment details before confirming.
            </DialogDescription>
          </DialogHeader>
          {appointmentToBook && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/10 min-w-[80px]">
                  <Calendar className="size-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">
                    {new Date(appointmentToBook.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <span className="text-lg font-semibold text-primary">{appointmentToBook.time}</span>
                </div>
                <div>
                  <p className="font-semibold">{appointmentToBook.doctorName}</p>
                  <p className="text-sm text-muted-foreground">{appointmentToBook.specialization}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <MapPin className="size-3 inline mr-1" />
                    {appointmentToBook.roomNumber}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAppointmentToBook(null)}>
              Cancel
            </Button>
            <Button onClick={handleBookAppointment}>
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-4 size-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="size-8 text-emerald-400" />
            </div>
            <DialogTitle className="text-center">Appointment Booked Successfully!</DialogTitle>
            <DialogDescription className="text-center">
              Your appointment has been confirmed. You will receive a reminder before your visit.
            </DialogDescription>
          </DialogHeader>
          {bookedAppointment && (
            <div className="py-4">
              <div className="p-4 rounded-lg bg-secondary/50 text-center">
                <p className="font-semibold">{bookedAppointment.doctorName}</p>
                <p className="text-sm text-muted-foreground">{bookedAppointment.specialization}</p>
                <div className="mt-2 flex items-center justify-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    {new Date(bookedAppointment.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-4" />
                    {bookedAppointment.time}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button className="w-full" onClick={() => setShowSuccessDialog(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
