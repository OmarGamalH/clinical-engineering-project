"use client"

import { useState } from "react"
import { Network, Play, Pause, Settings, Gauge, Lock, FileCode } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { NetworkDiagram } from "@/components/data-flow/network-diagram"
import { FlowTimeline } from "@/components/data-flow/flow-timeline"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDashboard } from "../layout"
import type { Protocol } from "@/lib/types"

const protocolInfo: Record<Protocol, { name: string; description: string; format: string }> = {
  HL7v2: {
    name: "HL7 Version 2",
    description: "Traditional pipe-delimited message format widely used in healthcare",
    format: "MSH|^~\\&|SENDING_APP|FACILITY|...",
  },
  FHIR: {
    name: "FHIR R4",
    description: "Modern RESTful API standard using JSON/XML resources",
    format: '{"resourceType": "Observation", ...}',
  },
  DICOM: {
    name: "DICOM",
    description: "Standard for medical imaging data and communication",
    format: "Binary image data with metadata tags",
  },
}

export default function DataFlowPage() {
  const { mobileMenu } = useDashboard()
  const [isRunning, setIsRunning] = useState(true)
  const [protocol, setProtocol] = useState<Protocol>("FHIR")
  const [transmissionRate, setTransmissionRate] = useState([50])

  const toggleSimulation = () => {
    setIsRunning((prev) => !prev)
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Data Flow Simulation"
        description="Visualize data transmission between medical devices and hospital IT networks"
        mobileMenu={mobileMenu}
      />

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Control Panel */}
        <Card className="bg-card/50">
          <CardContent className="py-3 sm:py-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Row 1 - Play/Pause and Protocol */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <Button
                  onClick={toggleSimulation}
                  variant={isRunning ? "outline" : "default"}
                  className="gap-2 min-w-24 sm:min-w-32"
                  size="sm"
                >
                  {isRunning ? (
                    <>
                      <Pause className="size-4" />
                      <span className="hidden sm:inline">Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="size-4" />
                      <span className="hidden sm:inline">Start</span>
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">Protocol:</span>
                  <Select value={protocol} onValueChange={(v) => setProtocol(v as Protocol)}>
                    <SelectTrigger className="w-24 sm:w-32 h-8 sm:h-9 text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HL7v2">HL7v2</SelectItem>
                      <SelectItem value="FHIR">FHIR R4</SelectItem>
                      <SelectItem value="DICOM">DICOM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Badge
                  variant="outline"
                  className="gap-1 sm:gap-2 text-status-online border-status-online/30 text-xs ml-auto"
                >
                  <Lock className="size-3" />
                  <span className="hidden sm:inline">TLS 1.3</span>
                </Badge>
              </div>

              {/* Row 2 - Rate Slider */}
              <div className="flex items-center gap-2 sm:gap-4">
                <Gauge className="size-4 text-muted-foreground shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground">Rate:</span>
                <Slider
                  value={transmissionRate}
                  onValueChange={setTransmissionRate}
                  max={100}
                  min={10}
                  step={10}
                  className="flex-1 max-w-48"
                />
                <span className="text-xs sm:text-sm font-mono w-10 sm:w-12">{transmissionRate[0]}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Visualization */}
        <NetworkDiagram isRunning={isRunning} />

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Data Flow Timeline */}
          <FlowTimeline isRunning={isRunning} protocol={protocol} />

          {/* Protocol Information */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="bg-card/50">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <FileCode className="size-4 sm:size-5 text-primary" />
                  Protocol Information
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Details about the selected communication protocol
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="info">
                  <TabsList className="mb-3 sm:mb-4 w-full sm:w-auto">
                    <TabsTrigger value="info" className="flex-1 sm:flex-none text-xs sm:text-sm">Overview</TabsTrigger>
                    <TabsTrigger value="sample" className="flex-1 sm:flex-none text-xs sm:text-sm">Sample</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-3 sm:space-y-4">
                    <div className="p-3 sm:p-4 rounded-lg bg-secondary/30 border border-border">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge className="bg-primary text-xs">{protocol}</Badge>
                        <span className="font-semibold text-sm sm:text-base">{protocolInfo[protocol].name}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {protocolInfo[protocol].description}
                      </p>
                    </div>

                    <div className="grid gap-2 sm:gap-3">
                      <div className="flex justify-between p-2 sm:p-3 rounded-lg bg-secondary/30 border border-border">
                        <span className="text-xs sm:text-sm text-muted-foreground">Encryption</span>
                        <Badge variant="outline" className="text-status-online border-status-online/30 text-xs">
                          TLS 1.3
                        </Badge>
                      </div>
                      <div className="flex justify-between p-2 sm:p-3 rounded-lg bg-secondary/30 border border-border">
                        <span className="text-xs sm:text-sm text-muted-foreground">Authentication</span>
                        <Badge variant="outline" className="text-xs">OAuth 2.0</Badge>
                      </div>
                      <div className="flex justify-between p-2 sm:p-3 rounded-lg bg-secondary/30 border border-border">
                        <span className="text-xs sm:text-sm text-muted-foreground">Compression</span>
                        <Badge variant="outline" className="text-xs">GZIP</Badge>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="sample">
                    <div className="p-3 sm:p-4 rounded-lg bg-black/50 border border-border">
                      <p className="text-xs text-muted-foreground mb-2">Format Example:</p>
                      <pre className="font-mono text-xs sm:text-sm text-status-online overflow-x-auto">
                        {protocolInfo[protocol].format}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Simulation Controls */}
            <Card className="bg-card/50">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Settings className="size-4 sm:size-5 text-primary" />
                  Fault Injection
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Simulate network issues for testing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2 h-9 sm:h-10 text-xs sm:text-sm">
                  Inject Packet Loss (5%)
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 h-9 sm:h-10 text-xs sm:text-sm">
                  Simulate Network Latency (+500ms)
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-9 sm:h-10 text-xs sm:text-sm text-status-critical border-status-critical/30 hover:bg-status-critical/10"
                >
                  Simulate Connection Failure
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
