"use client"

import { useState, useEffect } from "react"
import { Heart, Thermometer, Wind, Droplets, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import type { VitalSignsDevice } from "@/lib/types"
import { useVitalSignsSimulation } from "@/lib/hooks/use-device-simulation"

interface VitalSignsMonitorProps {
  device: VitalSignsDevice
}

interface VitalMetricProps {
  label: string
  value: number | string
  unit: string
  icon: React.ElementType
  status?: "normal" | "warning" | "critical"
  trend?: number[]
}

function VitalMetric({ label, value, unit, icon: Icon, status = "normal", trend }: VitalMetricProps) {
  const statusColors = {
    normal: "text-status-online",
    warning: "text-status-warning",
    critical: "text-status-critical",
  }

  return (
    <div className="p-4 rounded-lg bg-secondary/30 border border-border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={cn("size-4", statusColors[status])} />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
        </div>
        {status !== "normal" && (
          <span
            className={cn(
              "size-2 rounded-full animate-pulse",
              status === "warning" ? "bg-status-warning" : "bg-status-critical"
            )}
          />
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn("text-2xl font-bold font-mono", statusColors[status])}>
          {value}
        </span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      {trend && trend.length > 0 && (
        <div className="h-8 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend.map((v, i) => ({ value: v, index: i }))}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={
                  status === "normal"
                    ? "oklch(0.72 0.19 145)"
                    : status === "warning"
                    ? "oklch(0.75 0.18 75)"
                    : "oklch(0.55 0.22 25)"
                }
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export function VitalSignsMonitor({ device }: VitalSignsMonitorProps) {
  const simulatedData = useVitalSignsSimulation(device.data)
  const [heartRateTrend, setHeartRateTrend] = useState<number[]>([])
  const [spO2Trend, setSpO2Trend] = useState<number[]>([])

  useEffect(() => {
    setHeartRateTrend((prev) => [...prev.slice(-19), simulatedData.heartRate])
    setSpO2Trend((prev) => [...prev.slice(-19), simulatedData.spO2])
  }, [simulatedData.heartRate, simulatedData.spO2])

  const getHeartRateStatus = (hr: number) => {
    if (hr < 50 || hr > 120) return "critical"
    if (hr < 60 || hr > 100) return "warning"
    return "normal"
  }

  const getBPStatus = (sys: number, dia: number) => {
    if (sys > 180 || sys < 90 || dia > 120 || dia < 60) return "critical"
    if (sys > 140 || sys < 100 || dia > 90 || dia < 65) return "warning"
    return "normal"
  }

  const getSpO2Status = (spo2: number) => {
    if (spo2 < 90) return "critical"
    if (spo2 < 95) return "warning"
    return "normal"
  }

  const getTempStatus = (temp: number) => {
    if (temp > 39 || temp < 35) return "critical"
    if (temp > 38 || temp < 36) return "warning"
    return "normal"
  }

  return (
    <Card className="bg-card/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="size-5 text-primary" />
          Vital Signs - {device.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <VitalMetric
            label="Heart Rate"
            value={simulatedData.heartRate}
            unit="bpm"
            icon={Heart}
            status={getHeartRateStatus(simulatedData.heartRate)}
            trend={heartRateTrend}
          />
          <VitalMetric
            label="Blood Pressure"
            value={`${simulatedData.systolicBP}/${simulatedData.diastolicBP}`}
            unit="mmHg"
            icon={Activity}
            status={getBPStatus(simulatedData.systolicBP, simulatedData.diastolicBP)}
          />
          <VitalMetric
            label="SpO2"
            value={simulatedData.spO2}
            unit="%"
            icon={Droplets}
            status={getSpO2Status(simulatedData.spO2)}
            trend={spO2Trend}
          />
          <VitalMetric
            label="Temperature"
            value={simulatedData.temperature.toFixed(1)}
            unit="C"
            icon={Thermometer}
            status={getTempStatus(simulatedData.temperature)}
          />
          <VitalMetric
            label="Respiratory Rate"
            value={simulatedData.respiratoryRate}
            unit="br/min"
            icon={Wind}
            status={
              simulatedData.respiratoryRate > 25 || simulatedData.respiratoryRate < 10
                ? "warning"
                : "normal"
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}
