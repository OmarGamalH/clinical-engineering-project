"use client"

import { useState } from "react"
import { Monitor, Filter, Grid3X3, List, ChevronLeft } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { DeviceCard } from "@/components/devices/device-card"
import { VitalSignsMonitor } from "@/components/devices/vital-signs-monitor"
import { InfusionPump } from "@/components/devices/infusion-pump"
import { Ventilator } from "@/components/devices/ventilator"
import { ECGMonitor } from "@/components/devices/ecg-monitor"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useDevices } from "@/lib/contexts/device-context"
import { useDashboard } from "../layout"
import type {
  Device,
  DeviceType,
  VitalSignsDevice,
  InfusionPumpDevice,
  VentilatorDevice,
  ECGDevice,
} from "@/lib/types"

type ViewMode = "grid" | "list"
type FilterType = "all" | DeviceType

export default function DevicesPage() {
  const { mobileMenu } = useDashboard()
  const { devices, toggleDeviceStatus, toggleEHRConnection } = useDevices()
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [filter, setFilter] = useState<FilterType>("all")
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false)

  const filteredDevices = devices.filter(
    (device) => filter === "all" || device.type === filter
  )

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device)
    setMobileDetailOpen(true)
  }

  const renderDeviceDetail = () => {
    if (!selectedDevice) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center bg-card/50 rounded-lg border border-border">
          <Monitor className="size-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Select a device to view detailed monitoring</p>
        </div>
      )
    }

    switch (selectedDevice.type) {
      case "vital-signs":
        return <VitalSignsMonitor device={selectedDevice as VitalSignsDevice} />
      case "infusion-pump":
        return <InfusionPump device={selectedDevice as InfusionPumpDevice} />
      case "ventilator":
        return <Ventilator device={selectedDevice as VentilatorDevice} />
      case "ecg":
        return <ECGMonitor device={selectedDevice as ECGDevice} />
    }
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Device Monitoring"
        description="Real-time monitoring and control of medical devices"
        mobileMenu={mobileMenu}
      />

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Device Type Tabs */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            {/* Scrollable tabs for mobile */}
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-2 pb-2">
                <Button
                  variant={filter === "all" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className="shrink-0"
                >
                  All ({devices.length})
                </Button>
                <Button
                  variant={filter === "vital-signs" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("vital-signs")}
                  className="shrink-0"
                >
                  Vital Signs ({devices.filter((d) => d.type === "vital-signs").length})
                </Button>
                <Button
                  variant={filter === "infusion-pump" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("infusion-pump")}
                  className="shrink-0"
                >
                  Infusion ({devices.filter((d) => d.type === "infusion-pump").length})
                </Button>
                <Button
                  variant={filter === "ventilator" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("ventilator")}
                  className="shrink-0"
                >
                  Ventilators ({devices.filter((d) => d.type === "ventilator").length})
                </Button>
                <Button
                  variant={filter === "ecg" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("ecg")}
                  className="shrink-0"
                >
                  ECG ({devices.filter((d) => d.type === "ecg").length})
                </Button>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                <Filter className="size-3 sm:size-4" />
                {filter === "all" ? "All Devices" : `Filtered: ${filter.replace("-", " ")}`}
              </p>
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="size-7 sm:size-8"
                >
                  <Grid3X3 className="size-3 sm:size-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="size-7 sm:size-8"
                >
                  <List className="size-3 sm:size-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {/* Device List */}
            <div className="space-y-3 sm:space-y-4">
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
                    : "space-y-3 sm:space-y-4"
                }
              >
                {filteredDevices.map((device) => (
                  <DeviceCard
                    key={device.id}
                    device={device}
                    onToggleStatus={toggleDeviceStatus}
                    onToggleEHR={toggleEHRConnection}
                    onSelect={handleDeviceSelect}
                    isSelected={selectedDevice?.id === device.id}
                  />
                ))}
              </div>

              {filteredDevices.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No devices found for the selected filter
                </div>
              )}
            </div>

            {/* Device Detail Panel - Desktop */}
            <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Device Details
              </h3>
              {renderDeviceDetail()}
            </div>
          </div>
        </div>

        {/* Mobile Device Detail Sheet */}
        <Sheet open={mobileDetailOpen} onOpenChange={setMobileDetailOpen}>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
            <SheetHeader className="pb-4">
              <SheetTitle className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => setMobileDetailOpen(false)}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                Device Details
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(85vh-80px)]">
              {renderDeviceDetail()}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
