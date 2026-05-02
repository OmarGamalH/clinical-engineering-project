"use client"

import { useState, useEffect, type ReactNode } from "react"
import { Bell, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  title: string
  description?: string
  mobileMenu?: ReactNode
}

interface Notification {
  id: string
  type: "alert" | "warning" | "info"
  message: string
  time: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    message: "Critical: ECG Monitor 2 - AFib detected",
    time: "2 min ago",
  },
  {
    id: "2",
    type: "warning",
    message: "Infusion Pump B2 - Occlusion alert",
    time: "5 min ago",
  },
  {
    id: "3",
    type: "info",
    message: "EHR sync completed successfully",
    time: "12 min ago",
  },
  {
    id: "4",
    type: "warning",
    message: "Security: Unusual access pattern detected",
    time: "25 min ago",
  },
]

export function Header({ title, description, mobileMenu }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>("")
  const [notifications] = useState<Notification[]>(mockNotifications)
  const alertCount = notifications.filter((n) => n.type === "alert").length

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="size-4 text-destructive" />
      case "warning":
        return <AlertTriangle className="size-4 text-status-warning" />
      case "info":
        return <CheckCircle className="size-4 text-status-online" />
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 sm:h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-3 sm:px-6">
      <div className="flex items-center gap-3">
        {mobileMenu}
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-semibold truncate">{title}</h1>
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* System Time - hidden on small screens */}
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-4" />
          <span className="font-mono">{currentTime}</span>
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative size-8 sm:size-9">
              <Bell className="size-4 sm:size-5" />
              {alertCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 size-4 sm:size-5 p-0 flex items-center justify-center text-[10px] sm:text-xs"
                >
                  {alertCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 sm:w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <Badge variant="secondary">{notifications.length}</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex items-start gap-3 p-3 cursor-pointer"
              >
                {getNotificationIcon(notification.type)}
                <div className="flex-1 space-y-1">
                  <p className="text-sm leading-tight">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-status-online/10 border border-status-online/20">
          <div className="size-2 rounded-full bg-status-online animate-pulse" />
          <span className="text-xs font-medium text-status-online">Online</span>
        </div>
      </div>
    </header>
  )
}
