"use client"

import { useEffect, useState } from "react"
import { Monitor, Server, Database, Cloud, Wifi } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface NetworkNode {
  id: string
  label: string
  icon: React.ElementType
  status: "active" | "inactive" | "error"
  position: { x: number; y: number }
}

interface DataPacket {
  id: string
  fromIndex: number
  toIndex: number
  progress: number
}

interface NetworkDiagramProps {
  isRunning: boolean
}

const nodes: NetworkNode[] = [
  { id: "devices", label: "Medical Devices", icon: Monitor, status: "active", position: { x: 10, y: 50 } },
  { id: "gateway", label: "Device Gateway", icon: Wifi, status: "active", position: { x: 33, y: 50 } },
  { id: "server", label: "Integration Server", icon: Server, status: "active", position: { x: 56, y: 50 } },
  { id: "ehr", label: "EHR System", icon: Database, status: "active", position: { x: 79, y: 50 } },
]

export function NetworkDiagram({ isRunning }: NetworkDiagramProps) {
  const [packets, setPackets] = useState<DataPacket[]>([])

  useEffect(() => {
    if (!isRunning) {
      setPackets([])
      return
    }

    // Generate new packets
    const generateInterval = setInterval(() => {
      const newPacket: DataPacket = {
        id: `pkt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        fromIndex: 0,
        toIndex: 1,
        progress: 0,
      }
      setPackets((prev) => [...prev.slice(-10), newPacket])
    }, 800)

    // Update packet positions
    const updateInterval = setInterval(() => {
      setPackets((prev) =>
        prev
          .map((p) => {
            let newProgress = p.progress + 3
            let newFromIndex = p.fromIndex
            let newToIndex = p.toIndex

            if (newProgress >= 100) {
              if (p.toIndex < nodes.length - 1) {
                newProgress = 0
                newFromIndex = p.toIndex
                newToIndex = p.toIndex + 1
              } else {
                return null // Remove completed packets
              }
            }

            return {
              ...p,
              progress: newProgress,
              fromIndex: newFromIndex,
              toIndex: newToIndex,
            }
          })
          .filter(Boolean) as DataPacket[]
      )
    }, 50)

    return () => {
      clearInterval(generateInterval)
      clearInterval(updateInterval)
    }
  }, [isRunning])

  const getPacketPosition = (packet: DataPacket) => {
    const from = nodes[packet.fromIndex].position
    const to = nodes[packet.toIndex].position
    const x = from.x + (to.x - from.x) * (packet.progress / 100)
    const y = from.y
    return { x, y }
  }

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <Cloud className="size-5 text-primary" />
            Network Topology
          </span>
          <Badge
            variant="outline"
            className={cn(
              isRunning
                ? "text-status-online border-status-online/30"
                : "text-muted-foreground"
            )}
          >
            {isRunning ? "Data Flowing" : "Paused"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-48 bg-black/30 rounded-lg border border-border overflow-hidden">
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full">
            {nodes.slice(0, -1).map((node, i) => {
              const next = nodes[i + 1]
              return (
                <line
                  key={`line-${node.id}`}
                  x1={`${node.position.x + 5}%`}
                  y1={`${node.position.y}%`}
                  x2={`${next.position.x - 5}%`}
                  y2={`${next.position.y}%`}
                  stroke="oklch(0.65 0.18 195 / 0.3)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              )
            })}
          </svg>

          {/* Data Packets */}
          {packets.map((packet) => {
            const pos = getPacketPosition(packet)
            return (
              <div
                key={packet.id}
                className="absolute size-3 rounded-full bg-primary shadow-lg shadow-primary/50 transition-all duration-50"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )
          })}

          {/* Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${node.position.x}%`,
                top: `${node.position.y}%`,
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "size-12 rounded-lg flex items-center justify-center border-2 transition-all",
                    node.status === "active"
                      ? "bg-primary/20 border-primary text-primary"
                      : node.status === "error"
                      ? "bg-status-critical/20 border-status-critical text-status-critical"
                      : "bg-muted border-border text-muted-foreground"
                  )}
                >
                  <node.icon className="size-6" />
                </div>
                <span className="text-xs text-center font-medium whitespace-nowrap">
                  {node.label}
                </span>
                {node.status === "active" && (
                  <div className="size-2 rounded-full bg-status-online animate-pulse" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-status-online" />
            <span>Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-primary" />
            <span>Data Packet</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 border-t-2 border-dashed border-primary/30" />
            <span>Connection</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
