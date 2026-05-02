import type {
  VitalSignsDevice,
  InfusionPumpDevice,
  VentilatorDevice,
  ECGDevice,
  Device,
} from "@/lib/types"

export const initialVitalSignsDevices: VitalSignsDevice[] = [
  {
    id: "vs-001",
    name: "Vital Monitor Alpha",
    type: "vital-signs",
    status: "online",
    connectionStatus: "connected",
    location: "ICU Room 101",
    lastSync: new Date(),
    patientId: "pt-001",
    ehrConnected: true,
    data: {
      heartRate: 72,
      systolicBP: 120,
      diastolicBP: 80,
      spO2: 98,
      temperature: 36.8,
      respiratoryRate: 16,
    },
  },
  {
    id: "vs-002",
    name: "Vital Monitor Beta",
    type: "vital-signs",
    status: "warning",
    connectionStatus: "connected",
    location: "ICU Room 102",
    lastSync: new Date(),
    patientId: "pt-002",
    ehrConnected: true,
    data: {
      heartRate: 95,
      systolicBP: 145,
      diastolicBP: 92,
      spO2: 94,
      temperature: 37.8,
      respiratoryRate: 22,
    },
  },
  {
    id: "vs-003",
    name: "Vital Monitor Gamma",
    type: "vital-signs",
    status: "online",
    connectionStatus: "connected",
    location: "ER Bay 3",
    lastSync: new Date(),
    patientId: "pt-003",
    ehrConnected: false,
    data: {
      heartRate: 68,
      systolicBP: 118,
      diastolicBP: 76,
      spO2: 99,
      temperature: 36.5,
      respiratoryRate: 14,
    },
  },
]

export const initialInfusionPumps: InfusionPumpDevice[] = [
  {
    id: "ip-001",
    name: "Infusion Pump A1",
    type: "infusion-pump",
    status: "online",
    connectionStatus: "connected",
    location: "ICU Room 101",
    lastSync: new Date(),
    patientId: "pt-001",
    ehrConnected: true,
    data: {
      drugName: "Normal Saline",
      concentration: "0.9%",
      flowRate: 125,
      volumeInfused: 450,
      volumeRemaining: 550,
      timeRemaining: 264,
      occlusionAlert: false,
    },
  },
  {
    id: "ip-002",
    name: "Infusion Pump B2",
    type: "infusion-pump",
    status: "critical",
    connectionStatus: "connected",
    location: "ICU Room 102",
    lastSync: new Date(),
    patientId: "pt-002",
    ehrConnected: true,
    data: {
      drugName: "Morphine PCA",
      concentration: "1mg/mL",
      flowRate: 2,
      volumeInfused: 18,
      volumeRemaining: 82,
      timeRemaining: 2460,
      occlusionAlert: true,
    },
  },
  {
    id: "ip-003",
    name: "Infusion Pump C3",
    type: "infusion-pump",
    status: "online",
    connectionStatus: "connected",
    location: "Med-Surg 205",
    lastSync: new Date(),
    patientId: "pt-004",
    ehrConnected: true,
    data: {
      drugName: "Vancomycin",
      concentration: "500mg/100mL",
      flowRate: 100,
      volumeInfused: 25,
      volumeRemaining: 75,
      timeRemaining: 45,
      occlusionAlert: false,
    },
  },
]

export const initialVentilators: VentilatorDevice[] = [
  {
    id: "vent-001",
    name: "Ventilator Unit 1",
    type: "ventilator",
    status: "online",
    connectionStatus: "connected",
    location: "ICU Room 103",
    lastSync: new Date(),
    patientId: "pt-005",
    ehrConnected: true,
    data: {
      mode: "AC",
      tidalVolume: 450,
      respiratoryRate: 14,
      peep: 5,
      fiO2: 40,
      pip: 22,
      minuteVentilation: 6.3,
    },
  },
  {
    id: "vent-002",
    name: "Ventilator Unit 2",
    type: "ventilator",
    status: "warning",
    connectionStatus: "connected",
    location: "ICU Room 104",
    lastSync: new Date(),
    patientId: "pt-006",
    ehrConnected: true,
    data: {
      mode: "SIMV",
      tidalVolume: 500,
      respiratoryRate: 16,
      peep: 8,
      fiO2: 60,
      pip: 28,
      minuteVentilation: 8.0,
    },
  },
]

export const initialECGDevices: ECGDevice[] = [
  {
    id: "ecg-001",
    name: "ECG Monitor 1",
    type: "ecg",
    status: "online",
    connectionStatus: "connected",
    location: "CCU Room 201",
    lastSync: new Date(),
    patientId: "pt-007",
    ehrConnected: true,
    data: {
      heartRate: 75,
      rhythm: "Normal Sinus Rhythm",
      selectedLead: "II",
      waveformData: [],
      arrhythmiaDetected: false,
    },
  },
  {
    id: "ecg-002",
    name: "ECG Monitor 2",
    type: "ecg",
    status: "critical",
    connectionStatus: "connected",
    location: "CCU Room 202",
    lastSync: new Date(),
    patientId: "pt-008",
    ehrConnected: true,
    data: {
      heartRate: 142,
      rhythm: "Atrial Fibrillation",
      selectedLead: "II",
      waveformData: [],
      arrhythmiaDetected: true,
      arrhythmiaType: "AFib",
    },
  },
]

export const getAllDevices = (): Device[] => [
  ...initialVitalSignsDevices,
  ...initialInfusionPumps,
  ...initialVentilators,
  ...initialECGDevices,
]

export const getDeviceById = (id: string): Device | undefined => {
  return getAllDevices().find((device) => device.id === id)
}

export const getDevicesByType = (type: Device["type"]): Device[] => {
  return getAllDevices().filter((device) => device.type === type)
}

export const getDeviceStats = () => {
  const devices = getAllDevices()
  return {
    total: devices.length,
    online: devices.filter((d) => d.status === "online").length,
    offline: devices.filter((d) => d.status === "offline").length,
    warning: devices.filter((d) => d.status === "warning").length,
    critical: devices.filter((d) => d.status === "critical").length,
    ehrConnected: devices.filter((d) => d.ehrConnected).length,
  }
}
