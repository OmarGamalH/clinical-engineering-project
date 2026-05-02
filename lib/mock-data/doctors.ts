import type { Doctor } from "@/lib/types"

export const doctors: Doctor[] = [
  {
    id: "doc-001",
    name: "Dr. Ahmed Hassan",
    email: "ahmed.hassan@hospital.com",
    phone: "+20-123-456-7890",
    specialization: "Cardiology",
    department: "CCU",
    yearsOfExperience: 15,
    education: "MD, Cairo University | Fellowship in Cardiology, Johns Hopkins",
    rating: 4.9,
    totalPatients: 2450,
    availability: [
      { dayOfWeek: 0, startTime: "09:00", endTime: "14:00" },
      { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 4, startTime: "09:00", endTime: "14:00" },
    ],
  },
  {
    id: "doc-002",
    name: "Dr. Sarah El-Masry",
    email: "sarah.elmasry@hospital.com",
    phone: "+20-123-456-7891",
    specialization: "Neurology",
    department: "Neurology",
    yearsOfExperience: 12,
    education: "MD, Ain Shams University | PhD in Neuroscience, Harvard",
    rating: 4.8,
    totalPatients: 1890,
    availability: [
      { dayOfWeek: 1, startTime: "08:00", endTime: "16:00" },
      { dayOfWeek: 2, startTime: "08:00", endTime: "16:00" },
      { dayOfWeek: 3, startTime: "08:00", endTime: "16:00" },
      { dayOfWeek: 4, startTime: "08:00", endTime: "16:00" },
      { dayOfWeek: 5, startTime: "08:00", endTime: "12:00" },
    ],
  },
  {
    id: "doc-003",
    name: "Dr. Mohamed Farouk",
    email: "mohamed.farouk@hospital.com",
    phone: "+20-123-456-7892",
    specialization: "Orthopedics",
    department: "Orthopedics",
    yearsOfExperience: 20,
    education: "MD, Alexandria University | Fellowship in Joint Replacement, Mayo Clinic",
    rating: 4.7,
    totalPatients: 3200,
    availability: [
      { dayOfWeek: 0, startTime: "10:00", endTime: "15:00" },
      { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 5, startTime: "09:00", endTime: "13:00" },
    ],
  },
  {
    id: "doc-004",
    name: "Dr. Fatima Al-Rashid",
    email: "fatima.alrashid@hospital.com",
    phone: "+20-123-456-7893",
    specialization: "Pediatrics",
    department: "Pediatrics",
    yearsOfExperience: 10,
    education: "MD, Cairo University | Residency in Pediatrics, Cleveland Clinic",
    rating: 4.9,
    totalPatients: 4100,
    availability: [
      { dayOfWeek: 0, startTime: "09:00", endTime: "14:00" },
      { dayOfWeek: 1, startTime: "08:00", endTime: "16:00" },
      { dayOfWeek: 2, startTime: "08:00", endTime: "16:00" },
      { dayOfWeek: 3, startTime: "08:00", endTime: "16:00" },
      { dayOfWeek: 4, startTime: "08:00", endTime: "16:00" },
    ],
  },
  {
    id: "doc-005",
    name: "Dr. Omar Khalil",
    email: "omar.khalil@hospital.com",
    phone: "+20-123-456-7894",
    specialization: "General Surgery",
    department: "OR",
    yearsOfExperience: 18,
    education: "MD, Ain Shams University | Fellowship in Minimally Invasive Surgery, Stanford",
    rating: 4.6,
    totalPatients: 2800,
    availability: [
      { dayOfWeek: 1, startTime: "07:00", endTime: "15:00" },
      { dayOfWeek: 2, startTime: "07:00", endTime: "15:00" },
      { dayOfWeek: 3, startTime: "07:00", endTime: "15:00" },
      { dayOfWeek: 4, startTime: "07:00", endTime: "15:00" },
    ],
  },
  {
    id: "doc-006",
    name: "Dr. Layla Ibrahim",
    email: "layla.ibrahim@hospital.com",
    phone: "+20-123-456-7895",
    specialization: "Internal Medicine",
    department: "Med-Surg",
    yearsOfExperience: 8,
    education: "MD, Cairo University | Board Certified in Internal Medicine",
    rating: 4.8,
    totalPatients: 1650,
    availability: [
      { dayOfWeek: 0, startTime: "10:00", endTime: "16:00" },
      { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 5, startTime: "09:00", endTime: "13:00" },
    ],
  },
  {
    id: "doc-007",
    name: "Dr. Youssef Nader",
    email: "youssef.nader@hospital.com",
    phone: "+20-123-456-7896",
    specialization: "Dermatology",
    department: "Dermatology",
    yearsOfExperience: 6,
    education: "MD, Alexandria University | Dermatology Residency, UCLA",
    rating: 4.7,
    totalPatients: 980,
    availability: [
      { dayOfWeek: 1, startTime: "10:00", endTime: "18:00" },
      { dayOfWeek: 2, startTime: "10:00", endTime: "18:00" },
      { dayOfWeek: 3, startTime: "10:00", endTime: "18:00" },
      { dayOfWeek: 5, startTime: "10:00", endTime: "14:00" },
    ],
  },
  {
    id: "doc-008",
    name: "Dr. Nadia Mostafa",
    email: "nadia.mostafa@hospital.com",
    phone: "+20-123-456-7897",
    specialization: "Psychiatry",
    department: "Psychiatry",
    yearsOfExperience: 14,
    education: "MD, Cairo University | Fellowship in Psychiatry, Columbia",
    rating: 4.9,
    totalPatients: 1200,
    availability: [
      { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
    ],
  },
]

export const getDoctorById = (id: string): Doctor | undefined => {
  return doctors.find((d) => d.id === id)
}

export const getDoctorsBySpecialization = (specialization: string): Doctor[] => {
  return doctors.filter((d) => 
    d.specialization.toLowerCase().includes(specialization.toLowerCase())
  )
}

export const getDoctorsByDepartment = (department: string): Doctor[] => {
  return doctors.filter((d) => d.department === department)
}

export const searchDoctors = (query: string): Doctor[] => {
  const lowerQuery = query.toLowerCase()
  return doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(lowerQuery) ||
      d.specialization.toLowerCase().includes(lowerQuery) ||
      d.department.toLowerCase().includes(lowerQuery)
  )
}

export const specializations = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "General Surgery",
  "Internal Medicine",
  "Dermatology",
  "Psychiatry",
  "Ophthalmology",
  "Gynecology",
  "Urology",
  "ENT",
  "Radiology",
  "Oncology",
]
