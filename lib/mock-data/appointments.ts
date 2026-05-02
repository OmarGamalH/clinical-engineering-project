import type { Appointment } from "@/lib/types"
import { doctors } from "./doctors"

// Generate appointments for the next 14 days
const generateAppointments = (): Appointment[] => {
  const appointments: Appointment[] = []
  const today = new Date()
  
  // Time slots for appointments
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "14:00", "14:30", "15:00", "15:30", "16:00"
  ]
  
  // Room numbers by department
  const roomNumbers: Record<string, string[]> = {
    "CCU": ["CCU-101", "CCU-102", "CCU-103"],
    "Neurology": ["N-201", "N-202", "N-203"],
    "Orthopedics": ["O-301", "O-302"],
    "Pediatrics": ["P-101", "P-102", "P-103", "P-104"],
    "OR": ["OR-1", "OR-2", "OR-3"],
    "Med-Surg": ["MS-201", "MS-202", "MS-203", "MS-204"],
    "Dermatology": ["D-101", "D-102"],
    "Psychiatry": ["PSY-101", "PSY-102"],
  }
  
  // Sample patient names for booked appointments
  const patientNames = [
    "Ahmed Mohamed", "Sara Ali", "Mohamed Ibrahim", "Fatima Hassan",
    "Omar Youssef", "Nour El-Din", "Layla Ahmed", "Karim Mahmoud",
    "Hana Khalil", "Tarek Sami", "Dina Mostafa", "Amr Farouk"
  ]
  
  let appointmentId = 1
  
  // Generate appointments for each doctor for the next 14 days
  doctors.forEach((doctor) => {
    for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
      const date = new Date(today)
      date.setDate(today.getDate() + dayOffset)
      const dayOfWeek = date.getDay()
      
      // Check if doctor is available on this day
      const availability = doctor.availability.find(a => a.dayOfWeek === dayOfWeek)
      if (!availability) continue
      
      // Get available time slots for this doctor
      const doctorTimeSlots = timeSlots.filter(slot => {
        const slotHour = parseInt(slot.split(":")[0])
        const startHour = parseInt(availability.startTime.split(":")[0])
        const endHour = parseInt(availability.endTime.split(":")[0])
        return slotHour >= startHour && slotHour < endHour
      })
      
      // Generate appointments for available slots
      doctorTimeSlots.forEach((time, index) => {
        const rooms = roomNumbers[doctor.department] || ["Room-100"]
        const roomNumber = rooms[Math.floor(Math.random() * rooms.length)]
        
        // Randomly book some past appointments and some future ones
        const isPast = dayOffset < 0 || (dayOffset === 0 && parseInt(time.split(":")[0]) < new Date().getHours())
        const shouldBook = Math.random() < 0.4 // 40% chance of being booked
        
        let status: Appointment["status"] = "available"
        let patientId: string | undefined
        let patientName: string | undefined
        
        if (isPast && shouldBook) {
          status = "completed"
          patientId = `pat-${Math.floor(Math.random() * 1000)}`
          patientName = patientNames[Math.floor(Math.random() * patientNames.length)]
        } else if (shouldBook && dayOffset > 0) {
          status = "booked"
          patientId = `pat-${Math.floor(Math.random() * 1000)}`
          patientName = patientNames[Math.floor(Math.random() * patientNames.length)]
        }
        
        appointments.push({
          id: `apt-${String(appointmentId++).padStart(4, "0")}`,
          doctorId: doctor.id,
          doctorName: doctor.name,
          specialization: doctor.specialization,
          patientId,
          patientName,
          date: date.toISOString().split("T")[0],
          time,
          duration: 30,
          status,
          department: doctor.department,
          roomNumber,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      })
    }
  })
  
  return appointments
}

// Initial appointments data
export let appointments: Appointment[] = generateAppointments()

// Function to get all appointments
export const getAllAppointments = (): Appointment[] => {
  return appointments
}

// Function to get appointments by doctor
export const getAppointmentsByDoctor = (doctorId: string): Appointment[] => {
  return appointments.filter((a) => a.doctorId === doctorId)
}

// Function to get appointments by patient
export const getAppointmentsByPatient = (patientId: string): Appointment[] => {
  return appointments.filter((a) => a.patientId === patientId)
}

// Function to get available appointments
export const getAvailableAppointments = (): Appointment[] => {
  const today = new Date().toISOString().split("T")[0]
  return appointments.filter((a) => a.status === "available" && a.date >= today)
}

// Function to get available appointments by doctor
export const getAvailableAppointmentsByDoctor = (doctorId: string): Appointment[] => {
  const today = new Date().toISOString().split("T")[0]
  return appointments.filter(
    (a) => a.doctorId === doctorId && a.status === "available" && a.date >= today
  )
}

// Function to book an appointment
export const bookAppointment = (
  appointmentId: string,
  patientId: string,
  patientName: string
): Appointment | null => {
  const index = appointments.findIndex((a) => a.id === appointmentId)
  if (index === -1 || appointments[index].status !== "available") {
    return null
  }
  
  appointments[index] = {
    ...appointments[index],
    patientId,
    patientName,
    status: "booked",
    updatedAt: new Date().toISOString(),
  }
  
  return appointments[index]
}

// Function to cancel an appointment
export const cancelAppointment = (appointmentId: string): Appointment | null => {
  const index = appointments.findIndex((a) => a.id === appointmentId)
  if (index === -1 || appointments[index].status !== "booked") {
    return null
  }
  
  appointments[index] = {
    ...appointments[index],
    patientId: undefined,
    patientName: undefined,
    status: "available",
    updatedAt: new Date().toISOString(),
  }
  
  return appointments[index]
}

// Function to complete an appointment
export const completeAppointment = (appointmentId: string, notes?: string): Appointment | null => {
  const index = appointments.findIndex((a) => a.id === appointmentId)
  if (index === -1 || appointments[index].status !== "booked") {
    return null
  }
  
  appointments[index] = {
    ...appointments[index],
    status: "completed",
    notes,
    updatedAt: new Date().toISOString(),
  }
  
  return appointments[index]
}

// Function to get appointment statistics
export const getAppointmentStats = () => {
  const today = new Date().toISOString().split("T")[0]
  const todayAppointments = appointments.filter((a) => a.date === today)
  
  return {
    total: appointments.length,
    available: appointments.filter((a) => a.status === "available").length,
    booked: appointments.filter((a) => a.status === "booked").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
    todayTotal: todayAppointments.length,
    todayBooked: todayAppointments.filter((a) => a.status === "booked").length,
  }
}

// Function to get upcoming appointments for a doctor
export const getUpcomingAppointmentsForDoctor = (doctorId: string): Appointment[] => {
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
}

// Function to get appointments by date range
export const getAppointmentsByDateRange = (startDate: string, endDate: string): Appointment[] => {
  return appointments.filter((a) => a.date >= startDate && a.date <= endDate)
}
