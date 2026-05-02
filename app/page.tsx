"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Activity, Shield, Database, Network, ChevronRight, Stethoscope, User, Building2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { UserRole } from "@/lib/types"
import { doctors, specializations } from "@/lib/mock-data/doctors"

const features = [
  {
    icon: Activity,
    title: "Device Monitoring",
    description: "Real-time monitoring of vital signs, infusion pumps, ventilators, and ECG devices",
  },
  {
    icon: Database,
    title: "EHR Integration",
    description: "Connect medical devices to Epic, Cerner, and Meditech systems via HL7/FHIR",
  },
  {
    icon: Network,
    title: "Data Flow Simulation",
    description: "Visualize data transmission between devices and hospital IT networks",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Threat detection, audit logging, encryption, and access control demonstration",
  },
]

const patientFeatures = [
  {
    icon: Stethoscope,
    title: "Find Doctors",
    description: "Browse specialists across all departments",
  },
  {
    icon: Activity,
    title: "Book Appointments",
    description: "Schedule visits with available time slots",
  },
  {
    icon: User,
    title: "Manage Bookings",
    description: "View and manage your appointments",
  },
]

const doctorFeatures = [
  {
    icon: Users,
    title: "Patient Management",
    description: "View and manage your patient appointments",
  },
  {
    icon: Activity,
    title: "Schedule Overview",
    description: "See your daily and weekly schedule",
  },
  {
    icon: Building2,
    title: "Hospital Systems",
    description: "Access HIS modules and patient records",
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"staff" | "doctor" | "patient">("staff")
  
  // Staff form state
  const [staffName, setStaffName] = useState("")
  const [staffRole, setStaffRole] = useState<UserRole>("clinician")
  const [staffDepartment, setStaffDepartment] = useState("")
  
  // Doctor form state
  const [selectedDoctor, setSelectedDoctor] = useState("")
  
  // Patient form state
  const [patientName, setPatientName] = useState("")
  const [patientPhone, setPatientPhone] = useState("")
  
  const [isLoading, setIsLoading] = useState(false)

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    sessionStorage.setItem("user", JSON.stringify({ 
      name: staffName, 
      role: staffRole, 
      department: staffDepartment 
    }))
    
    await new Promise((resolve) => setTimeout(resolve, 500))
    router.push("/dashboard")
  }

  const handleDoctorLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const doctor = doctors.find(d => d.id === selectedDoctor)
    if (!doctor) return
    
    sessionStorage.setItem("user", JSON.stringify({ 
      name: doctor.name, 
      role: "doctor" as UserRole, 
      department: doctor.department,
      specialization: doctor.specialization
    }))
    
    await new Promise((resolve) => setTimeout(resolve, 500))
    router.push("/doctor")
  }

  const handlePatientLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    sessionStorage.setItem("user", JSON.stringify({ 
      name: patientName, 
      role: "patient" as UserRole, 
      department: "Patient",
      phone: patientPhone
    }))
    
    await new Promise((resolve) => setTimeout(resolve, 500))
    router.push("/patient")
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-card p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Activity className="size-6 text-primary" />
            </div>
            <span className="text-xl font-semibold">MedDevice Hub</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Hospital Information System & Patient Portal
          </p>
        </div>

        <div className="space-y-6">
          {activeTab === "staff" && (
            <>
              <h2 className="text-2xl font-semibold text-balance">
                Healthcare IT Integration Platform
              </h2>
              <p className="text-muted-foreground">
                Access the full hospital information system including device monitoring, 
                EHR integration, and security management.
              </p>
              <div className="grid gap-4">
                {features.map((feature) => (
                  <div key={feature.title} className="flex gap-4 items-start">
                    <div className="size-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <feature.icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "doctor" && (
            <>
              <h2 className="text-2xl font-semibold text-balance">
                Doctor Portal
              </h2>
              <p className="text-muted-foreground">
                Manage your appointments, view patient bookings, and access 
                hospital systems from your dedicated dashboard.
              </p>
              <div className="grid gap-4">
                {doctorFeatures.map((feature) => (
                  <div key={feature.title} className="flex gap-4 items-start">
                    <div className="size-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <feature.icon className="size-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "patient" && (
            <>
              <h2 className="text-2xl font-semibold text-balance">
                Patient Portal
              </h2>
              <p className="text-muted-foreground">
                Book appointments with doctors, manage your healthcare visits, 
                and access your medical information.
              </p>
              <div className="grid gap-4">
                {patientFeatures.map((feature) => (
                  <div key={feature.title} className="flex gap-4 items-start">
                    <div className="size-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <feature.icon className="size-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Simulation Environment - For Educational Purposes Only</p>
          <p>No real patient data or medical devices are connected.</p>
        </div>
      </div>

      {/* Right Panel - Login Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 lg:hidden mb-4">
              <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Activity className="size-5 text-primary" />
              </div>
              <span className="font-semibold">MedDevice Hub</span>
            </div>
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>
              Select your role to access the appropriate portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="space-y-4">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="patient" className="gap-1.5">
                  <User className="size-4" />
                  <span className="hidden sm:inline">Patient</span>
                </TabsTrigger>
                <TabsTrigger value="doctor" className="gap-1.5">
                  <Stethoscope className="size-4" />
                  <span className="hidden sm:inline">Doctor</span>
                </TabsTrigger>
                <TabsTrigger value="staff" className="gap-1.5">
                  <Building2 className="size-4" />
                  <span className="hidden sm:inline">Staff</span>
                </TabsTrigger>
              </TabsList>

              {/* Patient Login */}
              <TabsContent value="patient">
                <form onSubmit={handlePatientLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-name">Full Name</Label>
                    <Input
                      id="patient-name"
                      placeholder="Enter your full name"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      required
                      className="bg-secondary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-phone">Phone Number</Label>
                    <Input
                      id="patient-phone"
                      placeholder="+20-XXX-XXX-XXXX"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      required
                      className="bg-secondary/50"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading || !patientName || !patientPhone}>
                    {isLoading ? (
                      "Accessing..."
                    ) : (
                      <>
                        Access Patient Portal
                        <ChevronRight className="size-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Browse doctors, book appointments, and manage your healthcare.
                  </p>
                </form>
              </TabsContent>

              {/* Doctor Login */}
              <TabsContent value="doctor">
                <form onSubmit={handleDoctorLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-select">Select Your Profile</Label>
                    <Select value={selectedDoctor} onValueChange={setSelectedDoctor} required>
                      <SelectTrigger id="doctor-select" className="bg-secondary/50">
                        <SelectValue placeholder="Choose your profile" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            <div className="flex flex-col items-start">
                              <span>{doctor.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {doctor.specialization} - {doctor.department}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedDoctor && (
                    <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                      {(() => {
                        const doctor = doctors.find(d => d.id === selectedDoctor)
                        if (!doctor) return null
                        return (
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {doctor.name.split(" ").slice(1).map(n => n[0]).join("")}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{doctor.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {doctor.specialization} | {doctor.yearsOfExperience} years exp.
                              </p>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading || !selectedDoctor}>
                    {isLoading ? (
                      "Accessing..."
                    ) : (
                      <>
                        Access Doctor Portal
                        <ChevronRight className="size-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    View patient bookings, manage appointments, and access hospital systems.
                  </p>
                </form>
              </TabsContent>

              {/* Staff Login */}
              <TabsContent value="staff">
                <form onSubmit={handleStaffLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="staff-name">Name</Label>
                    <Input
                      id="staff-name"
                      placeholder="Dr. Sarah Chen"
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      required
                      className="bg-secondary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="staff-role">Role</Label>
                    <Select value={staffRole} onValueChange={(value) => setStaffRole(value as UserRole)}>
                      <SelectTrigger id="staff-role" className="bg-secondary/50">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">
                          <div className="flex flex-col items-start">
                            <span>Administrator</span>
                            <span className="text-xs text-muted-foreground">Full system access and configuration</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="clinician">
                          <div className="flex flex-col items-start">
                            <span>Clinician</span>
                            <span className="text-xs text-muted-foreground">View devices and patient data</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="technician">
                          <div className="flex flex-col items-start">
                            <span>Biomedical Technician</span>
                            <span className="text-xs text-muted-foreground">Device configuration and maintenance</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="staff-department">Department</Label>
                    <Select value={staffDepartment} onValueChange={setStaffDepartment} required>
                      <SelectTrigger id="staff-department" className="bg-secondary/50">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ICU">Intensive Care Unit</SelectItem>
                        <SelectItem value="CCU">Cardiac Care Unit</SelectItem>
                        <SelectItem value="ER">Emergency Room</SelectItem>
                        <SelectItem value="OR">Operating Room</SelectItem>
                        <SelectItem value="Med-Surg">Medical-Surgical</SelectItem>
                        <SelectItem value="IT">Health IT Department</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading || !staffName || !staffDepartment}>
                    {isLoading ? (
                      "Accessing..."
                    ) : (
                      <>
                        Access HIS Dashboard
                        <ChevronRight className="size-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Access the full hospital information system and device integration platform.
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
