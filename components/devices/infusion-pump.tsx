"use client"

import { Pill, Droplets, Clock, AlertTriangle, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { InfusionPumpDevice } from "@/lib/types"
import { useInfusionPumpSimulation } from "@/lib/hooks/use-device-simulation"

interface InfusionPumpProps {
  device: InfusionPumpDevice
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

export function InfusionPump({ device }: InfusionPumpProps) {
  const simulatedData = useInfusionPumpSimulation(device.data)
  const totalVolume = simulatedData.volumeInfused + simulatedData.volumeRemaining
  const percentComplete = (simulatedData.volumeInfused / totalVolume) * 100

  return (
    <Card className={cn("bg-card/50", simulatedData.occlusionAlert && "border-status-critical")}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Droplets className="size-5 text-primary" />
            Infusion Pump - {device.name}
          </div>
          {simulatedData.occlusionAlert && (
            <Badge variant="destructive" className="gap-1 animate-pulse">
              <AlertTriangle className="size-3" />
              Occlusion Alert
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Drug Info */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 border border-border">
          <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Pill className="size-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold">{simulatedData.drugName}</p>
            <p className="text-sm text-muted-foreground">{simulatedData.concentration}</p>
          </div>
        </div>

        {/* Flow Rate & Volume */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 rounded-lg bg-secondary/30 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="size-4 text-primary" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Flow Rate
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold font-mono text-primary">
                {simulatedData.flowRate}
              </span>
              <span className="text-sm text-muted-foreground">mL/hr</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-secondary/30 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="size-4 text-status-warning" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Time Remaining
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className={cn(
                  "text-3xl font-bold font-mono",
                  simulatedData.timeRemaining < 30 ? "text-status-warning" : "text-foreground"
                )}
              >
                {formatTime(simulatedData.timeRemaining)}
              </span>
            </div>
          </div>
        </div>

        {/* Volume Progress */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Volume Progress</span>
            <span className="font-mono">
              {simulatedData.volumeInfused.toFixed(1)} / {totalVolume.toFixed(0)} mL
            </span>
          </div>
          <Progress value={percentComplete} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Infused: {simulatedData.volumeInfused.toFixed(1)} mL</span>
            <span>Remaining: {simulatedData.volumeRemaining.toFixed(1)} mL</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
