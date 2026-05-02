"use client"

import { useState } from "react"
import { ArrowRight, Check, X, Settings2, Code } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FieldMapping } from "@/lib/types"

const initialMappings: FieldMapping[] = [
  {
    id: "map-001",
    deviceField: "heartRate",
    ehrField: "Observation.valueQuantity (LOINC: 8867-4)",
    transformation: "Direct mapping",
    enabled: true,
  },
  {
    id: "map-002",
    deviceField: "systolicBP",
    ehrField: "Observation.component[0].valueQuantity (LOINC: 8480-6)",
    transformation: "Direct mapping",
    enabled: true,
  },
  {
    id: "map-003",
    deviceField: "diastolicBP",
    ehrField: "Observation.component[1].valueQuantity (LOINC: 8462-4)",
    transformation: "Direct mapping",
    enabled: true,
  },
  {
    id: "map-004",
    deviceField: "spO2",
    ehrField: "Observation.valueQuantity (LOINC: 59408-5)",
    transformation: "Direct mapping",
    enabled: true,
  },
  {
    id: "map-005",
    deviceField: "temperature",
    ehrField: "Observation.valueQuantity (LOINC: 8310-5)",
    transformation: "Celsius to Fahrenheit option",
    enabled: true,
  },
  {
    id: "map-006",
    deviceField: "respiratoryRate",
    ehrField: "Observation.valueQuantity (LOINC: 9279-1)",
    transformation: "Direct mapping",
    enabled: false,
  },
]

const sampleFHIR = `{
  "resourceType": "Observation",
  "id": "heart-rate-001",
  "status": "final",
  "category": [{
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/observation-category",
      "code": "vital-signs"
    }]
  }],
  "code": {
    "coding": [{
      "system": "http://loinc.org",
      "code": "8867-4",
      "display": "Heart rate"
    }]
  },
  "subject": {
    "reference": "Patient/pt-001"
  },
  "effectiveDateTime": "2024-01-15T10:30:00Z",
  "valueQuantity": {
    "value": 72,
    "unit": "beats/minute",
    "system": "http://unitsofmeasure.org",
    "code": "/min"
  }
}`

export function DataMapping() {
  const [mappings, setMappings] = useState<FieldMapping[]>(initialMappings)

  const toggleMapping = (id: string) => {
    setMappings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    )
  }

  const enabledCount = mappings.filter((m) => m.enabled).length

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="size-5 text-primary" />
          Data Field Mapping
        </CardTitle>
        <CardDescription>
          Configure how device data maps to EHR fields using FHIR standards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="mappings">
          <TabsList className="mb-4">
            <TabsTrigger value="mappings">Field Mappings</TabsTrigger>
            <TabsTrigger value="preview">FHIR Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="mappings" className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>{enabledCount} of {mappings.length} mappings enabled</span>
              <Button variant="outline" size="sm">
                Add Custom Mapping
              </Button>
            </div>

            <div className="space-y-3">
              {mappings.map((mapping) => (
                <div
                  key={mapping.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    mapping.enabled
                      ? "bg-secondary/30 border-border"
                      : "bg-muted/20 border-border/50 opacity-60"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={mapping.enabled}
                      onCheckedChange={() => toggleMapping(mapping.id)}
                    />

                    <div className="flex-1 grid gap-2 sm:grid-cols-[1fr,auto,1fr]">
                      {/* Device Field */}
                      <div className="p-2 rounded bg-primary/10 border border-primary/20">
                        <p className="text-xs text-muted-foreground mb-1">Device Field</p>
                        <p className="font-mono text-sm">{mapping.deviceField}</p>
                      </div>

                      {/* Arrow */}
                      <div className="hidden sm:flex items-center justify-center">
                        <ArrowRight className="size-5 text-muted-foreground" />
                      </div>

                      {/* EHR Field */}
                      <div className="p-2 rounded bg-status-online/10 border border-status-online/20">
                        <p className="text-xs text-muted-foreground mb-1">EHR Field (FHIR)</p>
                        <p className="font-mono text-xs break-all">{mapping.ehrField}</p>
                      </div>
                    </div>

                    {mapping.enabled ? (
                      <Check className="size-5 text-status-online" />
                    ) : (
                      <X className="size-5 text-muted-foreground" />
                    )}
                  </div>

                  {mapping.transformation && mapping.enabled && (
                    <div className="mt-2 ml-12 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {mapping.transformation}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Code className="size-4" />
                <span>Sample FHIR R4 Observation Resource</span>
              </div>
              <pre className="p-4 rounded-lg bg-black/50 border border-border overflow-x-auto">
                <code className="text-sm font-mono text-status-online">{sampleFHIR}</code>
              </pre>
              <p className="text-xs text-muted-foreground">
                This is a sample FHIR Observation resource that would be generated from vital signs data.
                The actual resource will include real-time values from the connected device.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
