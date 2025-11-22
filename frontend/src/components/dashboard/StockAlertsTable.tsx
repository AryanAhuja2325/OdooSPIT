import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StockAlert } from "@/types";
import { AlertTriangle } from "lucide-react";

interface StockAlertsTableProps {
  alerts: StockAlert[];
}

const getSeverityBadge = (severity: StockAlert["severity"]) => {
  const variants = {
    critical: { variant: "destructive" as const, label: "Critical", className: "" },
    warning: { variant: "default" as const, label: "Warning", className: "bg-warning text-warning-foreground" },
    low: { variant: "secondary" as const, label: "Low", className: "" },
  };

  const config = variants[severity];
  return (
    <Badge variant={config.variant} className={config.className || undefined}>
      {config.label}
    </Badge>
  );
};

export const StockAlertsTable = ({ alerts }: StockAlertsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <CardTitle>Stock Alerts</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Reorder Level</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell className="font-medium">{alert.productName}</TableCell>
                <TableCell>{alert.sku}</TableCell>
                <TableCell>{alert.currentStock}</TableCell>
                <TableCell>{alert.reorderLevel}</TableCell>
                <TableCell>{alert.warehouse}</TableCell>
                <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
