"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDashboard } from "../layout"
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Stethoscope,
  Pill,
  Activity,
  Heart,
  Syringe,
} from "lucide-react"

const mockRecords = [
  {
    id: "rec-1",
    type: "Lab Results",
    title: "Blood Test Results",
    date: "2024-01-15",
    doctor: "Dr. Sarah Johnson",
    department: "Pathology",
    icon: Activity,
  },
  {
    id: "rec-2",
    type: "Prescription",
    title: "Medication Prescription",
    date: "2024-01-10",
    doctor: "Dr. Michael Chen",
    department: "General Medicine",
    icon: Pill,
  },
  {
    id: "rec-3",
    type: "Imaging",
    title: "Chest X-Ray Report",
    date: "2024-01-05",
    doctor: "Dr. Emily Davis",
    department: "Radiology",
    icon: Heart,
  },
  {
    id: "rec-4",
    type: "Vaccination",
    title: "COVID-19 Vaccination",
    date: "2023-12-20",
    doctor: "Dr. James Wilson",
    department: "Preventive Care",
    icon: Syringe,
  },
]

export default function PatientRecordsPage() {
  const { user } = useDashboard()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Medical Records</h1>
        <p className="text-muted-foreground">
          Access and download your medical records
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockRecords.length}</p>
                <p className="text-sm text-muted-foreground">Total Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Activity className="size-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Lab Results</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Pill className="size-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Prescriptions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Heart className="size-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Imaging</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Records List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Recent Medical Records</CardTitle>
          <CardDescription>Your medical documents and reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockRecords.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <record.icon className="size-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{record.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {record.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Stethoscope className="size-3" />
                      {record.doctor}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(record.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="size-4" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="size-4" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
