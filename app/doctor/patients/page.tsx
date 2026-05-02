"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAppointments } from "@/lib/contexts/appointment-context"
import { useDashboard } from "@/app/doctor/layout"
import { doctors } from "@/lib/mock-data/doctors"
import {
  Users,
  User,
  Calendar,
  Clock,
  Phone,
  Mail,
  Activity,
} from "lucide-react"

export default function PatientsPage() {
  const { user } = useDashboard()
  const { getAppointmentsByDoctor } = useAppointments()

  const currentDoctor = useMemo(() => {
    const found = doctors.find(d => d.name === user?.name)
    return found || doctors[0]
  }, [user?.name])

  const doctorId = currentDoctor.id

  const doctorAppointments = useMemo(() => {
    return getAppointmentsByDoctor(doctorId)
  }, [getAppointmentsByDoctor, doctorId])

  // Extract unique patients from appointments
  const patients = useMemo(() => {
    const patientMap = new Map<string, {
      id: string
      name: string
      lastVisit: string
      totalVisits: number
      upcomingAppointments: number
    }>()

    const today = new Date().toISOString().split("T")[0]

    doctorAppointments.forEach((appointment) => {
      if (!appointment.patientId || !appointment.patientName) return

      const existing = patientMap.get(appointment.patientId)
      const isUpcoming = appointment.date >= today && appointment.status === "booked"
      const isCompleted = appointment.status === "completed"

      if (existing) {
        if (isCompleted && appointment.date > existing.lastVisit) {
          existing.lastVisit = appointment.date
        }
        if (isCompleted) {
          existing.totalVisits++
        }
        if (isUpcoming) {
          existing.upcomingAppointments++
        }
      } else {
        patientMap.set(appointment.patientId, {
          id: appointment.patientId,
          name: appointment.patientName,
          lastVisit: isCompleted ? appointment.date : "",
          totalVisits: isCompleted ? 1 : 0,
          upcomingAppointments: isUpcoming ? 1 : 0,
        })
      }
    })

    return Array.from(patientMap.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    )
  }, [doctorAppointments])

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "No visits yet"
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Patients</h1>
        <p className="text-muted-foreground">
          View and manage your patient list
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{patients.length}</p>
                <p className="text-sm text-muted-foreground">Total Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Activity className="size-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {patients.filter(p => p.upcomingAppointments > 0).length}
                </p>
                <p className="text-sm text-muted-foreground">With Upcoming Visits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Calendar className="size-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {patients.reduce((sum, p) => sum + p.totalVisits, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Visits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patients List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
          <CardDescription>
            All patients who have appointments with you
          </CardDescription>
        </CardHeader>
        <CardContent>
          {patients.length > 0 ? (
            <div className="space-y-3">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="size-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Last Visit</p>
                      <p className="font-medium">{formatDate(patient.lastVisit)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Visits</p>
                      <p className="font-medium">{patient.totalVisits}</p>
                    </div>
                    {patient.upcomingAppointments > 0 && (
                      <Badge className="bg-cyan-500/20 text-cyan-400">
                        {patient.upcomingAppointments} upcoming
                      </Badge>
                    )}
                    <Button variant="outline" size="sm">
                      View History
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="size-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Patients Yet</h3>
              <p className="text-muted-foreground">
                Patients will appear here once they book appointments with you.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
