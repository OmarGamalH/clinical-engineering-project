"use client"

import { useEffect, useState } from "react"
import { Shield, AlertTriangle, Globe, Clock, CheckCircle, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSecurity } from "@/lib/contexts/security-context"
import { generateRandomThreat, severityColors } from "@/lib/mock-data/threats"
import type { SecurityThreat, ThreatSeverity } from "@/lib/types"

const severityOrder: ThreatSeverity[] = ["critical", "high", "medium", "low"]

export function ThreatDashboard() {
  const { threats, addThreat, updateThreatStatus, clearMitigatedThreats } = useSecurity()
  const [isGenerating, setIsGenerating] = useState(true)

  // Generate random threats periodically
  useEffect(() => {
    if (!isGenerating) return

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        addThreat(generateRandomThreat())
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [isGenerating, addThreat])

  const sortedThreats = [...threats].sort((a, b) => {
    // Active threats first, then by severity
    if (a.status !== b.status) {
      if (a.status === "active") return -1
      if (b.status === "active") return 1
      if (a.status === "investigating") return -1
      if (b.status === "investigating") return 1
    }
    return severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
  })

  const activeThreats = threats.filter((t) => t.status === "active")
  const investigatingThreats = threats.filter((t) => t.status === "investigating")
  const mitigatedThreats = threats.filter((t) => t.status === "mitigated")

  const handleMitigate = (id: string) => {
    updateThreatStatus(id, "mitigated")
  }

  const handleInvestigate = (id: string) => {
    updateThreatStatus(id, "investigating")
  }

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            Threat Detection
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsGenerating((p) => !p)}
            >
              {isGenerating ? "Pause Detection" : "Resume Detection"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearMitigatedThreats}
              disabled={mitigatedThreats.length === 0}
            >
              Clear Mitigated
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Real-time security threat monitoring and response
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-status-critical/10 border border-status-critical/30 text-center">
            <p className="text-2xl font-bold font-mono text-status-critical">
              {activeThreats.length}
            </p>
            <p className="text-xs text-muted-foreground">Active Threats</p>
          </div>
          <div className="p-4 rounded-lg bg-status-warning/10 border border-status-warning/30 text-center">
            <p className="text-2xl font-bold font-mono text-status-warning">
              {investigatingThreats.length}
            </p>
            <p className="text-xs text-muted-foreground">Investigating</p>
          </div>
          <div className="p-4 rounded-lg bg-status-online/10 border border-status-online/30 text-center">
            <p className="text-2xl font-bold font-mono text-status-online">
              {mitigatedThreats.length}
            </p>
            <p className="text-xs text-muted-foreground">Mitigated</p>
          </div>
        </div>

        {/* Threat List */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {sortedThreats.map((threat) => (
              <ThreatCard
                key={threat.id}
                threat={threat}
                onMitigate={() => handleMitigate(threat.id)}
                onInvestigate={() => handleInvestigate(threat.id)}
              />
            ))}
            {sortedThreats.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Shield className="size-12 mx-auto mb-4 opacity-50" />
                <p>No threats detected</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

interface ThreatCardProps {
  threat: SecurityThreat
  onMitigate: () => void
  onInvestigate: () => void
}

function ThreatCard({ threat, onMitigate, onInvestigate }: ThreatCardProps) {
  const getSeverityIcon = (severity: ThreatSeverity) => {
    return (
      <AlertTriangle
        className={cn(
          "size-5",
          severity === "critical" && "text-status-critical animate-pulse",
          severity === "high" && "text-orange-500",
          severity === "medium" && "text-status-warning",
          severity === "low" && "text-blue-500"
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-all",
        threat.status === "active" && "bg-status-critical/5 border-status-critical/30",
        threat.status === "investigating" && "bg-status-warning/5 border-status-warning/30",
        threat.status === "mitigated" && "bg-muted/30 border-border opacity-70"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {getSeverityIcon(threat.severity)}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className={cn("text-xs", severityColors[threat.severity])}>
                {threat.severity.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {threat.type.replace("-", " ")}
              </Badge>
              {threat.status === "mitigated" && (
                <Badge className="bg-status-online text-xs">
                  <CheckCircle className="size-3 mr-1" />
                  Mitigated
                </Badge>
              )}
            </div>
            <p className="text-sm">{threat.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Source: {threat.source}</span>
              <span>Target: {threat.target}</span>
            </div>
            {threat.location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Globe className="size-3" />
                <span>
                  {threat.location.city}, {threat.location.country}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="size-3" />
            {threat.timestamp.toLocaleTimeString()}
          </span>
          {threat.status !== "mitigated" && (
            <div className="flex gap-2">
              {threat.status === "active" && (
                <Button size="sm" variant="outline" onClick={onInvestigate}>
                  <Search className="size-3 mr-1" />
                  Investigate
                </Button>
              )}
              <Button
                size="sm"
                variant={threat.status === "active" ? "default" : "outline"}
                onClick={onMitigate}
              >
                <CheckCircle className="size-3 mr-1" />
                Mitigate
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
