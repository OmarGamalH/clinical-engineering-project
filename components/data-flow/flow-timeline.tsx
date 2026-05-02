"use client"

import { useEffect, useState, useRef } from "react"
import { Activity, ArrowRight, Lock, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { DataPacket, Protocol } from "@/lib/types"

interface FlowTimelineProps {
  isRunning: boolean
  protocol: Protocol
}

const deviceNames = ["Vital Monitor Alpha", "ECG Monitor 1", "Infusion Pump A1", "Ventilator Unit 1"]
const destinations = ["Epic EHR", "Cerner", "Integration Server", "Data Warehouse"]

function generatePacket(): DataPacket {
  const protocols: Protocol[] = ["HL7v2", "FHIR", "DICOM"]
  const statuses: DataPacket["status"][] = ["sent", "received", "pending"]
  
  // Occasionally generate an error
  const status = Math.random() > 0.9 ? "error" : statuses[Math.floor(Math.random() * statuses.length)]
  
  return {
    id: `pkt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    source: deviceNames[Math.floor(Math.random() * deviceNames.length)],
    destination: destinations[Math.floor(Math.random() * destinations.length)],
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    status,
    size: Math.floor(Math.random() * 500) + 100,
    payload: `{"resourceType":"Observation","value":${Math.floor(Math.random() * 100)}}`,
    encrypted: true,
  }
}

export function FlowTimeline({ isRunning, protocol }: FlowTimelineProps) {
  const [packets, setPackets] = useState<DataPacket[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      const newPacket = generatePacket()
      newPacket.protocol = protocol
      setPackets((prev) => [newPacket, ...prev].slice(0, 50))
    }, 500)

    return () => clearInterval(interval)
  }, [isRunning, protocol])

  const getStatusIcon = (status: DataPacket["status"]) => {
    switch (status) {
      case "received":
        return <CheckCircle className="size-4 text-status-online" />
      case "error":
        return <XCircle className="size-4 text-status-critical" />
      default:
        return <Activity className="size-4 text-primary animate-pulse" />
    }
  }

  const getStatusColor = (status: DataPacket["status"]) => {
    switch (status) {
      case "received":
        return "border-status-online/30 bg-status-online/5"
      case "error":
        return "border-status-critical/30 bg-status-critical/5"
      default:
        return "border-primary/30 bg-primary/5"
    }
  }

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <Activity className="size-5 text-primary" />
            Data Transmission Log
          </span>
          <Badge variant="outline" className="font-mono">
            {packets.length} packets
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]" ref={scrollRef}>
          <div className="space-y-2">
            {packets.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {isRunning ? "Waiting for data packets..." : "Start simulation to see data flow"}
              </div>
            ) : (
              packets.map((packet) => (
                <div
                  key={packet.id}
                  className={cn(
                    "p-3 rounded-lg border transition-all",
                    getStatusColor(packet.status)
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(packet.status)}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{packet.source}</span>
                          <ArrowRight className="size-3 text-muted-foreground" />
                          <span className="font-medium">{packet.destination}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {packet.protocol}
                          </Badge>
                          <span>{packet.size} bytes</span>
                          {packet.encrypted && (
                            <span className="flex items-center gap-1 text-status-online">
                              <Lock className="size-3" />
                              Encrypted
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                      {packet.timestamp.toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Payload Preview */}
                  <div className="mt-2 p-2 rounded bg-black/30 font-mono text-xs text-muted-foreground truncate">
                    {packet.payload}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
