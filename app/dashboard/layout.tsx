"use client"

import { useEffect, useState, type ReactNode, createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import { Sidebar, MobileSidebar } from "@/components/dashboard/sidebar"
import { AuthProvider } from "@/lib/contexts/auth-context"
import { DeviceProvider } from "@/lib/contexts/device-context"
import { SecurityProvider } from "@/lib/contexts/security-context"
import type { User } from "@/lib/types"

interface DashboardContextValue {
  user: User | null
  mobileMenu: ReactNode
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error("useDashboard must be used within DashboardLayout")
  }
  return context
}

function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser({
        id: `usr-${Date.now()}`,
        name: userData.name,
        role: userData.role,
        department: userData.department,
      })
    } else {
      router.push("/")
    }
    setIsLoaded(true)
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem("user")
    router.push("/")
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const mobileMenu = <MobileSidebar user={user} onLogout={handleLogout} />

  return (
    <DashboardContext.Provider value={{ user, mobileMenu }}>
      <div className="min-h-screen flex bg-background">
        <Sidebar user={user} onLogout={handleLogout} />
        <main className="flex-1 overflow-auto w-full">
          {children}
        </main>
      </div>
    </DashboardContext.Provider>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DeviceProvider>
        <SecurityProvider>
          <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </SecurityProvider>
      </DeviceProvider>
    </AuthProvider>
  )
}
