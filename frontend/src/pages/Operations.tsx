import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { operations } from "@/lib/mockData";
import { Operation, OperationStatus, OperationType } from "@/types";
import { Plus, Filter } from "lucide-react";

const getStatusBadge = (status: OperationStatus) => {
  const variants = {
    pending: { variant: "secondary" as const, label: "Pending", className: "" },
    in_progress: { variant: "default" as const, label: "In Progress", className: "bg-info text-info-foreground" },
    completed: { variant: "default" as const, label: "Completed", className: "bg-success text-success-foreground" },
    cancelled: { variant: "destructive" as const, label: "Cancelled", className: "" },
  };

  const config = variants[status];
  return (
    <Badge variant={config.variant} className={config.className || undefined}>
      {config.label}
    </Badge>
  );
};

const getTypeBadge = (type: OperationType) => {
  const labels = {
    receipt: "Receipt",
    delivery: "Delivery",
    internal_transfer: "Transfer",
    adjustment: "Adjustment",
  };

  return <Badge variant="outline">{labels[type]}</Badge>;
};

const Operations = () => {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredOperations = operations.filter((op) => {
    if (filterType !== "all" && op.type !== filterType) return false;
    if (filterStatus !== "all" && op.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Operations</h1>
          <p className="text-muted-foreground">Manage inventory operations</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Operation
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Operations</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="receipt">Receipt</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="internal_transfer">Transfer</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOperations.map((operation) => (
                <TableRow key={operation.id}>
                  <TableCell className="font-medium">{operation.id}</TableCell>
                  <TableCell>{getTypeBadge(operation.type)}</TableCell>
                  <TableCell>{operation.productName}</TableCell>
                  <TableCell>{operation.quantity}</TableCell>
                  <TableCell>{operation.warehouse}</TableCell>
                  <TableCell>{operation.date}</TableCell>
                  <TableCell>{operation.reference}</TableCell>
                  <TableCell>{getStatusBadge(operation.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Operations;
