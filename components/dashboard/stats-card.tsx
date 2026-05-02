import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "success" | "warning" | "critical"
  className?: string
}

const variantStyles = {
  default: {
    icon: "bg-primary/10 text-primary",
    value: "text-foreground",
  },
  success: {
    icon: "bg-status-online/10 text-status-online",
    value: "text-status-online",
  },
  warning: {
    icon: "bg-status-warning/10 text-status-warning",
    value: "text-status-warning",
  },
  critical: {
    icon: "bg-status-critical/10 text-status-critical",
    value: "text-status-critical",
  },
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatsCardProps) {
  const styles = variantStyles[variant]

  return (
    <Card className={cn("bg-card/50", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className={cn("text-3xl font-bold font-mono", styles.value)}>
                {value}
              </span>
              {trend && (
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-status-online" : "text-status-critical"
                  )}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn("size-12 rounded-lg flex items-center justify-center", styles.icon)}>
            <Icon className="size-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
