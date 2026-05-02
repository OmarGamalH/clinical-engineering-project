"use client"

import { Activity, Power, Database, MapPin, Clock, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import type { Device, DeviceStatus, DeviceType } from "@/lib/types"

interface DeviceCardProps {
  device: Device
  onToggleStatus: (id: string) => void
  onToggleEHR: (id: string) => void
  onSelect?: (device: Device) => void
  isSelected?: boolean
}

const statusConfig: Record<DeviceStatus, { label: string; className: string }> = {
  online: {
    label: "Online",
    className: "bg-status-online/10 text-status-online border-status-online/30",
  },
  offline: {
    label: "Offline",
    className: "bg-muted text-muted-foreground border-border",
  },
  warning: {
    label: "Warning",
    className: "bg-status-warning/10 text-status-warning border-status-warning/30",
  },
  critical: {
    label: "Critical",
    className: "bg-status-critical/10 text-status-critical border-status-critical/30",
  },
}

const deviceTypeLabels: Record<DeviceType, string> = {
  "vital-signs": "Vital Signs Monitor",
  "infusion-pump": "Infusion Pump",
  ventilator: "Ventilator",
  ecg: "ECG Monitor",
}

function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

export function DeviceCard({
  device,
  onToggleStatus,
  onToggleEHR,
  onSelect,
  isSelected,
}: DeviceCardProps) {
  const status = statusConfig[device.status]
  const isOffline = device.status === "offline"

  return (
    <Card
      className={cn(
        "bg-card/50 transition-all cursor-pointer hover:border-primary/50",
        isSelected && "border-primary ring-1 ring-primary/20",
        device.status === "critical" && "border-status-critical/50"
      )}
      onClick={() => onSelect?.(device)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{device.name}</h3>
              {device.status === "critical" && (
                <AlertTriangle className="size-4 text-status-critical animate-pulse" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{deviceTypeLabels[device.type]}</p>
          </div>
          <Badge variant="outline" className={cn("border", status.className)}>
            <span
              className={cn(
                "size-2 rounded-full mr-2",
                device.status === "online" && "bg-status-online animate-pulse",
                device.status === "warning" && "bg-status-warning",
                device.status === "critical" && "bg-status-critical animate-pulse",
                device.status === "offline" && "bg-muted-foreground"
              )}
            />
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location & Last Sync */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4" />
            <span className="truncate">{device.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="size-4" />
            <span className="font-mono text-xs">{formatTimestamp(device.lastSync)}</span>
          </div>
        </div>

        {/* Device Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-2",
                isOffline
                  ? "text-muted-foreground"
                  : "text-status-online border-status-online/30 hover:bg-status-online/10"
              )}
              onClick={(e) => {
                e.stopPropagation()
                onToggleStatus(device.id)
              }}
            >
              <Power className="size-4" />
              {isOffline ? "Power On" : "Power Off"}
            </Button>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Database
              className={cn(
                "size-4",
                device.ehrConnected ? "text-status-online" : "text-muted-foreground"
              )}
            />
            <span className="text-xs text-muted-foreground">EHR</span>
            <Switch
              checked={device.ehrConnected}
              onCheckedChange={() => onToggleEHR(device.id)}
              disabled={isOffline}
            />
          </div>
        </div>

        {/* Patient Assignment */}
        {device.patientId && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 rounded-md px-3 py-2">
            <Activity className="size-4 text-primary" />
            <span>Assigned to Patient: {device.patientId}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
