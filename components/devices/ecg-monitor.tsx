"use client"

import { Heart, Activity, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts"
import type { ECGDevice, ECGLead } from "@/lib/types"
import { useECGWaveform } from "@/lib/hooks/use-device-simulation"
import { useState } from "react"

interface ECGMonitorProps {
  device: ECGDevice
}

const leads: ECGLead[] = ["I", "II", "III", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"]

export function ECGMonitor({ device }: ECGMonitorProps) {
  const [selectedLead, setSelectedLead] = useState<ECGLead>(device.data.selectedLead)
  const waveformData = useECGWaveform(device.data.heartRate)

  const chartData = waveformData.map((value, index) => ({
    index,
    value,
  }))

  return (
    <Card
      className={cn(
        "bg-card/50",
        device.data.arrhythmiaDetected && "border-status-critical"
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Activity className="size-5 text-primary" />
            ECG Monitor - {device.name}
          </div>
          {device.data.arrhythmiaDetected && (
            <Badge variant="destructive" className="gap-1 animate-pulse">
              <AlertTriangle className="size-3" />
              {device.data.arrhythmiaType || "Arrhythmia"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Heart Rate & Rhythm */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "size-12 rounded-lg flex items-center justify-center",
                device.data.arrhythmiaDetected
                  ? "bg-status-critical/10"
                  : "bg-status-online/10"
              )}
            >
              <Heart
                className={cn(
                  "size-6 animate-pulse",
                  device.data.arrhythmiaDetected
                    ? "text-status-critical"
                    : "text-status-online"
                )}
              />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span
                  className={cn(
                    "text-4xl font-bold font-mono",
                    device.data.arrhythmiaDetected
                      ? "text-status-critical"
                      : "text-status-online"
                  )}
                >
                  {device.data.heartRate}
                </span>
                <span className="text-sm text-muted-foreground">bpm</span>
              </div>
              <p className="text-sm text-muted-foreground">{device.data.rhythm}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Lead</p>
            <Select
              value={selectedLead}
              onValueChange={(value) => setSelectedLead(value as ECGLead)}
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {leads.map((lead) => (
                  <SelectItem key={lead} value={lead}>
                    {lead}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ECG Waveform */}
        <div className="p-4 rounded-lg bg-black/50 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-status-online font-mono">
              Lead {selectedLead}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              25mm/s | 10mm/mV
            </span>
          </div>
          <div className="h-32 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-px bg-status-online"
                  style={{ top: `${(i + 1) * 20}%` }}
                />
              ))}
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute h-full w-px bg-status-online"
                  style={{ left: `${(i + 1) * 5}%` }}
                />
              ))}
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <YAxis domain={[-1.5, 1.5]} hide />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={
                    device.data.arrhythmiaDetected
                      ? "oklch(0.55 0.22 25)"
                      : "oklch(0.72 0.19 145)"
                  }
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Quick Select */}
        <div className="flex flex-wrap gap-2">
          {leads.slice(0, 6).map((lead) => (
            <button
              key={lead}
              onClick={() => setSelectedLead(lead)}
              className={cn(
                "px-3 py-1 text-xs font-mono rounded border transition-colors",
                selectedLead === lead
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/50 border-border hover:border-primary/50"
              )}
            >
              {lead}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
