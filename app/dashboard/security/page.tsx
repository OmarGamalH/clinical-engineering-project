"use client"

import { Header } from "@/components/dashboard/header"
import { ThreatDashboard } from "@/components/security/threat-dashboard"
import { AuditLog } from "@/components/security/audit-log"
import { EncryptionDemo } from "@/components/security/encryption-demo"
import { AccessControl } from "@/components/security/access-control"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, FileText, Lock, Users, CheckSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useDashboard } from "../layout"

const complianceChecklist = [
  { id: 1, item: "Access Control Policies Implemented", status: "compliant" },
  { id: 2, item: "Audit Logging Enabled", status: "compliant" },
  { id: 3, item: "Data Encryption at Rest (AES-256)", status: "compliant" },
  { id: 4, item: "Data Encryption in Transit (TLS 1.3)", status: "compliant" },
  { id: 5, item: "Password Policies Enforced", status: "compliant" },
  { id: 6, item: "Session Timeout Configured", status: "compliant" },
  { id: 7, item: "Backup Procedures Documented", status: "review" },
  { id: 8, item: "Incident Response Plan", status: "compliant" },
  { id: 9, item: "User Training Completed", status: "review" },
  { id: 10, item: "Risk Assessment Updated", status: "compliant" },
]

export default function SecurityPage() {
  const { mobileMenu } = useDashboard()
  const compliantCount = complianceChecklist.filter((c) => c.status === "compliant").length
  const reviewCount = complianceChecklist.filter((c) => c.status === "review").length

  return (
    <div className="min-h-screen">
      <Header
        title="Security Center"
        description="Cybersecurity monitoring, threat detection, and compliance management"
        mobileMenu={mobileMenu}
      />

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        <Tabs defaultValue="threats" className="space-y-4 sm:space-y-6">
          {/* Scrollable tabs for mobile */}
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="inline-flex w-auto">
              <TabsTrigger value="threats" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <Shield className="size-3 sm:size-4" />
                <span className="hidden sm:inline">Threat</span> Detection
              </TabsTrigger>
              <TabsTrigger value="audit" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <FileText className="size-3 sm:size-4" />
                <span className="hidden sm:inline">Audit</span> Logs
              </TabsTrigger>
              <TabsTrigger value="encryption" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <Lock className="size-3 sm:size-4" />
                Encryption
              </TabsTrigger>
              <TabsTrigger value="access" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <Users className="size-3 sm:size-4" />
                Access
              </TabsTrigger>
              <TabsTrigger value="compliance" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <CheckSquare className="size-3 sm:size-4" />
                <span className="hidden sm:inline">Compliance</span>
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <TabsContent value="threats">
            <ThreatDashboard />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLog />
          </TabsContent>

          <TabsContent value="encryption">
            <EncryptionDemo />
          </TabsContent>

          <TabsContent value="access">
            <AccessControl />
          </TabsContent>

          <TabsContent value="compliance">
            <Card className="bg-card/50">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-base sm:text-lg">
                  <span className="flex items-center gap-2">
                    <CheckSquare className="size-4 sm:size-5 text-primary" />
                    HIPAA Compliance Checklist
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-status-online text-xs">
                      {compliantCount} Compliant
                    </Badge>
                    <Badge variant="outline" className="text-status-warning border-status-warning/30 text-xs">
                      {reviewCount} Review
                    </Badge>
                  </div>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Track compliance status for HIPAA security requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 sm:space-y-3">
                  {complianceChecklist.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-2 sm:p-4 rounded-lg border ${
                        item.status === "compliant"
                          ? "bg-status-online/5 border-status-online/30"
                          : "bg-status-warning/5 border-status-warning/30"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div
                          className={`size-5 sm:size-6 rounded-full flex items-center justify-center shrink-0 ${
                            item.status === "compliant"
                              ? "bg-status-online text-background"
                              : "bg-status-warning text-background"
                          }`}
                        >
                          {item.status === "compliant" ? (
                            <CheckSquare className="size-3 sm:size-4" />
                          ) : (
                            <span className="text-[10px] sm:text-xs font-bold">!</span>
                          )}
                        </div>
                        <span className="font-medium text-xs sm:text-sm truncate">{item.item}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`shrink-0 ml-2 text-[10px] sm:text-xs ${
                          item.status === "compliant"
                            ? "text-status-online border-status-online/30"
                            : "text-status-warning border-status-warning/30"
                        }`}
                      >
                        <span className="hidden sm:inline">{item.status === "compliant" ? "Compliant" : "Needs Review"}</span>
                        <span className="sm:hidden">{item.status === "compliant" ? "OK" : "Review"}</span>
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Best Practices */}
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg bg-secondary/30 border border-border">
                  <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Medical Device Security Best Practices</h4>
                  <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary shrink-0">1.</span>
                      <span>Network segmentation - isolate medical devices on dedicated VLANs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary shrink-0">2.</span>
                      <span>Regular firmware updates and patch management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary shrink-0">3.</span>
                      <span>Disable unnecessary ports and services on devices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary shrink-0">4.</span>
                      <span>Implement intrusion detection systems (IDS) for medical networks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary shrink-0">5.</span>
                      <span>Conduct regular vulnerability assessments and penetration testing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary shrink-0">6.</span>
                      <span>Maintain comprehensive device inventory with asset tracking</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
