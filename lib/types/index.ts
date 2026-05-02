// User and Authentication Types
export type UserRole = "admin" | "clinician" | "technician" | "doctor" | "patient"

export interface User {
  id: string
  name: string
  role: UserRole
  department: string
  avatar?: string
  email?: string
  phone?: string
  specialization?: string // For doctors
  dateOfBirth?: string // For patients
}

export interface Permission {
  canViewDevices: boolean
  canConfigureDevices: boolean
  canViewEHR: boolean
  canConfigureEHR: boolean
  canViewSecurity: boolean
  canManageSecurity: boolean
  canViewAuditLogs: boolean
  canViewAppointments: boolean
  canManageAppointments: boolean
  canBookAppointments: boolean
}

// Appointment Types
export type AppointmentStatus = "available" | "booked" | "completed" | "cancelled"

export interface Appointment {
  id: string
  doctorId: string
  doctorName: string
  specialization: string
  patientId?: string
  patientName?: string
  date: string
  time: string
  duration: number // in minutes
  status: AppointmentStatus
  department: string
  roomNumber: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Doctor {
  id: string
  name: string
  email: string
  phone: string
  specialization: string
  department: string
  yearsOfExperience: number
  education: string
  avatar?: string
  availability: DoctorAvailability[]
  rating: number
  totalPatients: number
}

export interface DoctorAvailability {
  dayOfWeek: number // 0-6, Sunday-Saturday
  startTime: string
  endTime: string
}

export interface PatientProfile {
  id: string
  userId: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  bloodType?: string
  allergies?: string[]
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  medicalHistory?: string[]
  insuranceInfo?: {
    provider: string
    policyNumber: string
  }
}

// Device Types
export type DeviceType = "vital-signs" | "infusion-pump" | "ventilator" | "ecg"
export type DeviceStatus = "online" | "offline" | "warning" | "critical"
export type ConnectionStatus = "connected" | "disconnected" | "connecting"

export interface BaseDevice {
  id: string
  name: string
  type: DeviceType
  status: DeviceStatus
  connectionStatus: ConnectionStatus
  location: string
  lastSync: Date
  patientId?: string
  ehrConnected: boolean
}

export interface VitalSignsData {
  heartRate: number
  systolicBP: number
  diastolicBP: number
  spO2: number
  temperature: number
  respiratoryRate: number
}

export interface VitalSignsDevice extends BaseDevice {
  type: "vital-signs"
  data: VitalSignsData
}

export interface InfusionPumpData {
  drugName: string
  concentration: string
  flowRate: number
  volumeInfused: number
  volumeRemaining: number
  timeRemaining: number
  occlusionAlert: boolean
}

export interface InfusionPumpDevice extends BaseDevice {
  type: "infusion-pump"
  data: InfusionPumpData
}

export type VentilatorMode = "AC" | "SIMV" | "CPAP" | "BiPAP"

export interface VentilatorData {
  mode: VentilatorMode
  tidalVolume: number
  respiratoryRate: number
  peep: number
  fiO2: number
  pip: number
  minuteVentilation: number
}

export interface VentilatorDevice extends BaseDevice {
  type: "ventilator"
  data: VentilatorData
}

export type ECGLead = "I" | "II" | "III" | "aVR" | "aVL" | "aVF" | "V1" | "V2" | "V3" | "V4" | "V5" | "V6"

export interface ECGData {
  heartRate: number
  rhythm: string
  selectedLead: ECGLead
  waveformData: number[]
  arrhythmiaDetected: boolean
  arrhythmiaType?: string
}

export interface ECGDevice extends BaseDevice {
  type: "ecg"
  data: ECGData
}

export type Device = VitalSignsDevice | InfusionPumpDevice | VentilatorDevice | ECGDevice

// Patient Types
export interface Patient {
  id: string
  mrn: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  roomNumber: string
  admissionDate: string
  diagnosis: string
  assignedDevices: string[]
}

// EHR Types
export type EHRSystem = "Epic" | "Cerner" | "Meditech" | "AllScripts"

export interface EHRConnection {
  id: string
  system: EHRSystem
  endpoint: string
  status: ConnectionStatus
  lastSync: Date
  patientsMatched: number
  errorCount: number
}

export interface FieldMapping {
  id: string
  deviceField: string
  ehrField: string
  transformation?: string
  enabled: boolean
}

// Data Flow Types
export type DataPacketStatus = "sent" | "received" | "error" | "pending"
export type Protocol = "HL7v2" | "FHIR" | "DICOM"

export interface DataPacket {
  id: string
  timestamp: Date
  source: string
  destination: string
  protocol: Protocol
  status: DataPacketStatus
  size: number
  payload: string
  encrypted: boolean
}

export interface NetworkNode {
  id: string
  name: string
  type: "device" | "gateway" | "server" | "ehr"
  status: "active" | "inactive" | "error"
  x: number
  y: number
}

export interface NetworkConnection {
  from: string
  to: string
  active: boolean
}

// Security Types
export type ThreatSeverity = "critical" | "high" | "medium" | "low"
export type ThreatType = "unauthorized-access" | "malware" | "data-exfiltration" | "dos" | "anomaly"

export interface SecurityThreat {
  id: string
  timestamp: Date
  severity: ThreatSeverity
  type: ThreatType
  source: string
  target: string
  description: string
  status: "active" | "mitigated" | "investigating"
  location?: {
    country: string
    city: string
    lat: number
    lng: number
  }
}

export interface AuditLogEntry {
  id: string
  timestamp: Date
  userId: string
  userName: string
  userRole: UserRole
  action: string
  resource: string
  details: string
  ipAddress: string
  success: boolean
}

export interface AccessAttempt {
  id: string
  timestamp: Date
  userId?: string
  resource: string
  action: string
  granted: boolean
  reason?: string
  ipAddress: string
}

// Encryption Demo Types
export interface EncryptionDemo {
  plainText: string
  encryptedText: string
  algorithm: "AES-256" | "TLS-1.3" | "RSA-2048"
  keyExchangeSteps: string[]
}

// Dashboard Stats
export interface DashboardStats {
  totalDevices: number
  onlineDevices: number
  offlineDevices: number
  warningDevices: number
  criticalDevices: number
  activeAlerts: number
  dataPacketsPerSecond: number
  securityThreats: number
  ehrConnectionStatus: ConnectionStatus
}
