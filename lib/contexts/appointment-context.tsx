"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Appointment } from "@/lib/types"
import {
  appointments as initialAppointments,
  getAvailableAppointments as getAvailableFromData,
  getAppointmentsByDoctor as getByDoctorFromData,
  getAppointmentsByPatient as getByPatientFromData,
  getUpcomingAppointmentsForDoctor as getUpcomingFromData,
} from "@/lib/mock-data/appointments"

interface AppointmentContextType {
  appointments: Appointment[]
  bookAppointment: (appointmentId: string, patientId: string, patientName: string) => Appointment | null
  cancelAppointment: (appointmentId: string) => Appointment | null
  completeAppointment: (appointmentId: string, notes?: string) => Appointment | null
  getAvailableAppointments: () => Appointment[]
  getAppointmentsByDoctor: (doctorId: string) => Appointment[]
  getAppointmentsByPatient: (patientId: string) => Appointment[]
  getUpcomingAppointmentsForDoctor: (doctorId: string) => Appointment[]
  refreshAppointments: () => void
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined)

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)

  const bookAppointment = useCallback((
    appointmentId: string,
    patientId: string,
    patientName: string
  ): Appointment | null => {
    const index = appointments.findIndex((a) => a.id === appointmentId)
    if (index === -1 || appointments[index].status !== "available") {
      return null
    }

    const updatedAppointment: Appointment = {
      ...appointments[index],
      patientId,
      patientName,
      status: "booked",
      updatedAt: new Date().toISOString(),
    }

    setAppointments((prev) => {
      const newAppointments = [...prev]
      newAppointments[index] = updatedAppointment
      return newAppointments
    })

    return updatedAppointment
  }, [appointments])

  const cancelAppointment = useCallback((appointmentId: string): Appointment | null => {
    const index = appointments.findIndex((a) => a.id === appointmentId)
    if (index === -1 || appointments[index].status !== "booked") {
      return null
    }

    const updatedAppointment: Appointment = {
      ...appointments[index],
      patientId: undefined,
      patientName: undefined,
      status: "available",
      updatedAt: new Date().toISOString(),
    }

    setAppointments((prev) => {
      const newAppointments = [...prev]
      newAppointments[index] = updatedAppointment
      return newAppointments
    })

    return updatedAppointment
  }, [appointments])

  const completeAppointment = useCallback((appointmentId: string, notes?: string): Appointment | null => {
    const index = appointments.findIndex((a) => a.id === appointmentId)
    if (index === -1 || appointments[index].status !== "booked") {
      return null
    }

    const updatedAppointment: Appointment = {
      ...appointments[index],
      status: "completed",
      notes,
      updatedAt: new Date().toISOString(),
    }

    setAppointments((prev) => {
      const newAppointments = [...prev]
      newAppointments[index] = updatedAppointment
      return newAppointments
    })

    return updatedAppointment
  }, [appointments])

  const getAvailableAppointments = useCallback((): Appointment[] => {
    const today = new Date().toISOString().split("T")[0]
    return appointments.filter((a) => a.status === "available" && a.date >= today)
  }, [appointments])

  const getAppointmentsByDoctor = useCallback((doctorId: string): Appointment[] => {
    return appointments.filter((a) => a.doctorId === doctorId)
  }, [appointments])

  const getAppointmentsByPatient = useCallback((patientId: string): Appointment[] => {
    return appointments.filter((a) => a.patientId === patientId)
  }, [appointments])

  const getUpcomingAppointmentsForDoctor = useCallback((doctorId: string): Appointment[] => {
    const now = new Date()
    const today = now.toISOString().split("T")[0]
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

    return appointments
      .filter((a) => {
        if (a.doctorId !== doctorId) return false
        if (a.status !== "booked") return false
        if (a.date > today) return true
        if (a.date === today && a.time > currentTime) return true
        return false
      })
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date)
        return a.time.localeCompare(b.time)
      })
  }, [appointments])

  const refreshAppointments = useCallback(() => {
    setAppointments([...initialAppointments])
  }, [])

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        bookAppointment,
        cancelAppointment,
        completeAppointment,
        getAvailableAppointments,
        getAppointmentsByDoctor,
        getAppointmentsByPatient,
        getUpcomingAppointmentsForDoctor,
        refreshAppointments,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  )
}

export function useAppointments() {
  const context = useContext(AppointmentContext)
  if (context === undefined) {
    throw new Error("useAppointments must be used within an AppointmentProvider")
  }
  return context
}
