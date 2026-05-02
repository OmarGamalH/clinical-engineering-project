"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Monitor,
  Database,
  Network,
  Shield,
  Activity,
  AlertTriangle,
  TrendingUp,
  Zap,
  ArrowRight,
} from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDevices } from "@/lib/contexts/device-context"
import { useSecurity } from "@/lib/contexts/security-context"
import { useDashboard } from "./layout"

const quickAccessCards = [
  {
    title: "Device Monitoring",
    description: "Monitor vital signs, infusion pumps, ventilators, and ECG devices in real-time",
    icon: Monitor,
    href: "/dashboard/devices",
    color: "text-primary",
  },
  {
    title: "EHR Integration",
    description: "Configure connections to Epic, Cerner, and other EHR systems",
    icon: Database,
    href: "/dashboard/ehr",
    color: "text-chart-2",
  },
  {
    title: "Data Flow",
    description: "Visualize data transmission between devices and hospital networks",
    icon: Network,
    href: "/dashboard/data-flow",
    color: "text-chart-3",
  },
  {
    title: "Security Center",
    description: "Monitor threats, view audit logs, and manage access control",
    icon: Shield,
    href: "/dashboard/security",
    color: "text-chart-5",
  },
]

export default function DashboardPage() {
  const { mobileMenu } = useDashboard()
  const { devices } = useDevices()
  const { threats, auditLogs } = useSecurity()
  const [packetsPerSecond, setPacketsPerSecond] = useState(247)

  // Simulate changing data packets
  useEffect(() => {
    const interval = setInterval(() => {
      setPacketsPerSecond((prev) => Math.max(100, Math.min(500, prev + Math.floor(Math.random() * 40) - 20)))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const deviceStats = {
    total: devices.length,
    online: devices.filter((d) => d.status === "online").length,
    warning: devices.filter((d) => d.status === "warning").length,
    critical: devices.filter((d) => d.status === "critical").length,
    offline: devices.filter((d) => d.status === "offline").length,
  }

  const activeThreats = threats.filter((t) => t.status === "active" || t.status === "investigating").length
  const recentLogs = auditLogs.slice(0, 5)

  return (
    <div className="min-h-screen">
      <Header 
        title="Dashboard Overview" 
        description="Medical device integration status and monitoring"
        mobileMenu={mobileMenu}
      />

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Devices"
            value={deviceStats.total}
            subtitle={`${deviceStats.online} online`}
            icon={Monitor}
            variant="default"
          />
          <StatsCard
            title="Active Alerts"
            value={deviceStats.warning + deviceStats.critical}
            subtitle={`${deviceStats.critical} critical`}
            icon={AlertTriangle}
            variant={deviceStats.critical > 0 ? "critical" : deviceStats.warning > 0 ? "warning" : "success"}
          />
          <StatsCard
            title="Throughput"
            value={`${packetsPerSecond}`}
            subtitle="packets/sec"
            icon={TrendingUp}
            trend={{ value: 12, isPositive: true }}
            variant="success"
          />
          <StatsCard
            title="Threats"
            value={activeThreats}
            subtitle={`${threats.filter((t) => t.status === "mitigated").length} mitigated`}
            icon={Shield}
            variant={activeThreats > 2 ? "critical" : activeThreats > 0 ? "warning" : "success"}
          />
        </div>

        {/* Device Status Summary */}
        <Card className="bg-card/50">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Activity className="size-4 sm:size-5 text-primary" />
              Device Status Summary
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Real-time overview of all connected medical devices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-status-online/5 border border-status-online/20">
                <div className="size-2 sm:size-3 rounded-full bg-status-online animate-pulse" />
                <div>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-status-online">{deviceStats.online}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-status-warning/5 border border-status-warning/20">
                <div className="size-2 sm:size-3 rounded-full bg-status-warning" />
                <div>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-status-warning">{deviceStats.warning}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Warning</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-status-critical/5 border border-status-critical/20">
                <div className="size-2 sm:size-3 rounded-full bg-status-critical animate-pulse" />
                <div>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-status-critical">{deviceStats.critical}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Critical</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/50 border border-border">
                <div className="size-2 sm:size-3 rounded-full bg-muted-foreground" />
                <div>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-muted-foreground">{deviceStats.offline}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Offline</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Quick Access Cards */}
          <Card className="bg-card/50">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Zap className="size-4 sm:size-5 text-primary" />
                Quick Access
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Navigate to key system modules</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 sm:gap-3">
              {quickAccessCards.map((card) => (
                <Link key={card.href} href={card.href}>
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors group">
                    <div className="size-8 sm:size-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <card.icon className={`size-4 sm:size-5 ${card.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base">{card.title}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-none">{card.description}</p>
                    </div>
                    <ArrowRight className="size-4 sm:size-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-card/50">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <span className="flex items-center gap-2">
                  <Shield className="size-4 sm:size-5 text-primary" />
                  Recent Activity
                </span>
                <Link href="/dashboard/security">
                  <Button variant="ghost" size="sm" className="h-7 sm:h-8 text-xs sm:text-sm">
                    View All
                    <ArrowRight className="size-3 sm:size-4 ml-1" />
                  </Button>
                </Link>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Latest audit log entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-secondary/30 border border-border"
                  >
                    <div
                      className={`size-2 rounded-full mt-1.5 sm:mt-2 shrink-0 ${
                        log.success ? "bg-status-online" : "bg-status-critical"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                        <p className="text-xs sm:text-sm font-medium truncate">{log.userName}</p>
                        <Badge variant="outline" className="text-[10px] sm:text-xs shrink-0">
                          {log.userRole}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {log.action}: {log.resource}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                        {log.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
