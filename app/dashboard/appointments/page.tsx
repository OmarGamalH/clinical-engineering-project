"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppointments } from "@/lib/contexts/appointment-context"
import { doctors, specializations } from "@/lib/mock-data/doctors"
import {
  Calendar,
  Clock,
  Search,
  MapPin,
  CalendarCheck,
  CalendarX,
  Users,
  CheckCircle2,
  User,
  Stethoscope,
  Filter,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import type { Appointment } from "@/lib/types"

export default function AppointmentsPage() {
  const { appointments } = useAppointments()
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    let filtered = appointments

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (a) =>
          a.patientName?.toLowerCase().includes(query) ||
          a.doctorName.toLowerCase().includes(query) ||
          a.specialization.toLowerCase().includes(query)
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

    // Department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter((a) => a.department === departmentFilter)
    }

    // Sort by date and time
    return filtered.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return a.time.localeCompare(b.time)
    })
  }, [appointments, searchQuery, dateFilter, statusFilter, departmentFilter])

  // Calculate stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    const todayAppointments = appointments.filter((a) => a.date === today)
    
    return {
      total: appointments.length,
      booked: appointments.filter((a) => a.status === "booked").length,
      available: appointments.filter((a) => a.status === "available").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      todayBooked: todayAppointments.filter((a) => a.status === "booked").length,
      todayCompleted: todayAppointments.filter((a) => a.status === "completed").length,
    }
  }, [appointments])

  // Get unique departments
  const departments = useMemo(() => {
    return [...new Set(appointments.map((a) => a.department))]
  }, [appointments])

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "available":
        return <Badge className="bg-emerald-500/20 text-emerald-400">Available</Badge>
      case "booked":
        return <Badge className="bg-cyan-500/20 text-cyan-400">Booked</Badge>
      case "completed":
        return <Badge className="bg-primary/20 text-primary">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-500/20 text-red-400">Cancelled</Badge>
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Appointment Management</h1>
        <p className="text-muted-foreground">
          Overview of all hospital appointments and scheduling
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <CalendarCheck className="size-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.booked}</p>
                <p className="text-sm text-muted-foreground">Booked Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Calendar className="size-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.available}</p>
                <p className="text-sm text-muted-foreground">Available Slots</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle2 className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
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
                <p className="text-2xl font-bold">{stats.todayBooked}</p>
                <p className="text-sm text-muted-foreground">Today&apos;s Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient, doctor, or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[140px] bg-secondary/50">
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
                <SelectTrigger className="w-[140px] bg-secondary/50">
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
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[160px] bg-secondary/50">
                  <Stethoscope className="size-4 mr-2" />
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
          <CardDescription>
            Showing {filteredAppointments.length} of {appointments.length} appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Date & Time</th>
                  <th className="text-left py-3 px-4 font-medium">Patient</th>
                  <th className="text-left py-3 px-4 font-medium">Doctor</th>
                  <th className="text-left py-3 px-4 font-medium">Department</th>
                  <th className="text-center py-3 px-4 font-medium">Room</th>
                  <th className="text-center py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.slice(0, 50).map((appointment) => (
                  <tr key={appointment.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{formatDate(appointment.date)}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="size-3" />
                          {appointment.time}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {appointment.patientName ? (
                        <div className="flex items-center gap-2">
                          <div className="size-8 rounded-full bg-secondary flex items-center justify-center">
                            <User className="size-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{appointment.patientName}</p>
                            <p className="text-xs text-muted-foreground">{appointment.patientId}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{appointment.doctorName}</p>
                        <p className="text-xs text-muted-foreground">{appointment.specialization}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{appointment.department}</Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-muted-foreground">{appointment.roomNumber}</span>
                    </td>
                    <td className="text-center py-3 px-4">
                      {getStatusBadge(appointment.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredAppointments.length > 50 && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              Showing first 50 of {filteredAppointments.length} results
            </p>
          )}
          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <CalendarX className="size-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Appointments Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Doctor Statistics */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-5" />
            Appointments by Doctor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {doctors.slice(0, 8).map((doctor) => {
              const doctorAppointments = appointments.filter((a) => a.doctorId === doctor.id)
              const bookedCount = doctorAppointments.filter((a) => a.status === "booked").length
              const completedCount = doctorAppointments.filter((a) => a.status === "completed").length
              
              return (
                <div key={doctor.id} className="p-4 rounded-lg bg-secondary/30 border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {doctor.name.split(" ").slice(1).map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{doctor.name}</p>
                      <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 rounded bg-cyan-500/10 text-center">
                      <p className="font-bold text-cyan-400">{bookedCount}</p>
                      <p className="text-xs text-muted-foreground">Booked</p>
                    </div>
                    <div className="p-2 rounded bg-emerald-500/10 text-center">
                      <p className="font-bold text-emerald-400">{completedCount}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
