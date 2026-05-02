"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  LayoutDashboard,
  Monitor,
  Database,
  Network,
  Shield,
  LogOut,
  Settings,
  Building2,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import type { User } from "@/lib/types"

interface SidebarProps {
  user: User | null
  onLogout: () => void
}

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Device Monitoring",
    href: "/dashboard/devices",
    icon: Monitor,
  },
  {
    name: "EHR Integration",
    href: "/dashboard/ehr",
    icon: Database,
  },
  {
    name: "Data Flow",
    href: "/dashboard/data-flow",
    icon: Network,
  },
  {
    name: "Security Center",
    href: "/dashboard/security",
    icon: Shield,
  },
  {
    name: "HIS Overview",
    href: "/dashboard/his",
    icon: Building2,
  },
]

const roleLabels = {
  admin: "Administrator",
  clinician: "Clinician",
  technician: "Technician",
}

function SidebarContent({ user, onLogout, onNavigate }: SidebarProps & { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-sidebar-border">
        <div className="size-9 rounded-lg bg-primary/20 flex items-center justify-center">
          <Activity className="size-5 text-primary" />
        </div>
        <div>
          <span className="font-semibold text-sidebar-foreground">MedDevice Hub</span>
          <p className="text-xs text-muted-foreground">Integration Platform</p>
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
            href="/dashboard/settings"
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
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-sidebar-foreground">
              {user?.name || "Guest"}
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.role ? roleLabels[user.role] : "Unknown Role"}
            </p>
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

export function MobileSidebar({ user, onLogout }: SidebarProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close sheet when pathname changes
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

export function Sidebar({ user, onLogout }: SidebarProps) {
  return (
    <div className="hidden lg:flex h-full w-64 flex-col border-r border-sidebar-border">
      <SidebarContent user={user} onLogout={onLogout} />
    </div>
  )
}
