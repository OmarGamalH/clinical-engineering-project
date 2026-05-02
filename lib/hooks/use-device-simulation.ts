"use client"

import { useState, useEffect, useCallback } from "react"
import type { VitalSignsData, ECGData, InfusionPumpData, VentilatorData } from "@/lib/types"

// Helper to add random variation
function vary(value: number, variance: number): number {
  return value + (Math.random() - 0.5) * variance * 2
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function useVitalSignsSimulation(initialData: VitalSignsData) {
  const [data, setData] = useState<VitalSignsData>(initialData)

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        heartRate: Math.round(clamp(vary(prev.heartRate, 3), 45, 150)),
        systolicBP: Math.round(clamp(vary(prev.systolicBP, 4), 80, 200)),
        diastolicBP: Math.round(clamp(vary(prev.diastolicBP, 3), 50, 120)),
        spO2: Math.round(clamp(vary(prev.spO2, 1), 85, 100)),
        temperature: Number(clamp(vary(prev.temperature, 0.1), 35.5, 40).toFixed(1)),
        respiratoryRate: Math.round(clamp(vary(prev.respiratoryRate, 1), 8, 35)),
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return data
}

export function useECGWaveform(heartRate: number) {
  const [waveformData, setWaveformData] = useState<number[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const samplesPerBeat = Math.floor(60 / heartRate * 100) // 100 samples per second
    const generateECGBeat = () => {
      const beat: number[] = []
      for (let i = 0; i < samplesPerBeat; i++) {
        const t = i / samplesPerBeat
        let y = 0
        
        // P wave
        if (t > 0.05 && t < 0.15) {
          y = 0.15 * Math.sin((t - 0.05) * Math.PI / 0.1)
        }
        // QRS complex
        else if (t > 0.2 && t < 0.22) {
          y = -0.1 * Math.sin((t - 0.2) * Math.PI / 0.02)
        }
        else if (t > 0.22 && t < 0.28) {
          y = 1.0 * Math.sin((t - 0.22) * Math.PI / 0.06)
        }
        else if (t > 0.28 && t < 0.32) {
          y = -0.2 * Math.sin((t - 0.28) * Math.PI / 0.04)
        }
        // T wave
        else if (t > 0.4 && t < 0.55) {
          y = 0.3 * Math.sin((t - 0.4) * Math.PI / 0.15)
        }
        
        // Add small noise
        y += (Math.random() - 0.5) * 0.02
        beat.push(y)
      }
      return beat
    }

    const ecgBeat = generateECGBeat()
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % ecgBeat.length
        setWaveformData((prevData) => {
          const newData = [...prevData, ecgBeat[next]]
          if (newData.length > 300) {
            return newData.slice(-300)
          }
          return newData
        })
        return next
      })
    }, 10) // 100 samples per second

    return () => clearInterval(interval)
  }, [heartRate])

  return waveformData
}

export function useInfusionPumpSimulation(initialData: InfusionPumpData) {
  const [data, setData] = useState<InfusionPumpData>(initialData)

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        if (prev.volumeRemaining <= 0) return prev
        
        const volumeDelivered = prev.flowRate / 3600 // mL per second
        const newVolumeInfused = prev.volumeInfused + volumeDelivered
        const newVolumeRemaining = Math.max(0, prev.volumeRemaining - volumeDelivered)
        const newTimeRemaining = prev.flowRate > 0 
          ? Math.round((newVolumeRemaining / prev.flowRate) * 60) 
          : 0

        return {
          ...prev,
          volumeInfused: Number(newVolumeInfused.toFixed(2)),
          volumeRemaining: Number(newVolumeRemaining.toFixed(2)),
          timeRemaining: newTimeRemaining,
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return data
}

export function useVentilatorSimulation(initialData: VentilatorData) {
  const [data, setData] = useState<VentilatorData>(initialData)
  const [breathPhase, setBreathPhase] = useState<"inspiration" | "expiration">("inspiration")

  useEffect(() => {
    const breathInterval = 60000 / data.respiratoryRate // ms per breath
    const inspirationTime = breathInterval * 0.4 // 40% inspiration

    const interval = setInterval(() => {
      setBreathPhase((prev) => (prev === "inspiration" ? "expiration" : "inspiration"))
    }, inspirationTime)

    return () => clearInterval(interval)
  }, [data.respiratoryRate])

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        pip: Math.round(clamp(vary(prev.pip, 1), prev.peep + 5, 45)),
        minuteVentilation: Number(
          clamp(vary(prev.minuteVentilation, 0.2), 4, 15).toFixed(1)
        ),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return { data, breathPhase }
}

export function useDataFlowSimulation() {
  const [packets, setPackets] = useState<Array<{
    id: string
    progress: number
    path: number[]
  }>>([])
  const [isRunning, setIsRunning] = useState(true)
  const [packetsPerSecond, setPacketsPerSecond] = useState(2)

  const startSimulation = useCallback(() => setIsRunning(true), [])
  const stopSimulation = useCallback(() => setIsRunning(false), [])

  useEffect(() => {
    if (!isRunning) return

    // Generate new packets
    const generateInterval = setInterval(() => {
      const newPacket = {
        id: `pkt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        progress: 0,
        path: [0, 1, 2, 3], // Device -> Gateway -> Server -> EHR
      }
      setPackets((prev) => [...prev, newPacket])
    }, 1000 / packetsPerSecond)

    // Update packet positions
    const updateInterval = setInterval(() => {
      setPackets((prev) =>
        prev
          .map((p) => ({ ...p, progress: p.progress + 2 }))
          .filter((p) => p.progress <= 100)
      )
    }, 50)

    return () => {
      clearInterval(generateInterval)
      clearInterval(updateInterval)
    }
  }, [isRunning, packetsPerSecond])

  return {
    packets,
    isRunning,
    startSimulation,
    stopSimulation,
    packetsPerSecond,
    setPacketsPerSecond,
  }
}
