"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { User, UserRole, Permission } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  permissions: Permission
  login: (name: string, role: UserRole, department: string) => void
  logout: () => void
}

const defaultPermissions: Record<UserRole, Permission> = {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = useCallback((name: string, role: UserRole, department: string) => {
    setUser({
      id: `usr-${Date.now()}`,
      name,
      role,
      department,
    })
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const permissions = user ? defaultPermissions[user.role] : defaultPermissions.clinician

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        permissions,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
