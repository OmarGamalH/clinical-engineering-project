import type { SecurityThreat, ThreatSeverity, ThreatType } from "@/lib/types"

export const initialThreats: SecurityThreat[] = [
  {
    id: "threat-001",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    severity: "high",
    type: "unauthorized-access",
    source: "External IP: 45.33.32.156",
    target: "FHIR API Endpoint",
    description: "Multiple failed authentication attempts detected from unknown IP address",
    status: "investigating",
    location: {
      country: "Russia",
      city: "Moscow",
      lat: 55.7558,
      lng: 37.6173,
    },
  },
  {
    id: "threat-002",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    severity: "medium",
    type: "anomaly",
    source: "Infusion Pump B2",
    target: "Internal Network",
    description: "Unusual data transmission pattern detected from medical device",
    status: "investigating",
  },
  {
    id: "threat-003",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    severity: "low",
    type: "unauthorized-access",
    source: "Workstation WS-045",
    target: "Admin Panel",
    description: "Access attempt outside of normal working hours",
    status: "mitigated",
  },
  {
    id: "threat-004",
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    severity: "critical",
    type: "malware",
    source: "Email Attachment",
    target: "Nurse Station PC",
    description: "Ransomware signature detected in email attachment - blocked by endpoint protection",
    status: "mitigated",
    location: {
      country: "China",
      city: "Beijing",
      lat: 39.9042,
      lng: 116.4074,
    },
  },
  {
    id: "threat-005",
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    severity: "medium",
    type: "data-exfiltration",
    source: "Database Server",
    target: "External FTP",
    description: "Large data transfer attempt to unauthorized external server - blocked",
    status: "mitigated",
    location: {
      country: "Romania",
      city: "Bucharest",
      lat: 44.4268,
      lng: 26.1025,
    },
  },
]

export const threatDescriptions: Record<ThreatType, string> = {
  "unauthorized-access": "Attempt to access system resources without proper authorization",
  malware: "Malicious software detected attempting to compromise system integrity",
  "data-exfiltration": "Unauthorized attempt to transfer sensitive data outside the network",
  dos: "Denial of service attack attempting to overwhelm system resources",
  anomaly: "Unusual behavior pattern that deviates from normal system activity",
}

export const severityColors: Record<ThreatSeverity, string> = {
  critical: "text-red-500 bg-red-500/10",
  high: "text-orange-500 bg-orange-500/10",
  medium: "text-amber-500 bg-amber-500/10",
  low: "text-blue-500 bg-blue-500/10",
}

export const generateRandomThreat = (): SecurityThreat => {
  const severities: ThreatSeverity[] = ["critical", "high", "medium", "low"]
  const types: ThreatType[] = ["unauthorized-access", "malware", "data-exfiltration", "dos", "anomaly"]
  const sources = [
    "External IP: " + generateRandomIP(),
    "Workstation WS-" + Math.floor(Math.random() * 100),
    "Unknown Device",
    "Network Scanner",
    "Email Gateway",
  ]
  const targets = [
    "FHIR API Endpoint",
    "Patient Database",
    "Device Gateway",
    "Admin Panel",
    "Authentication Server",
  ]
  const locations = [
    { country: "China", city: "Beijing", lat: 39.9042, lng: 116.4074 },
    { country: "Russia", city: "Moscow", lat: 55.7558, lng: 37.6173 },
    { country: "North Korea", city: "Pyongyang", lat: 39.0392, lng: 125.7625 },
    { country: "Iran", city: "Tehran", lat: 35.6892, lng: 51.3890 },
    { country: "USA", city: "Unknown", lat: 37.0902, lng: -95.7129 },
  ]

  const severity = severities[Math.floor(Math.random() * severities.length)]
  const type = types[Math.floor(Math.random() * types.length)]

  return {
    id: `threat-${Date.now()}`,
    timestamp: new Date(),
    severity,
    type,
    source: sources[Math.floor(Math.random() * sources.length)],
    target: targets[Math.floor(Math.random() * targets.length)],
    description: threatDescriptions[type],
    status: "active",
    location: Math.random() > 0.5 ? locations[Math.floor(Math.random() * locations.length)] : undefined,
  }
}

function generateRandomIP(): string {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
}
