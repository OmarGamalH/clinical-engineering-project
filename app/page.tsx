"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Activity, Shield, Database, Network, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserRole } from "@/lib/types"

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

export default function LoginPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [role, setRole] = useState<UserRole>("clinician")
  const [department, setDepartment] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Store user info in sessionStorage for the dashboard
    sessionStorage.setItem("user", JSON.stringify({ name, role, department }))
    
    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    router.push("/dashboard")
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
            Medical Device IT Integration Platform
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-balance">
            Understand Medical Device Integration with IT Systems
          </h2>
          <p className="text-muted-foreground">
            This simulation platform demonstrates how medical devices connect to hospital IT infrastructure,
            share data with Electronic Health Records, and maintain cybersecurity best practices.
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
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Simulation Environment - For Educational Purposes Only</p>
          <p>No real patient data or medical devices are connected.</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 lg:hidden mb-4">
              <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Activity className="size-5 text-primary" />
              </div>
              <span className="font-semibold">MedDevice Hub</span>
            </div>
            <CardTitle className="text-2xl">Access Dashboard</CardTitle>
            <CardDescription>
              Select your role to access the medical device integration simulator
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Dr. Sarah Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger id="role" className="bg-secondary/50">
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
                <Label htmlFor="department">Department</Label>
                <Select value={department} onValueChange={setDepartment} required>
                  <SelectTrigger id="department" className="bg-secondary/50">
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

              <Button type="submit" className="w-full" disabled={isLoading || !name || !department}>
                {isLoading ? (
                  "Accessing..."
                ) : (
                  <>
                    Access Dashboard
                    <ChevronRight className="size-4 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                This is a simulation environment. Select any role to explore different permission levels.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
