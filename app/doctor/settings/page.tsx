"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useDashboard } from "@/app/doctor/layout"
import { doctors } from "@/lib/mock-data/doctors"
import { useMemo } from "react"
import {
  User,
  Bell,
  Shield,
  Clock,
} from "lucide-react"

export default function SettingsPage() {
  const { user } = useDashboard()

  const currentDoctor = useMemo(() => {
    const found = doctors.find(d => d.name === user?.name)
    return found || doctors[0]
  }, [user?.name])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="size-5 text-primary" />
            <CardTitle>Profile Information</CardTitle>
          </div>
          <CardDescription>
            Your personal and professional details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                defaultValue={currentDoctor.name}
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                defaultValue={currentDoctor.specialization}
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                defaultValue={currentDoctor.department}
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                defaultValue={currentDoctor.email}
                className="bg-secondary/50"
              />
            </div>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="size-5 text-primary" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive email updates about appointments
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Appointment Reminders</p>
              <p className="text-sm text-muted-foreground">
                Get reminded before upcoming appointments
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Booking Alerts</p>
              <p className="text-sm text-muted-foreground">
                Be notified when patients book appointments
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Working Hours */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="size-5 text-primary" />
            <CardTitle>Working Hours</CardTitle>
          </div>
          <CardDescription>
            Set your available hours for appointments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                defaultValue="08:00"
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                defaultValue="17:00"
                className="bg-secondary/50"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Available on Weekends</p>
              <p className="text-sm text-muted-foreground">
                Allow appointments on Saturday and Sunday
              </p>
            </div>
            <Switch />
          </div>
          <Button>Update Hours</Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              className="bg-secondary/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                className="bg-secondary/50"
              />
            </div>
          </div>
          <Button>Change Password</Button>
        </CardContent>
      </Card>
    </div>
  )
}
