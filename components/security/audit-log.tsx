"use client"

import { useState } from "react"
import { FileText, Filter, Download, CheckCircle, XCircle, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSecurity } from "@/lib/contexts/security-context"
import type { AuditLogEntry, UserRole } from "@/lib/types"

type FilterRole = UserRole | "all"
type FilterAction = "all" | "VIEW" | "MODIFY" | "CREATE" | "DELETE" | "CONFIGURE" | "ACCESS" | "EXPORT"

export function AuditLog() {
  const { auditLogs } = useSecurity()
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<FilterRole>("all")
  const [actionFilter, setActionFilter] = useState<FilterAction>("all")

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "all" || log.userRole === roleFilter
    const matchesAction = actionFilter === "all" || log.action === actionFilter

    return matchesSearch && matchesRole && matchesAction
  })

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const roleColors: Record<UserRole, string> = {
    admin: "bg-chart-5/20 text-chart-5 border-chart-5/30",
    clinician: "bg-primary/20 text-primary border-primary/30",
    technician: "bg-status-warning/20 text-status-warning border-status-warning/30",
  }

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            Audit Log
          </span>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="size-4" />
            Export
          </Button>
        </CardTitle>
        <CardDescription>
          Comprehensive activity log for compliance and security monitoring
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as FilterRole)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="clinician">Clinician</SelectItem>
              <SelectItem value="technician">Technician</SelectItem>
            </SelectContent>
          </Select>
          <Select value={actionFilter} onValueChange={(v) => setActionFilter(v as FilterAction)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="VIEW">View</SelectItem>
              <SelectItem value="MODIFY">Modify</SelectItem>
              <SelectItem value="CREATE">Create</SelectItem>
              <SelectItem value="DELETE">Delete</SelectItem>
              <SelectItem value="CONFIGURE">Configure</SelectItem>
              <SelectItem value="ACCESS">Access</SelectItem>
              <SelectItem value="EXPORT">Export</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Log Entries */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className={cn(
                  "p-3 rounded-lg border transition-all",
                  log.success
                    ? "bg-secondary/30 border-border"
                    : "bg-status-critical/5 border-status-critical/30"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {log.success ? (
                      <CheckCircle className="size-4 text-status-online mt-0.5" />
                    ) : (
                      <XCircle className="size-4 text-status-critical mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{log.userName}</span>
                        <Badge
                          variant="outline"
                          className={cn("text-xs", roleColors[log.userRole])}
                        >
                          {log.userRole}
                        </Badge>
                      </div>
                      <p className="text-sm">
                        <span className="font-mono text-primary">{log.action}</span>:{" "}
                        {log.resource}
                      </p>
                      <p className="text-xs text-muted-foreground">{log.details}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        IP: {log.ipAddress}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(log.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No log entries match your filters
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border">
          <span>Showing {filteredLogs.length} of {auditLogs.length} entries</span>
          <span>
            {auditLogs.filter((l) => !l.success).length} failed attempts
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
