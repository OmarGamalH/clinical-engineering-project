"use client"

import { useState } from "react"
import { Lock, ArrowRight, Key, Shield, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  simulateEncrypt,
  getKeyExchangeSteps,
  encryptionInfo,
} from "@/lib/utils/encryption"

type Algorithm = "AES-256" | "TLS-1.3" | "RSA-2048"

export function EncryptionDemo() {
  const [algorithm, setAlgorithm] = useState<Algorithm>("AES-256")
  const [plainText, setPlainText] = useState(
    '{"patientId":"PT-001","heartRate":72,"timestamp":"2024-01-15T10:30:00Z"}'
  )
  const [encryptedText, setEncryptedText] = useState("")
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const handleEncrypt = async () => {
    setIsEncrypting(true)
    setCurrentStep(0)
    setEncryptedText("")

    const steps = getKeyExchangeSteps(algorithm)

    // Animate through steps
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setCurrentStep(i + 1)
    }

    // Generate encrypted output
    await new Promise((resolve) => setTimeout(resolve, 300))
    setEncryptedText(simulateEncrypt(plainText, algorithm))
    setIsEncrypting(false)
  }

  const steps = getKeyExchangeSteps(algorithm)
  const info = encryptionInfo[algorithm]

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lock className="size-5 text-primary" />
          Encryption Demonstration
        </CardTitle>
        <CardDescription>
          Visualize how data is encrypted before transmission
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="demo">
          <TabsList className="mb-4">
            <TabsTrigger value="demo">Interactive Demo</TabsTrigger>
            <TabsTrigger value="comparison">Data at Rest vs In Transit</TabsTrigger>
          </TabsList>

          <TabsContent value="demo" className="space-y-4">
            {/* Algorithm Selection */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Algorithm:</span>
              <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as Algorithm)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AES-256">AES-256</SelectItem>
                  <SelectItem value="TLS-1.3">TLS 1.3</SelectItem>
                  <SelectItem value="RSA-2048">RSA-2048</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline">{info.type}</Badge>
            </div>

            {/* Algorithm Info */}
            <div className="p-3 rounded-lg bg-secondary/30 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Key className="size-4 text-primary" />
                <span className="font-medium">{info.name}</span>
              </div>
              <div className="grid gap-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Key Size:</span>
                  <span className="font-mono">{info.keySize}</span>
                </div>
                <div className="flex justify-between">
                  <span>Use Case:</span>
                  <span>{info.use}</span>
                </div>
                <div className="flex justify-between">
                  <span>Security:</span>
                  <span className="text-status-online">{info.strength}</span>
                </div>
              </div>
            </div>

            {/* Input/Output */}
            <div className="grid gap-4 lg:grid-cols-[1fr,auto,1fr]">
              <div className="space-y-2">
                <label className="text-sm font-medium">Plain Text (JSON)</label>
                <Textarea
                  value={plainText}
                  onChange={(e) => setPlainText(e.target.value)}
                  className="font-mono text-sm h-32 bg-secondary/30"
                  placeholder="Enter data to encrypt..."
                />
              </div>

              <div className="flex items-center justify-center">
                <Button
                  onClick={handleEncrypt}
                  disabled={isEncrypting || !plainText}
                  className="gap-2"
                >
                  {isEncrypting ? (
                    <RefreshCw className="size-4 animate-spin" />
                  ) : (
                    <Lock className="size-4" />
                  )}
                  Encrypt
                  <ArrowRight className="size-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Encrypted Output</label>
                <Textarea
                  value={encryptedText}
                  readOnly
                  className="font-mono text-sm h-32 bg-black/30 text-status-online"
                  placeholder="Encrypted data will appear here..."
                />
              </div>
            </div>

            {/* Key Exchange Steps */}
            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              <p className="text-sm font-medium mb-3">
                {algorithm} Key Exchange Process
              </p>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded text-sm transition-all",
                      currentStep > index
                        ? "bg-status-online/10 text-status-online"
                        : currentStep === index && isEncrypting
                        ? "bg-primary/10 text-primary animate-pulse"
                        : "text-muted-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "size-6 rounded-full flex items-center justify-center text-xs font-mono border",
                        currentStep > index
                          ? "bg-status-online text-background border-status-online"
                          : currentStep === index && isEncrypting
                          ? "bg-primary text-background border-primary"
                          : "border-muted-foreground"
                      )}
                    >
                      {currentStep > index ? "✓" : index + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Data at Rest */}
              <div className="p-4 rounded-lg border border-border bg-secondary/30">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="size-5 text-primary" />
                  <span className="font-semibold">Data at Rest</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded bg-black/30">
                    <p className="text-xs text-muted-foreground mb-1">Storage:</p>
                    <p>Database, File System, Backups</p>
                  </div>
                  <div className="p-3 rounded bg-black/30">
                    <p className="text-xs text-muted-foreground mb-1">
                      Recommended Encryption:
                    </p>
                    <Badge className="bg-primary">AES-256</Badge>
                  </div>
                  <div className="p-3 rounded bg-black/30">
                    <p className="text-xs text-muted-foreground mb-1">Key Management:</p>
                    <p>Hardware Security Module (HSM)</p>
                  </div>
                  <div className="p-3 rounded bg-black/30">
                    <p className="text-xs text-muted-foreground mb-1">HIPAA Requirement:</p>
                    <Badge variant="outline" className="text-status-online border-status-online/30">
                      Addressable
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Data in Transit */}
              <div className="p-4 rounded-lg border border-border bg-secondary/30">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="size-5 text-status-online" />
                  <span className="font-semibold">Data in Transit</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded bg-black/30">
                    <p className="text-xs text-muted-foreground mb-1">Transport:</p>
                    <p>Network, API Calls, HTTPS</p>
                  </div>
                  <div className="p-3 rounded bg-black/30">
                    <p className="text-xs text-muted-foreground mb-1">
                      Recommended Encryption:
                    </p>
                    <Badge className="bg-status-online">TLS 1.3</Badge>
                  </div>
                  <div className="p-3 rounded bg-black/30">
                    <p className="text-xs text-muted-foreground mb-1">Certificate:</p>
                    <p>X.509 with 2048-bit RSA or ECDSA</p>
                  </div>
                  <div className="p-3 rounded bg-black/30">
                    <p className="text-xs text-muted-foreground mb-1">HIPAA Requirement:</p>
                    <Badge variant="outline" className="text-status-critical border-status-critical/30">
                      Required
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
