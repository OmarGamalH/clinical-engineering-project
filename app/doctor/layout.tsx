"use client"

import { useEffect, useState, type ReactNode, createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  Calendar,
  CalendarCheck,
  Users,
  Settings,
  LogOut,
  Menu,
  Home,
  ClipboardList,
  Bell,
  Stethoscope,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { AuthProvider } from "@/lib/contexts/auth-context"
import { AppointmentProvider } from "@/lib/contexts/appointment-context"
import type { User as UserType } from "@/lib/types"

interface DoctorDashboardContextValue {
  user: UserType | null
  mobileMenu: ReactNode
}

const DoctorDashboardContext = createContext<DoctorDashboardContextValue | null>(null)

export function useDashboard() {
  const context = useContext(DoctorDashboardContext)
  if (!context) {
    throw new Error("useDashboard must be used within DoctorDashboardLayout")
  }
  return context
}

const navigation = [
  {
    name: "Dashboard",
    href: "/doctor",
    icon: Home,
  },
  {
    name: "Appointments",
    href: "/doctor/appointments",
    icon: CalendarCheck,
  },
  {
    name: "My Patients",
    href: "/doctor/patients",
    icon: Users,
  },
  {
    name: "Schedule",
    href: "/doctor/schedule",
    icon: Calendar,
  },
]

interface SidebarProps {
  user: UserType | null
  onLogout: () => void
  onNavigate?: () => void
}

function SidebarContent({ user, onLogout, onNavigate }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-sidebar-border">
        <div className="size-9 rounded-lg bg-primary/20 flex items-center justify-center">
          <Stethoscope className="size-5 text-primary" />
        </div>
        <div>
          <span className="font-semibold text-sidebar-foreground">Doctor Portal</span>
          <p className="text-xs text-muted-foreground">Practice Management</p>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn("size-5", isActive && "text-primary")} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <Separator className="my-4 bg-sidebar-border" />

        <div className="space-y-1">
          <Link
            href="/doctor/settings"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            <Settings className="size-5" />
            Settings
          </Link>
        </div>
      </ScrollArea>

      {/* User Info */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {user?.name?.split(" ").slice(1).map(n => n?.[0]).join("") || "D"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-sidebar-foreground">
              {user?.name || "Doctor"}
            </p>
            <Badge variant="outline" className="text-xs mt-0.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              Doctor
            </Badge>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          onClick={onLogout}
        >
          <LogOut className="size-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}

function MobileSidebar({ user, onLogout }: SidebarProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 bg-sidebar border-sidebar-border">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SidebarContent user={user} onLogout={onLogout} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

function Sidebar({ user, onLogout }: SidebarProps) {
  return (
    <div className="hidden lg:flex h-full w-64 flex-col border-r border-sidebar-border">
      <SidebarContent user={user} onLogout={onLogout} />
    </div>
  )
}

function DoctorLayoutContent({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      if (userData.role !== "doctor") {
        router.push("/")
        return
      }
      setUser({
        id: `usr-${Date.now()}`,
        name: userData.name,
        role: userData.role,
        department: userData.department,
        specialization: userData.specialization,
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
          <p className="text-sm text-muted-foreground">Loading doctor portal...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const mobileMenu = <MobileSidebar user={user} onLogout={handleLogout} />

  return (
    <DoctorDashboardContext.Provider value={{ user, mobileMenu }}>
      <div className="min-h-screen flex bg-background">
        <Sidebar user={user} onLogout={handleLogout} />
        <main className="flex-1 overflow-auto w-full">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
            {mobileMenu}
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Stethoscope className="size-4 text-primary" />
              </div>
              <span className="font-semibold text-sm">Doctor Portal</span>
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="size-5" />
            </Button>
          </div>
          {children}
        </main>
      </div>
    </DoctorDashboardContext.Provider>
  )
}

export default function DoctorLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppointmentProvider>
        <DoctorLayoutContent>{children}</DoctorLayoutContent>
      </AppointmentProvider>
    </AuthProvider>
  )
}
