"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useDashboard } from "../layout"
import {
  Bell,
  Mail,
  Shield,
  Smartphone,
  Globe,
  Moon,
  Eye,
  Lock,
} from "lucide-react"
import { useState } from "react"

export default function PatientSettingsPage() {
  const { user } = useDashboard()
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    labResultsAlerts: true,
    promotionalEmails: false,
    darkMode: true,
    twoFactorAuth: false,
    dataSharing: false,
  })

  const updateSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="grid gap-6">
        {/* Notifications */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="size-4 text-primary" />
                </div>
                <div>
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={() => updateSetting("emailNotifications")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Smartphone className="size-4 text-primary" />
                </div>
                <div>
                  <Label className="text-base">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via SMS
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={() => updateSetting("smsNotifications")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10">
                  <Bell className="size-4 text-cyan-400" />
                </div>
                <div>
                  <Label className="text-base">Appointment Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded about upcoming appointments
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.appointmentReminders}
                onCheckedChange={() => updateSetting("appointmentReminders")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Eye className="size-4 text-emerald-400" />
                </div>
                <div>
                  <Label className="text-base">Lab Results Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when lab results are ready
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.labResultsAlerts}
                onCheckedChange={() => updateSetting("labResultsAlerts")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription>Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Lock className="size-4 text-primary" />
                </div>
                <div>
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={() => updateSetting("twoFactorAuth")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Globe className="size-4 text-amber-400" />
                </div>
                <div>
                  <Label className="text-base">Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow sharing anonymized data for research
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.dataSharing}
                onCheckedChange={() => updateSetting("dataSharing")}
              />
            </div>

            <Separator />

            <div className="pt-2">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="size-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Moon className="size-4 text-primary" />
                </div>
                <div>
                  <Label className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme for the interface
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={() => updateSetting("darkMode")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-card border-border border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <div>
                <p className="font-medium text-foreground">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
