"use client"

import { Wind, Gauge, Activity, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { VentilatorDevice, VentilatorMode } from "@/lib/types"
import { useVentilatorSimulation } from "@/lib/hooks/use-device-simulation"

interface VentilatorProps {
  device: VentilatorDevice
}

const modeDescriptions: Record<VentilatorMode, string> = {
  AC: "Assist-Control",
  SIMV: "Synchronized Intermittent",
  CPAP: "Continuous Positive Airway",
  BiPAP: "Bilevel Positive Airway",
}

interface VentMetricProps {
  label: string
  value: number | string
  unit: string
  status?: "normal" | "warning" | "critical"
}

function VentMetric({ label, value, unit, status = "normal" }: VentMetricProps) {
  const statusColors = {
    normal: "text-foreground",
    warning: "text-status-warning",
    critical: "text-status-critical",
  }

  return (
    <div className="p-3 rounded-lg bg-secondary/30 border border-border">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className={cn("text-xl font-bold font-mono", statusColors[status])}>
          {value}
        </span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
    </div>
  )
}

export function Ventilator({ device }: VentilatorProps) {
  const { data: simulatedData, breathPhase } = useVentilatorSimulation(device.data)

  const getPIPStatus = (pip: number) => {
    if (pip > 35) return "critical"
    if (pip > 30) return "warning"
    return "normal"
  }

  const getFiO2Status = (fio2: number) => {
    if (fio2 > 80) return "warning"
    return "normal"
  }

  return (
    <Card className="bg-card/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Wind className="size-5 text-primary" />
            Ventilator - {device.name}
          </div>
          <Badge variant="outline" className="gap-2">
            <Settings className="size-3" />
            {simulatedData.mode}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode & Breath Phase */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
          <div>
            <p className="text-sm text-muted-foreground">Mode</p>
            <p className="font-semibold">
              {simulatedData.mode} - {modeDescriptions[simulatedData.mode]}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "size-4 rounded-full transition-all duration-300",
                breathPhase === "inspiration"
                  ? "bg-status-online scale-110"
                  : "bg-primary/30 scale-100"
              )}
            />
            <span className="text-sm font-mono uppercase">
              {breathPhase === "inspiration" ? "INSP" : "EXP"}
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
          <VentMetric
            label="Tidal Volume"
            value={simulatedData.tidalVolume}
            unit="mL"
          />
          <VentMetric
            label="Resp Rate"
            value={simulatedData.respiratoryRate}
            unit="br/min"
          />
          <VentMetric
            label="PEEP"
            value={simulatedData.peep}
            unit="cmH2O"
          />
          <VentMetric
            label="FiO2"
            value={simulatedData.fiO2}
            unit="%"
            status={getFiO2Status(simulatedData.fiO2)}
          />
          <VentMetric
            label="PIP"
            value={simulatedData.pip}
            unit="cmH2O"
            status={getPIPStatus(simulatedData.pip)}
          />
          <VentMetric
            label="Minute Vent"
            value={simulatedData.minuteVentilation}
            unit="L/min"
          />
        </div>

        {/* Waveform Visualization (simplified) */}
        <div className="p-4 rounded-lg bg-secondary/30 border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            Pressure Waveform
          </p>
          <div className="h-16 flex items-end gap-0.5">
            {Array.from({ length: 40 }).map((_, i) => {
              const phase = (i / 40) * Math.PI * 2
              const height =
                breathPhase === "inspiration"
                  ? Math.sin(phase) * 0.5 + 0.5
                  : Math.cos(phase) * 0.3 + 0.3
              return (
                <div
                  key={i}
                  className="flex-1 bg-primary/60 rounded-t transition-all duration-100"
                  style={{
                    height: `${Math.max(10, height * 100)}%`,
                    opacity: 0.3 + height * 0.7,
                  }}
                />
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
