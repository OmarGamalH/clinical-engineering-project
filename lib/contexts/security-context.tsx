"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { SecurityThreat, AuditLogEntry, AccessAttempt } from "@/lib/types"
import { initialThreats } from "@/lib/mock-data/threats"
import { initialAuditLogs, initialAccessAttempts, generateAuditLogEntry } from "@/lib/mock-data/audit-logs"
import { useAuth } from "./auth-context"

interface SecurityContextType {
  threats: SecurityThreat[]
  auditLogs: AuditLogEntry[]
  accessAttempts: AccessAttempt[]
  addThreat: (threat: SecurityThreat) => void
  updateThreatStatus: (id: string, status: SecurityThreat["status"]) => void
  addAuditLog: (action: string, resource: string, details: string, success?: boolean) => void
  clearMitigatedThreats: () => void
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined)

export function SecurityProvider({ children }: { children: ReactNode }) {
  const [threats, setThreats] = useState<SecurityThreat[]>(initialThreats)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs)
  const [accessAttempts] = useState<AccessAttempt[]>(initialAccessAttempts)
  const { user } = useAuth()

  const addThreat = useCallback((threat: SecurityThreat) => {
    setThreats((prev) => [threat, ...prev])
  }, [])

  const updateThreatStatus = useCallback((id: string, status: SecurityThreat["status"]) => {
    setThreats((prev) =>
      prev.map((threat) => (threat.id === id ? { ...threat, status } : threat))
    )
  }, [])

  const addAuditLog = useCallback(
    (action: string, resource: string, details: string, success: boolean = true) => {
      if (!user) return
      const entry = generateAuditLogEntry(
        action,
        resource,
        details,
        user.name,
        user.role,
        success
      )
      setAuditLogs((prev) => [entry, ...prev])
    },
    [user]
  )

  const clearMitigatedThreats = useCallback(() => {
    setThreats((prev) => prev.filter((t) => t.status !== "mitigated"))
  }, [])

  return (
    <SecurityContext.Provider
      value={{
        threats,
        auditLogs,
        accessAttempts,
        addThreat,
        updateThreatStatus,
        addAuditLog,
        clearMitigatedThreats,
      }}
    >
      {children}
    </SecurityContext.Provider>
  )
}

export function useSecurity() {
  const context = useContext(SecurityContext)
  if (context === undefined) {
    throw new Error("useSecurity must be used within a SecurityProvider")
  }
  return context
}
