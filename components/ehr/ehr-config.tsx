"use client"

import { useState } from "react"
import { Database, CheckCircle, XCircle, Loader2, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { EHRSystem, EHRConnection } from "@/lib/types"

interface EHRConfigProps {
  connection: EHRConnection | null
  onConnect: (connection: EHRConnection) => void
  onDisconnect: () => void
}

const ehrSystems: { value: EHRSystem; label: string; description: string }[] = [
  { value: "Epic", label: "Epic Systems", description: "Epic EHR with FHIR R4 support" },
  { value: "Cerner", label: "Oracle Cerner", description: "Cerner Millennium with HL7v2" },
  { value: "Meditech", label: "Meditech Expanse", description: "Meditech with FHIR support" },
  { value: "AllScripts", label: "AllScripts", description: "AllScripts EHR platform" },
]

const defaultEndpoints: Record<EHRSystem, string> = {
  Epic: "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4",
  Cerner: "https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d",
  Meditech: "https://fhir.meditech.com/api/FHIR/R4",
  AllScripts: "https://open.allscripts.com/fhir/r4",
}

export function EHRConfig({ connection, onConnect, onDisconnect }: EHRConfigProps) {
  const [selectedSystem, setSelectedSystem] = useState<EHRSystem>(connection?.system || "Epic")
  const [endpoint, setEndpoint] = useState(connection?.endpoint || defaultEndpoints.Epic)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null)

  const handleSystemChange = (system: EHRSystem) => {
    setSelectedSystem(system)
    setEndpoint(defaultEndpoints[system])
    setTestResult(null)
  }

  const handleTestConnection = async () => {
    setIsTesting(true)
    setTestResult(null)

    // Simulate connection test
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Random success/failure for demonstration
    const success = Math.random() > 0.3
    setTestResult(success ? "success" : "error")
    setIsTesting(false)

    if (success) {
      onConnect({
        id: `ehr-${Date.now()}`,
        system: selectedSystem,
        endpoint,
        status: "connected",
        lastSync: new Date(),
        patientsMatched: Math.floor(Math.random() * 50) + 10,
        errorCount: 0,
      })
    }
  }

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="size-5 text-primary" />
          EHR Connection Configuration
        </CardTitle>
        <CardDescription>
          Configure the connection to your Electronic Health Records system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* EHR System Selection */}
        <div className="space-y-2">
          <Label>EHR System</Label>
          <Select value={selectedSystem} onValueChange={(v) => handleSystemChange(v as EHRSystem)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ehrSystems.map((system) => (
                <SelectItem key={system.value} value={system.value}>
                  <div className="flex flex-col items-start">
                    <span>{system.label}</span>
                    <span className="text-xs text-muted-foreground">{system.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* FHIR Endpoint */}
        <div className="space-y-2">
          <Label htmlFor="endpoint">FHIR Endpoint URL</Label>
          <Input
            id="endpoint"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="https://fhir.example.com/api/FHIR/R4"
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            The base URL for the FHIR API endpoint
          </p>
        </div>

        {/* Protocol Info */}
        <div className="p-4 rounded-lg bg-secondary/30 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="size-4 text-primary" />
            <span className="text-sm font-medium">Protocol Settings</span>
          </div>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Protocol</span>
              <Badge variant="outline">FHIR R4</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Authentication</span>
              <Badge variant="outline">OAuth 2.0</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Encryption</span>
              <Badge variant="outline" className="text-status-online border-status-online/30">
                TLS 1.3
              </Badge>
            </div>
          </div>
        </div>

        {/* Test Result */}
        {testResult && (
          <div
            className={cn(
              "p-4 rounded-lg border flex items-center gap-3",
              testResult === "success"
                ? "bg-status-online/10 border-status-online/30"
                : "bg-status-critical/10 border-status-critical/30"
            )}
          >
            {testResult === "success" ? (
              <>
                <CheckCircle className="size-5 text-status-online" />
                <div>
                  <p className="font-medium text-status-online">Connection Successful</p>
                  <p className="text-sm text-muted-foreground">
                    Successfully connected to {selectedSystem} EHR system
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="size-5 text-status-critical" />
                <div>
                  <p className="font-medium text-status-critical">Connection Failed</p>
                  <p className="text-sm text-muted-foreground">
                    Unable to connect. Please check the endpoint URL and credentials.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleTestConnection}
            disabled={isTesting || !endpoint}
            className="flex-1"
          >
            {isTesting ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Testing Connection...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>
          {connection && (
            <Button variant="outline" onClick={onDisconnect}>
              Disconnect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
