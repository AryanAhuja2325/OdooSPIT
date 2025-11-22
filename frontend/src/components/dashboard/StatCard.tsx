import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "warning" | "success";
}

export const StatCard = ({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) => {
  const variantStyles = {
    default: "border-l-primary",
    warning: "border-l-warning",
    success: "border-l-success",
  };

  return (
    <Card className={cn("border-l-4 p-6", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-card-foreground">{value}</p>
          {trend && (
            <p className={cn(
              "text-sm font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}% from last month
            </p>
          )}
        </div>
        <div className={cn(
          "rounded-lg p-3",
          variant === "warning" ? "bg-warning/10" : variant === "success" ? "bg-success/10" : "bg-primary/10"
        )}>
          <Icon className={cn(
            "h-6 w-6",
            variant === "warning" ? "text-warning" : variant === "success" ? "text-success" : "text-primary"
          )} />
        </div>
      </div>
    </Card>
  );
};
