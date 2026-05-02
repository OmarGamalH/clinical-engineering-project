import type { Patient } from "@/lib/types"

export const patients: Patient[] = [
  {
    id: "pt-001",
    mrn: "MRN-2024-001",
    firstName: "John",
    lastName: "Smith",
    dateOfBirth: "1958-03-15",
    gender: "male",
    roomNumber: "ICU-101",
    admissionDate: "2024-01-10",
    diagnosis: "Acute Respiratory Failure",
    assignedDevices: ["vs-001", "ip-001"],
  },
  {
    id: "pt-002",
    mrn: "MRN-2024-002",
    firstName: "Sarah",
    lastName: "Johnson",
    dateOfBirth: "1972-07-22",
    gender: "female",
    roomNumber: "ICU-102",
    admissionDate: "2024-01-12",
    diagnosis: "Post-Operative Monitoring",
    assignedDevices: ["vs-002", "ip-002"],
  },
  {
    id: "pt-003",
    mrn: "MRN-2024-003",
    firstName: "Michael",
    lastName: "Williams",
    dateOfBirth: "1985-11-08",
    gender: "male",
    roomNumber: "ER-Bay-3",
    admissionDate: "2024-01-14",
    diagnosis: "Chest Pain - Rule Out MI",
    assignedDevices: ["vs-003"],
  },
  {
    id: "pt-004",
    mrn: "MRN-2024-004",
    firstName: "Emily",
    lastName: "Brown",
    dateOfBirth: "1965-04-30",
    gender: "female",
    roomNumber: "MS-205",
    admissionDate: "2024-01-11",
    diagnosis: "Cellulitis - IV Antibiotics",
    assignedDevices: ["ip-003"],
  },
  {
    id: "pt-005",
    mrn: "MRN-2024-005",
    firstName: "Robert",
    lastName: "Davis",
    dateOfBirth: "1948-09-12",
    gender: "male",
    roomNumber: "ICU-103",
    admissionDate: "2024-01-09",
    diagnosis: "ARDS - Mechanical Ventilation",
    assignedDevices: ["vent-001"],
  },
  {
    id: "pt-006",
    mrn: "MRN-2024-006",
    firstName: "Linda",
    lastName: "Martinez",
    dateOfBirth: "1960-01-25",
    gender: "female",
    roomNumber: "ICU-104",
    admissionDate: "2024-01-13",
    diagnosis: "COPD Exacerbation",
    assignedDevices: ["vent-002"],
  },
  {
    id: "pt-007",
    mrn: "MRN-2024-007",
    firstName: "James",
    lastName: "Wilson",
    dateOfBirth: "1955-06-18",
    gender: "male",
    roomNumber: "CCU-201",
    admissionDate: "2024-01-08",
    diagnosis: "Unstable Angina",
    assignedDevices: ["ecg-001"],
  },
  {
    id: "pt-008",
    mrn: "MRN-2024-008",
    firstName: "Patricia",
    lastName: "Taylor",
    dateOfBirth: "1970-12-03",
    gender: "female",
    roomNumber: "CCU-202",
    admissionDate: "2024-01-14",
    diagnosis: "New Onset Atrial Fibrillation",
    assignedDevices: ["ecg-002"],
  },
]

export const getPatientById = (id: string): Patient | undefined => {
  return patients.find((p) => p.id === id)
}

export const getPatientByMRN = (mrn: string): Patient | undefined => {
  return patients.find((p) => p.mrn === mrn)
}

export const searchPatients = (query: string): Patient[] => {
  const lowerQuery = query.toLowerCase()
  return patients.filter(
    (p) =>
      p.firstName.toLowerCase().includes(lowerQuery) ||
      p.lastName.toLowerCase().includes(lowerQuery) ||
      p.mrn.toLowerCase().includes(lowerQuery)
  )
}
