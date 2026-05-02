"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building2, 
  Server, 
  Database,
  Activity,
  Users,
  FileText,
  Calendar,
  Pill,
  FlaskConical,
  Stethoscope,
  ClipboardList,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw
} from "lucide-react"

interface HISModule {
  id: string
  name: string
  description: string
  status: "active" | "syncing" | "error" | "maintenance"
  lastSync: string
  recordCount: number
  icon: React.ReactNode
}

const hisModules: HISModule[] = [
  {
    id: "adm",
    name: "Admissions (ADT)",
    description: "Admit, Discharge, Transfer management",
    status: "active",
    lastSync: "2 minutes ago",
    recordCount: 1247,
    icon: <Users className="h-5 w-5" />
  },
  {
    id: "ehr",
    name: "Electronic Health Records",
    description: "Patient medical records and history",
    status: "active",
    lastSync: "1 minute ago",
    recordCount: 45832,
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: "scheduling",
    name: "Scheduling System",
    description: "Appointments and resource scheduling",
    status: "syncing",
    lastSync: "Syncing...",
    recordCount: 3421,
    icon: <Calendar className="h-5 w-5" />
  },
  {
    id: "pharmacy",
    name: "Pharmacy Management",
    description: "Medication orders and inventory",
    status: "active",
    lastSync: "5 minutes ago",
    recordCount: 8934,
    icon: <Pill className="h-5 w-5" />
  },
  {
    id: "lab",
    name: "Laboratory System (LIS)",
    description: "Lab orders and results management",
    status: "active",
    lastSync: "3 minutes ago",
    recordCount: 12456,
    icon: <FlaskConical className="h-5 w-5" />
  },
  {
    id: "radiology",
    name: "Radiology (RIS/PACS)",
    description: "Imaging orders and storage",
    status: "maintenance",
    lastSync: "1 hour ago",
    recordCount: 7823,
    icon: <Stethoscope className="h-5 w-5" />
  },
  {
    id: "orders",
    name: "Order Entry (CPOE)",
    description: "Computerized physician order entry",
    status: "active",
    lastSync: "30 seconds ago",
    recordCount: 23451,
    icon: <ClipboardList className="h-5 w-5" />
  }
]

interface IntegrationPoint {
  source: string
  destination: string
  protocol: string
  messageType: string
  frequency: string
  status: "active" | "paused" | "error"
}

const integrationPoints: IntegrationPoint[] = [
  {
    source: "ADT System",
    destination: "Device Gateway",
    protocol: "HL7 v2.5",
    messageType: "ADT^A01, ADT^A03",
    frequency: "Real-time",
    status: "active"
  },
  {
    source: "Vital Signs Monitors",
    destination: "EHR System",
    protocol: "FHIR R4",
    messageType: "Observation",
    frequency: "Every 5 minutes",
    status: "active"
  },
  {
    source: "Infusion Pumps",
    destination: "Pharmacy System",
    protocol: "HL7 v2.5",
    messageType: "RAS^O17",
    frequency: "On change",
    status: "active"
  },
  {
    source: "Lab System",
    destination: "EHR System",
    protocol: "FHIR R4",
    messageType: "DiagnosticReport",
    frequency: "On completion",
    status: "active"
  },
  {
    source: "ECG Monitors",
    destination: "PACS",
    protocol: "DICOM",
    messageType: "Waveform",
    frequency: "On capture",
    status: "paused"
  }
]

export default function HISPage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)

  const getStatusColor = (status: HISModule["status"]) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400"
      case "syncing": return "bg-cyan-500/20 text-cyan-400"
      case "error": return "bg-red-500/20 text-red-400"
      case "maintenance": return "bg-amber-500/20 text-amber-400"
    }
  }

  const getStatusIcon = (status: HISModule["status"]) => {
    switch (status) {
      case "active": return <CheckCircle2 className="h-4 w-4" />
      case "syncing": return <RefreshCw className="h-4 w-4 animate-spin" />
      case "error": return <AlertTriangle className="h-4 w-4" />
      case "maintenance": return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Hospital Information System</h1>
        <p className="text-muted-foreground">
          Central integration hub for hospital IT systems and medical devices
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">7</p>
                <p className="text-sm text-muted-foreground">Active Modules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <ArrowRightLeft className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Integration Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Activity className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">24.5K</p>
                <p className="text-sm text-muted-foreground">Messages/Hour</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Server className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">99.9%</p>
                <p className="text-sm text-muted-foreground">System Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="modules" className="gap-2">
            <Database className="h-4 w-4" />
            HIS Modules
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            Integration Points
          </TabsTrigger>
          <TabsTrigger value="architecture" className="gap-2">
            <Server className="h-4 w-4" />
            System Architecture
          </TabsTrigger>
        </TabsList>

        {/* HIS Modules */}
        <TabsContent value="modules" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hisModules.map((module) => (
              <Card 
                key={module.id} 
                className={`bg-card border-border cursor-pointer transition-all hover:border-primary/50 ${
                  selectedModule === module.id ? "border-primary" : ""
                }`}
                onClick={() => setSelectedModule(module.id === selectedModule ? null : module.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {module.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base">{module.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {module.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge className={`${getStatusColor(module.status)} gap-1`}>
                      {getStatusIcon(module.status)}
                      {module.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {module.recordCount.toLocaleString()} records
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Last sync: {module.lastSync}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Integration Points */}
        <TabsContent value="integrations" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Active Integration Points</CardTitle>
              <CardDescription>
                Data flow connections between systems and medical devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrationPoints.map((point, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg bg-background border border-border"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{point.source}</Badge>
                        <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline">{point.destination}</Badge>
                      </div>
                      <Badge className={
                        point.status === "active" 
                          ? "bg-emerald-500/20 text-emerald-400"
                          : point.status === "paused"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-red-500/20 text-red-400"
                      }>
                        {point.status}
                      </Badge>
                    </div>
                    <div className="grid gap-2 md:grid-cols-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Protocol: </span>
                        <span className="text-foreground">{point.protocol}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Message Type: </span>
                        <span className="text-foreground font-mono text-xs">{point.messageType}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Frequency: </span>
                        <span className="text-foreground">{point.frequency}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Architecture */}
        <TabsContent value="architecture" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Healthcare IT Architecture</CardTitle>
              <CardDescription>
                Layered architecture of the hospital information system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Layer 1: Medical Devices */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-primary">Layer 1: Medical Devices</h3>
                  <div className="p-4 rounded-lg bg-background border border-primary/30">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-primary/5">Vital Signs Monitors</Badge>
                      <Badge variant="outline" className="bg-primary/5">Infusion Pumps</Badge>
                      <Badge variant="outline" className="bg-primary/5">Ventilators</Badge>
                      <Badge variant="outline" className="bg-primary/5">ECG/EKG</Badge>
                      <Badge variant="outline" className="bg-primary/5">Imaging Equipment</Badge>
                    </div>
                  </div>
                </div>

                {/* Connection indicator */}
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-0.5 h-4 bg-border" />
                    <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">
                      Device Gateway (IEEE 11073)
                    </Badge>
                    <div className="w-0.5 h-4 bg-border" />
                  </div>
                </div>

                {/* Layer 2: Integration Engine */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-cyan-400">Layer 2: Integration Engine</h3>
                  <div className="p-4 rounded-lg bg-background border border-cyan-500/30">
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="p-3 rounded bg-card text-center">
                        <p className="text-sm font-medium">HL7 Interface</p>
                        <p className="text-xs text-muted-foreground">v2.x / FHIR R4</p>
                      </div>
                      <div className="p-3 rounded bg-card text-center">
                        <p className="text-sm font-medium">Message Router</p>
                        <p className="text-xs text-muted-foreground">Mirth Connect</p>
                      </div>
                      <div className="p-3 rounded bg-card text-center">
                        <p className="text-sm font-medium">Data Transformer</p>
                        <p className="text-xs text-muted-foreground">ETL Pipeline</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connection indicator */}
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-0.5 h-4 bg-border" />
                    <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                      Secure API Gateway (TLS 1.3)
                    </Badge>
                    <div className="w-0.5 h-4 bg-border" />
                  </div>
                </div>

                {/* Layer 3: HIS Core */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-emerald-400">Layer 3: HIS Core Systems</h3>
                  <div className="p-4 rounded-lg bg-background border border-emerald-500/30">
                    <div className="grid gap-2 md:grid-cols-4">
                      <div className="p-3 rounded bg-card text-center">
                        <p className="text-sm font-medium">EHR</p>
                        <p className="text-xs text-muted-foreground">Epic/Cerner</p>
                      </div>
                      <div className="p-3 rounded bg-card text-center">
                        <p className="text-sm font-medium">LIS</p>
                        <p className="text-xs text-muted-foreground">Lab System</p>
                      </div>
                      <div className="p-3 rounded bg-card text-center">
                        <p className="text-sm font-medium">RIS/PACS</p>
                        <p className="text-xs text-muted-foreground">Imaging</p>
                      </div>
                      <div className="p-3 rounded bg-card text-center">
                        <p className="text-sm font-medium">Pharmacy</p>
                        <p className="text-xs text-muted-foreground">Medication</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connection indicator */}
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-0.5 h-4 bg-border" />
                    <Badge className="bg-amber-500/20 text-amber-400 text-xs">
                      Enterprise Service Bus
                    </Badge>
                    <div className="w-0.5 h-4 bg-border" />
                  </div>
                </div>

                {/* Layer 4: Data Layer */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-amber-400">Layer 4: Data & Analytics</h3>
                  <div className="p-4 rounded-lg bg-background border border-amber-500/30">
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="p-3 rounded bg-card text-center">
                        <p className="text-sm font-medium">Clinical Data Warehouse</p>
                        <p className="text-xs text-muted-foreground">Aggregated patient data</p>
                      </div>
                      <div className="p-3 rounded bg-card text-center">
                        <p className="text-sm font-medium">Analytics Engine</p>
                        <p className="text-xs text-muted-foreground">BI & Reporting</p>
                      </div>
                      <div className="p-3 rounded bg-card text-center">
                        <p className="text-sm font-medium">Audit Database</p>
                        <p className="text-xs text-muted-foreground">Compliance & Security</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Standards Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Healthcare Standards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-background">
                  <span className="text-sm">HL7 v2.x</span>
                  <Badge variant="outline">Legacy Messaging</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-background">
                  <span className="text-sm">FHIR R4</span>
                  <Badge variant="outline">REST API</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-background">
                  <span className="text-sm">DICOM</span>
                  <Badge variant="outline">Medical Imaging</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-background">
                  <span className="text-sm">IEEE 11073</span>
                  <Badge variant="outline">Device Communication</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Compliance Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-background">
                  <span className="text-sm">HIPAA</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400">Compliant</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-background">
                  <span className="text-sm">HITECH</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400">Compliant</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-background">
                  <span className="text-sm">FDA 21 CFR Part 11</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400">Compliant</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-background">
                  <span className="text-sm">IEC 62443</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400">Certified</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
