"use client"

import { Users, Check, X, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { UserRole, Permission } from "@/lib/types"

const permissions: { key: keyof Permission; label: string; description: string }[] = [
  { key: "canViewDevices", label: "View Devices", description: "Access device monitoring dashboard" },
  { key: "canConfigureDevices", label: "Configure Devices", description: "Modify device settings and parameters" },
  { key: "canViewEHR", label: "View EHR", description: "Access patient records and EHR data" },
  { key: "canConfigureEHR", label: "Configure EHR", description: "Modify EHR integration settings" },
  { key: "canViewSecurity", label: "View Security", description: "Access security dashboard" },
  { key: "canManageSecurity", label: "Manage Security", description: "Modify security settings and respond to threats" },
  { key: "canViewAuditLogs", label: "View Audit Logs", description: "Access system audit trail" },
]

const rolePermissions: Record<UserRole, Permission> = {
  admin: {
    canViewDevices: true,
    canConfigureDevices: true,
    canViewEHR: true,
    canConfigureEHR: true,
    canViewSecurity: true,
    canManageSecurity: true,
    canViewAuditLogs: true,
  },
  clinician: {
    canViewDevices: true,
    canConfigureDevices: false,
    canViewEHR: true,
    canConfigureEHR: false,
    canViewSecurity: true,
    canManageSecurity: false,
    canViewAuditLogs: true,
  },
  technician: {
    canViewDevices: true,
    canConfigureDevices: true,
    canViewEHR: true,
    canConfigureEHR: true,
    canViewSecurity: false,
    canManageSecurity: false,
    canViewAuditLogs: false,
  },
}

const roleInfo: Record<UserRole, { label: string; color: string }> = {
  admin: { label: "Administrator", color: "bg-chart-5/20 text-chart-5 border-chart-5/30" },
  clinician: { label: "Clinician", color: "bg-primary/20 text-primary border-primary/30" },
  technician: { label: "Technician", color: "bg-status-warning/20 text-status-warning border-status-warning/30" },
}

export function AccessControl() {
  const roles: UserRole[] = ["admin", "clinician", "technician"]

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="size-5 text-primary" />
          Role-Based Access Control
        </CardTitle>
        <CardDescription>
          Permission matrix showing access levels for different user roles
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Permission Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium">Permission</th>
                {roles.map((role) => (
                  <th key={role} className="text-center py-3 px-4">
                    <Badge variant="outline" className={cn("text-xs", roleInfo[role].color)}>
                      {roleInfo[role].label}
                    </Badge>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission) => (
                <tr key={permission.key} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{permission.label}</p>
                      <p className="text-xs text-muted-foreground">{permission.description}</p>
                    </div>
                  </td>
                  {roles.map((role) => (
                    <td key={role} className="text-center py-3 px-4">
                      {rolePermissions[role][permission.key] ? (
                        <div className="inline-flex items-center justify-center size-8 rounded-full bg-status-online/20">
                          <Check className="size-4 text-status-online" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center size-8 rounded-full bg-muted">
                          <X className="size-4 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* HIPAA Compliance Note */}
        <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-3">
            <Shield className="size-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-primary">HIPAA Compliance</p>
              <p className="text-sm text-muted-foreground mt-1">
                Role-based access control (RBAC) is a key requirement for HIPAA compliance.
                Each role has minimum necessary access to perform their duties, following the
                principle of least privilege.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
