"use client"

import { useState } from "react"
import { useAuth } from "@/lib/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Network, 
  Monitor,
  Save,
  RefreshCw
} from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState({
    deviceAlerts: true,
    securityAlerts: true,
    ehrSync: true,
    systemUpdates: false,
    emailDigest: true
  })
  const [dataRetention, setDataRetention] = useState("30")
  const [refreshRate, setRefreshRate] = useState("5")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Configure system preferences and user settings
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="network" className="gap-2">
            <Network className="h-4 w-4" />
            Network
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-2">
            <Database className="h-4 w-4" />
            Data Management
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                User Profile
              </CardTitle>
              <CardDescription>
                Manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input 
                    id="name" 
                    defaultValue={user?.name} 
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    defaultValue={user?.email} 
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="role" 
                      value={user?.role} 
                      disabled 
                      className="bg-muted border-border"
                    />
                    <Badge variant="outline" className="capitalize">
                      {user?.role}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input 
                    id="department" 
                    defaultValue={user?.department} 
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                Display Settings
              </CardTitle>
              <CardDescription>
                Customize your dashboard experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable dark theme for the dashboard
                  </p>
                </div>
                <Switch checked disabled />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact View</Label>
                  <p className="text-sm text-muted-foreground">
                    Show more devices per page
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Device Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable real-time waveform animations
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Alert Preferences
              </CardTitle>
              <CardDescription>
                Configure which alerts you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Device Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications for device status changes and alarms
                  </p>
                </div>
                <Switch 
                  checked={notifications.deviceAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, deviceAlerts: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Critical security threat notifications
                  </p>
                </div>
                <Switch 
                  checked={notifications.securityAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, securityAlerts: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>EHR Sync Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Updates on data synchronization with EHR systems
                  </p>
                </div>
                <Switch 
                  checked={notifications.ehrSync}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, ehrSync: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications about system maintenance and updates
                  </p>
                </div>
                <Switch 
                  checked={notifications.systemUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, systemUpdates: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Daily Email Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a summary of daily activities via email
                  </p>
                </div>
                <Switch 
                  checked={notifications.emailDigest}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, emailDigest: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Network Settings */}
        <TabsContent value="network" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-primary" />
                Network Configuration
              </CardTitle>
              <CardDescription>
                Configure network and connectivity settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="refreshRate">Data Refresh Rate (seconds)</Label>
                  <Input 
                    id="refreshRate" 
                    type="number"
                    min="1"
                    max="60"
                    value={refreshRate}
                    onChange={(e) => setRefreshRate(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeout">Connection Timeout (seconds)</Label>
                  <Input 
                    id="timeout" 
                    type="number"
                    defaultValue="30"
                    className="bg-background border-border"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Connection Status</Label>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                    <span className="text-sm">HL7 FHIR Server</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                    <span className="text-sm">Device Gateway</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                    <span className="text-sm">Security Monitoring</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Protocols
              </CardTitle>
              <CardDescription>
                Configure encryption and security protocols
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>TLS 1.3 Encryption</Label>
                  <p className="text-sm text-muted-foreground">
                    Use latest TLS protocol for all connections
                  </p>
                </div>
                <Switch defaultChecked disabled />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Certificate Pinning</Label>
                  <p className="text-sm text-muted-foreground">
                    Verify server certificates against pinned values
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mutual TLS (mTLS)</Label>
                  <p className="text-sm text-muted-foreground">
                    Require client certificates for device connections
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Data Retention
              </CardTitle>
              <CardDescription>
                Configure how long data is stored in the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="retention">Audit Log Retention (days)</Label>
                  <Input 
                    id="retention" 
                    type="number"
                    min="7"
                    max="365"
                    value={dataRetention}
                    onChange={(e) => setDataRetention(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deviceData">Device Data Retention (days)</Label>
                  <Input 
                    id="deviceData" 
                    type="number"
                    defaultValue="90"
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Storage Usage</Label>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Audit Logs</span>
                      <span className="text-muted-foreground">2.4 GB / 10 GB</span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "24%" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Device Telemetry</span>
                      <span className="text-muted-foreground">8.1 GB / 50 GB</span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: "16%" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>EHR Cache</span>
                      <span className="text-muted-foreground">1.2 GB / 5 GB</span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "24%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Data Actions</CardTitle>
              <CardDescription>
                Manage system data and cache
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Clear Cache
                </Button>
                <Button variant="outline" className="gap-2">
                  <Database className="h-4 w-4" />
                  Export Audit Logs
                </Button>
                <Button variant="outline" className="gap-2">
                  <Monitor className="h-4 w-4" />
                  Export Device Data
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Note: This is a simulation environment. Data actions are for demonstration purposes only.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
