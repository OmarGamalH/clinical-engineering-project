"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Device, DeviceStatus } from "@/lib/types"
import { getAllDevices } from "@/lib/mock-data/devices"

interface DeviceContextType {
  devices: Device[]
  updateDevice: (id: string, updates: Partial<Device>) => void
  toggleDeviceStatus: (id: string) => void
  toggleEHRConnection: (id: string) => void
  getDeviceById: (id: string) => Device | undefined
  getDevicesByStatus: (status: DeviceStatus) => Device[]
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined)

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(getAllDevices())

  const updateDevice = useCallback((id: string, updates: Partial<Device>) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === id ? { ...device, ...updates, lastSync: new Date() } : device
      ) as Device[]
    )
  }, [])

  const toggleDeviceStatus = useCallback((id: string) => {
    setDevices((prev) =>
      prev.map((device) => {
        if (device.id !== id) return device
        const newStatus: DeviceStatus = device.status === "offline" ? "online" : "offline"
        const newConnectionStatus = newStatus === "offline" ? "disconnected" : "connected"
        return {
          ...device,
          status: newStatus,
          connectionStatus: newConnectionStatus,
          lastSync: new Date(),
        }
      }) as Device[]
    )
  }, [])

  const toggleEHRConnection = useCallback((id: string) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === id
          ? { ...device, ehrConnected: !device.ehrConnected, lastSync: new Date() }
          : device
      ) as Device[]
    )
  }, [])

  const getDeviceById = useCallback(
    (id: string) => devices.find((d) => d.id === id),
    [devices]
  )

  const getDevicesByStatus = useCallback(
    (status: DeviceStatus) => devices.filter((d) => d.status === status),
    [devices]
  )

  return (
    <DeviceContext.Provider
      value={{
        devices,
        updateDevice,
        toggleDeviceStatus,
        toggleEHRConnection,
        getDeviceById,
        getDevicesByStatus,
      }}
    >
      {children}
    </DeviceContext.Provider>
  )
}

export function useDevices() {
  const context = useContext(DeviceContext)
  if (context === undefined) {
    throw new Error("useDevices must be used within a DeviceProvider")
  }
  return context
}
