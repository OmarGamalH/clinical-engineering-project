"use client"

import { useState } from "react"
import { Database, Link2, RefreshCw, AlertCircle } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { EHRConfig } from "@/components/ehr/ehr-config"
import { PatientRecord } from "@/components/ehr/patient-record"
import { DataMapping } from "@/components/ehr/data-mapping"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDashboard } from "../layout"
import type { EHRConnection, Patient } from "@/lib/types"

export default function EHRPage() {
  const { mobileMenu } = useDashboard()
  const [connection, setConnection] = useState<EHRConnection | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const handleConnect = (newConnection: EHRConnection) => {
    setConnection(newConnection)
  }

  const handleDisconnect = () => {
    setConnection(null)
    setSelectedPatient(null)
  }

  return (
    <div className="min-h-screen">
      <Header
        title="EHR Integration"
        description="Configure and manage Electronic Health Records system connections"
        mobileMenu={mobileMenu}
      />

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Connection Status Banner */}
        {connection && (
          <Card className="bg-status-online/5 border-status-online/30">
            <CardContent className="py-3 sm:py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="size-8 sm:size-10 rounded-lg bg-status-online/20 flex items-center justify-center shrink-0">
                    <Link2 className="size-4 sm:size-5 text-status-online" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm sm:text-base">Connected to {connection.system}</p>
                      <Badge
                        variant="outline"
                        className="text-status-online border-status-online/30 text-xs"
                      >
                        Active
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {connection.patientsMatched} patients | Last sync: {connection.lastSync.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                  <RefreshCw className="size-4" />
                  Sync Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Not Connected Warning */}
        {!connection && (
          <Card className="bg-status-warning/5 border-status-warning/30">
            <CardContent className="py-3 sm:py-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <AlertCircle className="size-5 text-status-warning shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <p className="font-medium text-status-warning text-sm sm:text-base">No EHR Connection</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Configure a connection below to enable patient matching and data synchronization
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">
            <EHRConfig
              connection={connection}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />

            {connection && (
              <Card className="bg-card/50">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Database className="size-4 sm:size-5 text-primary" />
                    Integration Status
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Active data exchange status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-secondary/30 border border-border">
                      <span className="text-xs sm:text-sm">Vital Signs Sync</span>
                      <Badge className="bg-status-online text-background text-xs">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-secondary/30 border border-border">
                      <span className="text-xs sm:text-sm">Medication Orders</span>
                      <Badge className="bg-status-online text-background text-xs">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-secondary/30 border border-border">
                      <span className="text-xs sm:text-sm">Lab Results</span>
                      <Badge variant="outline" className="text-xs">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-secondary/30 border border-border">
                      <span className="text-xs sm:text-sm">Alerts &amp; Notifications</span>
                      <Badge className="bg-status-online text-background text-xs">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            <PatientRecord
              onSelectPatient={setSelectedPatient}
              selectedPatient={selectedPatient}
            />
          </div>
        </div>

        {/* Data Mapping - Full Width */}
        {connection && <DataMapping />}
      </div>
    </div>
  )
}
