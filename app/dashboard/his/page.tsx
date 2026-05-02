"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
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
  RefreshCw,
  Bed,
  CreditCard,
  UserPlus,
  Ambulance,
  HeartPulse,
  ShieldCheck,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  UserCheck,
  AlertCircle,
  Eye,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { doctors } from "@/lib/mock-data/doctors"
import { patients } from "@/lib/mock-data/patients"

interface HISModule {
  id: string
  name: string
  description: string
  status: "active" | "syncing" | "error" | "maintenance"
  lastSync: string
  recordCount: number
  icon: React.ReactNode
  category: "clinical" | "administrative" | "financial" | "support"
}

const hisModules: HISModule[] = [
  {
    id: "adm",
    name: "Admissions (ADT)",
    description: "Admit, Discharge, Transfer management",
    status: "active",
    lastSync: "2 minutes ago",
    recordCount: 1247,
    icon: <Users className="h-5 w-5" />,
    category: "clinical"
  },
  {
    id: "ehr",
    name: "Electronic Health Records",
    description: "Patient medical records and history",
    status: "active",
    lastSync: "1 minute ago",
    recordCount: 45832,
    icon: <FileText className="h-5 w-5" />,
    category: "clinical"
  },
  {
    id: "scheduling",
    name: "Scheduling System",
    description: "Appointments and resource scheduling",
    status: "syncing",
    lastSync: "Syncing...",
    recordCount: 3421,
    icon: <Calendar className="h-5 w-5" />,
    category: "administrative"
  },
  {
    id: "pharmacy",
    name: "Pharmacy Management",
    description: "Medication orders and inventory",
    status: "active",
    lastSync: "5 minutes ago",
    recordCount: 8934,
    icon: <Pill className="h-5 w-5" />,
    category: "clinical"
  },
  {
    id: "lab",
    name: "Laboratory System (LIS)",
    description: "Lab orders and results management",
    status: "active",
    lastSync: "3 minutes ago",
    recordCount: 12456,
    icon: <FlaskConical className="h-5 w-5" />,
    category: "clinical"
  },
  {
    id: "radiology",
    name: "Radiology (RIS/PACS)",
    description: "Imaging orders and storage",
    status: "maintenance",
    lastSync: "1 hour ago",
    recordCount: 7823,
    icon: <Stethoscope className="h-5 w-5" />,
    category: "clinical"
  },
  {
    id: "orders",
    name: "Order Entry (CPOE)",
    description: "Computerized physician order entry",
    status: "active",
    lastSync: "30 seconds ago",
    recordCount: 23451,
    icon: <ClipboardList className="h-5 w-5" />,
    category: "clinical"
  },
  {
    id: "billing",
    name: "Billing & Revenue",
    description: "Patient billing and claims processing",
    status: "active",
    lastSync: "10 minutes ago",
    recordCount: 56789,
    icon: <CreditCard className="h-5 w-5" />,
    category: "financial"
  },
  {
    id: "bedmgmt",
    name: "Bed Management",
    description: "Real-time bed occupancy and allocation",
    status: "active",
    lastSync: "1 minute ago",
    recordCount: 450,
    icon: <Bed className="h-5 w-5" />,
    category: "administrative"
  },
  {
    id: "emergency",
    name: "Emergency Department",
    description: "ED triage and patient flow",
    status: "active",
    lastSync: "30 seconds ago",
    recordCount: 234,
    icon: <Ambulance className="h-5 w-5" />,
    category: "clinical"
  },
  {
    id: "patientreg",
    name: "Patient Registration",
    description: "Demographics and insurance verification",
    status: "active",
    lastSync: "2 minutes ago",
    recordCount: 89234,
    icon: <UserPlus className="h-5 w-5" />,
    category: "administrative"
  },
  {
    id: "insurance",
    name: "Insurance Verification",
    description: "Coverage and eligibility checks",
    status: "active",
    lastSync: "5 minutes ago",
    recordCount: 34567,
    icon: <ShieldCheck className="h-5 w-5" />,
    category: "financial"
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
  },
  {
    source: "Billing System",
    destination: "Insurance Portal",
    protocol: "X12 EDI",
    messageType: "837P/837I",
    frequency: "Batch - Daily",
    status: "active"
  },
  {
    source: "Patient Portal",
    destination: "EHR System",
    protocol: "FHIR R4",
    messageType: "Patient, Appointment",
    frequency: "Real-time",
    status: "active"
  }
]

// Department Data
interface Department {
  id: string
  name: string
  beds: { total: number; occupied: number; available: number }
  staff: { doctors: number; nurses: number; total: number }
  patients: number
  status: "normal" | "busy" | "critical"
}

const departments: Department[] = [
  { id: "icu", name: "Intensive Care Unit", beds: { total: 30, occupied: 26, available: 4 }, staff: { doctors: 8, nurses: 24, total: 35 }, patients: 26, status: "busy" },
  { id: "ccu", name: "Cardiac Care Unit", beds: { total: 20, occupied: 15, available: 5 }, staff: { doctors: 5, nurses: 15, total: 22 }, patients: 15, status: "normal" },
  { id: "er", name: "Emergency Room", beds: { total: 40, occupied: 32, available: 8 }, staff: { doctors: 10, nurses: 30, total: 45 }, patients: 32, status: "busy" },
  { id: "or", name: "Operating Room", beds: { total: 12, occupied: 8, available: 4 }, staff: { doctors: 15, nurses: 20, total: 40 }, patients: 8, status: "normal" },
  { id: "medsurg", name: "Medical-Surgical", beds: { total: 80, occupied: 65, available: 15 }, staff: { doctors: 12, nurses: 40, total: 58 }, patients: 65, status: "normal" },
  { id: "pediatrics", name: "Pediatrics", beds: { total: 25, occupied: 18, available: 7 }, staff: { doctors: 6, nurses: 18, total: 26 }, patients: 18, status: "normal" },
  { id: "maternity", name: "Maternity Ward", beds: { total: 20, occupied: 12, available: 8 }, staff: { doctors: 4, nurses: 16, total: 22 }, patients: 12, status: "normal" },
  { id: "oncology", name: "Oncology", beds: { total: 30, occupied: 28, available: 2 }, staff: { doctors: 7, nurses: 21, total: 32 }, patients: 28, status: "critical" },
]

// Financial Summary
interface FinancialMetric {
  label: string
  value: string
  change: number
  trend: "up" | "down"
  icon: React.ReactNode
}

const financialMetrics: FinancialMetric[] = [
  { label: "Monthly Revenue", value: "$4.2M", change: 8.5, trend: "up", icon: <DollarSign className="size-5" /> },
  { label: "Outstanding Claims", value: "$890K", change: -12.3, trend: "down", icon: <CreditCard className="size-5" /> },
  { label: "Collection Rate", value: "94.2%", change: 2.1, trend: "up", icon: <TrendingUp className="size-5" /> },
  { label: "Avg. Days in A/R", value: "32 days", change: -5, trend: "down", icon: <Clock className="size-5" /> },
]

export default function HISPage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("all")

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

  const getDepartmentStatusColor = (status: Department["status"]) => {
    switch (status) {
      case "normal": return "bg-emerald-500/20 text-emerald-400"
      case "busy": return "bg-amber-500/20 text-amber-400"
      case "critical": return "bg-red-500/20 text-red-400"
    }
  }

  // Filter modules
  const filteredModules = useMemo(() => {
    return hisModules.filter((module) => {
      const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = activeCategory === "all" || module.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, activeCategory])

  // Calculate stats
  const hospitalStats = useMemo(() => {
    const totalBeds = departments.reduce((sum, d) => sum + d.beds.total, 0)
    const occupiedBeds = departments.reduce((sum, d) => sum + d.beds.occupied, 0)
    const totalStaff = departments.reduce((sum, d) => sum + d.staff.total, 0)
    const totalPatients = departments.reduce((sum, d) => sum + d.patients, 0)
    
    return {
      totalBeds,
      occupiedBeds,
      availableBeds: totalBeds - occupiedBeds,
      occupancyRate: Math.round((occupiedBeds / totalBeds) * 100),
      totalStaff,
      totalPatients,
      totalDoctors: doctors.length,
      activeModules: hisModules.filter(m => m.status === "active").length,
    }
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hospital Information System</h1>
          <p className="text-muted-foreground">
            Central management hub for all hospital operations and systems
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 gap-1">
            <Activity className="size-3" />
            System Online
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="size-4 mr-2" />
            Sync All
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bed className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">{hospitalStats.occupancyRate}%</p>
                  <Badge variant="outline" className="text-xs">
                    {hospitalStats.availableBeds} free
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Bed Occupancy</p>
                <Progress value={hospitalStats.occupancyRate} className="mt-2 h-1.5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Users className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{hospitalStats.totalPatients}</p>
                <p className="text-sm text-muted-foreground">Active Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <UserCheck className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{hospitalStats.totalStaff}</p>
                <p className="text-sm text-muted-foreground">Staff on Duty</p>
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
                <p className="text-2xl font-bold">{hospitalStats.activeModules}/{hisModules.length}</p>
                <p className="text-sm text-muted-foreground">Active Systems</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="bg-card border border-border flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="modules" className="gap-2">
            <Database className="h-4 w-4" />
            HIS Modules
          </TabsTrigger>
          <TabsTrigger value="departments" className="gap-2">
            <Building2 className="h-4 w-4" />
            Departments
          </TabsTrigger>
          <TabsTrigger value="patients" className="gap-2">
            <Users className="h-4 w-4" />
            Patient Census
          </TabsTrigger>
          <TabsTrigger value="financial" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="architecture" className="gap-2">
            <Server className="h-4 w-4" />
            Architecture
          </TabsTrigger>
        </TabsList>

        {/* HIS Modules */}
        <TabsContent value="modules" className="space-y-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search modules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-secondary/50"
                  />
                </div>
                <div className="flex gap-2">
                  {["all", "clinical", "administrative", "financial"].map((cat) => (
                    <Button
                      key={cat}
                      variant={activeCategory === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveCategory(cat)}
                      className="capitalize"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredModules.map((module) => (
              <Card 
                key={module.id} 
                className={`bg-card border-border cursor-pointer transition-all hover:border-primary/50 ${
                  selectedModule === module.id ? "border-primary ring-1 ring-primary/20" : ""
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
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">
                      Last sync: {module.lastSync}
                    </p>
                    <Badge variant="outline" className="text-xs capitalize">
                      {module.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {departments.map((dept) => (
              <Card 
                key={dept.id}
                className="bg-card border-border cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setSelectedDepartment(dept)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{dept.name}</CardTitle>
                    <Badge className={getDepartmentStatusColor(dept.status)}>
                      {dept.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bed Occupancy</span>
                      <span className="font-medium">{dept.beds.occupied}/{dept.beds.total}</span>
                    </div>
                    <Progress 
                      value={(dept.beds.occupied / dept.beds.total) * 100} 
                      className="h-1.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 rounded bg-secondary/50">
                      <p className="text-muted-foreground text-xs">Staff</p>
                      <p className="font-medium">{dept.staff.total}</p>
                    </div>
                    <div className="p-2 rounded bg-secondary/50">
                      <p className="text-muted-foreground text-xs">Patients</p>
                      <p className="font-medium">{dept.patients}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Department Summary */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Department Summary</CardTitle>
              <CardDescription>Real-time overview of all hospital departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium">Department</th>
                      <th className="text-center py-3 px-4 font-medium">Beds</th>
                      <th className="text-center py-3 px-4 font-medium">Occupancy</th>
                      <th className="text-center py-3 px-4 font-medium">Doctors</th>
                      <th className="text-center py-3 px-4 font-medium">Nurses</th>
                      <th className="text-center py-3 px-4 font-medium">Patients</th>
                      <th className="text-center py-3 px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept) => (
                      <tr key={dept.id} className="border-b border-border/50 hover:bg-secondary/30">
                        <td className="py-3 px-4 font-medium">{dept.name}</td>
                        <td className="text-center py-3 px-4">
                          {dept.beds.occupied}/{dept.beds.total}
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Progress 
                              value={(dept.beds.occupied / dept.beds.total) * 100} 
                              className="w-16 h-1.5"
                            />
                            <span className="text-xs">
                              {Math.round((dept.beds.occupied / dept.beds.total) * 100)}%
                            </span>
                          </div>
                        </td>
                        <td className="text-center py-3 px-4">{dept.staff.doctors}</td>
                        <td className="text-center py-3 px-4">{dept.staff.nurses}</td>
                        <td className="text-center py-3 px-4">{dept.patients}</td>
                        <td className="text-center py-3 px-4">
                          <Badge className={getDepartmentStatusColor(dept.status)}>
                            {dept.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patient Census Tab */}
        <TabsContent value="patients" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10">
                    <Users className="size-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{patients.length}</p>
                    <p className="text-sm text-muted-foreground">Total Registered</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Bed className="size-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{hospitalStats.totalPatients}</p>
                    <p className="text-sm text-muted-foreground">Currently Admitted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Ambulance className="size-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">32</p>
                    <p className="text-sm text-muted-foreground">ER Patients</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <HeartPulse className="size-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">26</p>
                    <p className="text-sm text-muted-foreground">Critical Care</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Patient Registry</CardTitle>
              <CardDescription>Active patients in the hospital system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium">MRN</th>
                      <th className="text-left py-3 px-4 font-medium">Patient Name</th>
                      <th className="text-left py-3 px-4 font-medium">Room</th>
                      <th className="text-left py-3 px-4 font-medium">Diagnosis</th>
                      <th className="text-center py-3 px-4 font-medium">Admission Date</th>
                      <th className="text-center py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient.id} className="border-b border-border/50 hover:bg-secondary/30">
                        <td className="py-3 px-4 font-mono text-xs">{patient.mrn}</td>
                        <td className="py-3 px-4 font-medium">
                          {patient.firstName} {patient.lastName}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{patient.roomNumber}</Badge>
                        </td>
                        <td className="py-3 px-4 max-w-[200px] truncate">{patient.diagnosis}</td>
                        <td className="text-center py-3 px-4 text-muted-foreground">
                          {new Date(patient.admissionDate).toLocaleDateString()}
                        </td>
                        <td className="text-center py-3 px-4">
                          <Button variant="ghost" size="sm">
                            <Eye className="size-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            {financialMetrics.map((metric, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {metric.icon}
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${
                      metric.trend === "up" ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {metric.trend === "up" ? (
                        <TrendingUp className="size-4" />
                      ) : (
                        <TrendingDown className="size-4" />
                      )}
                      {Math.abs(metric.change)}%
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="size-5" />
                  Revenue by Department
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Surgery", revenue: 1250000, percentage: 30 },
                  { name: "ICU", revenue: 890000, percentage: 21 },
                  { name: "Cardiology", revenue: 780000, percentage: 19 },
                  { name: "Emergency", revenue: 650000, percentage: 15 },
                  { name: "Other", revenue: 630000, percentage: 15 },
                ].map((dept) => (
                  <div key={dept.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{dept.name}</span>
                      <span className="font-medium">${(dept.revenue / 1000).toFixed(0)}K</span>
                    </div>
                    <Progress value={dept.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="size-5" />
                  Insurance Mix
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Private Insurance", percentage: 45, color: "bg-primary" },
                  { name: "Government", percentage: 30, color: "bg-cyan-500" },
                  { name: "Medicare", percentage: 15, color: "bg-emerald-500" },
                  { name: "Self-Pay", percentage: 10, color: "bg-amber-500" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className={`size-3 rounded-full ${item.color}`} />
                    <div className="flex-1 flex justify-between">
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm font-medium">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="size-5" />
                Claims Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-3xl font-bold text-emerald-400">1,245</p>
                  <p className="text-sm text-muted-foreground">Approved Claims</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-3xl font-bold text-amber-400">234</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-3xl font-bold text-cyan-400">89</p>
                  <p className="text-sm text-muted-foreground">Under Appeal</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-3xl font-bold text-red-400">56</p>
                  <p className="text-sm text-muted-foreground">Denied</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                    className="p-4 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors"
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
                      <Badge variant="outline" className="bg-primary/5">Lab Analyzers</Badge>
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
                    <div className="grid gap-3 md:grid-cols-4">
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
                      <div className="p-3 rounded bg-card text-center">
                        <p className="text-sm font-medium">API Gateway</p>
                        <p className="text-xs text-muted-foreground">REST/GraphQL</p>
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
                    <div className="grid gap-2 md:grid-cols-5">
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
                      <div className="p-3 rounded bg-card text-center">
                        <p className="text-sm font-medium">Billing</p>
                        <p className="text-xs text-muted-foreground">Revenue Cycle</p>
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
                    <div className="grid gap-3 md:grid-cols-4">
                      <div className="p-3 rounded bg-card text-center">
                        <p className="text-sm font-medium">Data Warehouse</p>
                        <p className="text-xs text-muted-foreground">Clinical Data</p>
                      </div>
                      <div className="p-3 rounded bg-card text-center">
                        <p className="text-sm font-medium">Analytics Engine</p>
                        <p className="text-xs text-muted-foreground">BI & Reporting</p>
                      </div>
                      <div className="p-3 rounded bg-card text-center">
                        <p className="text-sm font-medium">Audit Database</p>
                        <p className="text-xs text-muted-foreground">Compliance</p>
                      </div>
                      <div className="p-3 rounded bg-card text-center">
                        <p className="text-sm font-medium">ML Platform</p>
                        <p className="text-xs text-muted-foreground">Predictive</p>
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
                  <span className="text-sm">IHE Profiles</span>
                  <Badge variant="outline">Interoperability</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-background">
                  <span className="text-sm">X12 EDI</span>
                  <Badge variant="outline">Claims Processing</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Compliance & Security</CardTitle>
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
                  <span className="text-sm">SOC 2 Type II</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400">Certified</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-background">
                  <span className="text-sm">ISO 27001</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400">Certified</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-background">
                  <span className="text-sm">GDPR</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400">Compliant</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Department Detail Dialog */}
      <Dialog open={!!selectedDepartment} onOpenChange={() => setSelectedDepartment(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedDepartment?.name}</DialogTitle>
            <DialogDescription>Department Details and Statistics</DialogDescription>
          </DialogHeader>
          {selectedDepartment && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge className={getDepartmentStatusColor(selectedDepartment.status)}>
                  {selectedDepartment.status}
                </Badge>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Bed Management</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold">{selectedDepartment.beds.total}</p>
                    <p className="text-xs text-muted-foreground">Total Beds</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold text-amber-400">{selectedDepartment.beds.occupied}</p>
                    <p className="text-xs text-muted-foreground">Occupied</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold text-emerald-400">{selectedDepartment.beds.available}</p>
                    <p className="text-xs text-muted-foreground">Available</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Staff on Duty</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold">{selectedDepartment.staff.doctors}</p>
                    <p className="text-xs text-muted-foreground">Doctors</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold">{selectedDepartment.staff.nurses}</p>
                    <p className="text-xs text-muted-foreground">Nurses</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold">{selectedDepartment.staff.total}</p>
                    <p className="text-xs text-muted-foreground">Total Staff</p>
                  </div>
                </div>
              </div>
              <Button className="w-full" variant="outline">
                <Settings className="size-4 mr-2" />
                Manage Department
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
