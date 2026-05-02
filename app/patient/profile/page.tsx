"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useDashboard } from "../layout"
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Heart,
  AlertCircle,
  Edit,
  Save,
} from "lucide-react"
import { useState } from "react"

export default function PatientProfilePage() {
  const { user } = useDashboard()
  const [isEditing, setIsEditing] = useState(false)

  const mockProfile = {
    name: user?.name || "Demo Patient",
    email: "patient@hospital.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    bloodType: "O+",
    address: "123 Main Street, Medical City, MC 12345",
    emergencyContact: {
      name: "Jane Doe",
      phone: "+1 (555) 987-6543",
      relationship: "Spouse",
    },
    allergies: ["Penicillin", "Peanuts"],
    conditions: ["Hypertension", "Type 2 Diabetes"],
    insurance: {
      provider: "Blue Cross Blue Shield",
      policyNumber: "BCBS-123456789",
      groupNumber: "GRP-987654",
    },
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal and medical information
          </p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          className="gap-2"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <Save className="size-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="size-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Your basic personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="size-20 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl font-semibold text-primary">
                  {mockProfile.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{mockProfile.name}</h3>
                <Badge variant="outline">Patient</Badge>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={mockProfile.name}
                  disabled={!isEditing}
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="size-4" />
                  Email Address
                </Label>
                <Input
                  value={mockProfile.email}
                  disabled={!isEditing}
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="size-4" />
                  Phone Number
                </Label>
                <Input
                  value={mockProfile.phone}
                  disabled={!isEditing}
                  className="bg-secondary/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    Date of Birth
                  </Label>
                  <Input
                    value={new Date(mockProfile.dateOfBirth).toLocaleDateString()}
                    disabled={!isEditing}
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Input
                    value={mockProfile.gender}
                    disabled={!isEditing}
                    className="bg-secondary/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  Address
                </Label>
                <Input
                  value={mockProfile.address}
                  disabled={!isEditing}
                  className="bg-secondary/50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="size-5" />
              Medical Information
            </CardTitle>
            <CardDescription>Your health and medical details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                <p className="text-sm text-muted-foreground mb-1">Blood Type</p>
                <p className="text-xl font-bold text-primary">{mockProfile.bloodType}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                <p className="text-sm text-muted-foreground mb-1">Patient ID</p>
                <p className="text-xl font-bold text-primary">{user?.id?.slice(0, 8) || "PT-12345"}</p>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="flex items-center gap-2 mb-3">
                <AlertCircle className="size-4 text-red-400" />
                Allergies
              </Label>
              <div className="flex flex-wrap gap-2">
                {mockProfile.allergies.map((allergy) => (
                  <Badge key={allergy} variant="destructive" className="bg-red-500/20 text-red-400">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Heart className="size-4 text-amber-400" />
                Medical Conditions
              </Label>
              <div className="flex flex-wrap gap-2">
                {mockProfile.conditions.map((condition) => (
                  <Badge key={condition} variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="size-5" />
              Emergency Contact
            </CardTitle>
            <CardDescription>Contact person in case of emergency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Contact Name</Label>
              <Input
                value={mockProfile.emergencyContact.name}
                disabled={!isEditing}
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={mockProfile.emergencyContact.phone}
                disabled={!isEditing}
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Relationship</Label>
              <Input
                value={mockProfile.emergencyContact.relationship}
                disabled={!isEditing}
                className="bg-secondary/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Insurance Information */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-5" />
              Insurance Information
            </CardTitle>
            <CardDescription>Your health insurance details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Insurance Provider</Label>
              <Input
                value={mockProfile.insurance.provider}
                disabled={!isEditing}
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Policy Number</Label>
              <Input
                value={mockProfile.insurance.policyNumber}
                disabled={!isEditing}
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Group Number</Label>
              <Input
                value={mockProfile.insurance.groupNumber}
                disabled={!isEditing}
                className="bg-secondary/50"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
