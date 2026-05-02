"use client"

import { useState } from "react"
import { User, Search, Calendar, MapPin, Activity, Stethoscope } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { patients, searchPatients } from "@/lib/mock-data/patients"
import { useDevices } from "@/lib/contexts/device-context"
import type { Patient } from "@/lib/types"

interface PatientRecordProps {
  onSelectPatient: (patient: Patient) => void
  selectedPatient: Patient | null
}

export function PatientRecord({ onSelectPatient, selectedPatient }: PatientRecordProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { devices } = useDevices()

  const filteredPatients = searchQuery ? searchPatients(searchQuery) : patients

  const getPatientDevices = (patientId: string) => {
    return devices.filter((d) => d.patientId === patientId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="size-5 text-primary" />
          Patient Records
        </CardTitle>
        <CardDescription>
          Search and link patients to medical devices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or MRN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Patient List */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {filteredPatients.map((patient) => {
              const patientDevices = getPatientDevices(patient.id)
              const isSelected = selectedPatient?.id === patient.id

              return (
                <div
                  key={patient.id}
                  onClick={() => onSelectPatient(patient)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-primary/10 border-primary"
                      : "bg-secondary/30 border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">
                        {patient.lastName}, {patient.firstName}
                      </p>
                      <p className="text-sm text-muted-foreground font-mono">{patient.mrn}</p>
                    </div>
                    <Badge variant="outline">
                      {patient.gender === "male" ? "M" : patient.gender === "female" ? "F" : "O"},{" "}
                      {calculateAge(patient.dateOfBirth)}y
                    </Badge>
                  </div>

                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="size-3" />
                      <span>{patient.roomNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="size-3" />
                      <span>Admitted: {formatDate(patient.admissionDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Stethoscope className="size-3" />
                      <span className="truncate">{patient.diagnosis}</span>
                    </div>
                  </div>

                  {patientDevices.length > 0 && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                      <Activity className="size-4 text-primary" />
                      <span className="text-xs text-muted-foreground">
                        {patientDevices.length} device(s) connected
                      </span>
                      <div className="flex gap-1 ml-auto">
                        {patientDevices.slice(0, 3).map((device) => (
                          <div
                            key={device.id}
                            className={`size-2 rounded-full ${
                              device.status === "online"
                                ? "bg-status-online"
                                : device.status === "warning"
                                ? "bg-status-warning"
                                : device.status === "critical"
                                ? "bg-status-critical"
                                : "bg-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {filteredPatients.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No patients found matching your search
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
