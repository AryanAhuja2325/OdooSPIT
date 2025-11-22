import { StatCard } from "@/components/dashboard/StatCard";
import { StockAlertsTable } from "@/components/dashboard/StockAlertsTable";
import { dashboardStats, stockAlerts } from "@/lib/mockData";
import { Package, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your inventory management system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Products in Stock"
          value={dashboardStats.totalProducts}
          icon={Package}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Low Stock / Out of Stock"
          value={dashboardStats.lowStock}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Pending Receipts"
          value={dashboardStats.pendingReceipts}
          icon={ArrowDownToLine}
        />
        <StatCard
          title="Pending Deliveries"
          value={dashboardStats.pendingDeliveries}
          icon={ArrowUpFromLine}
        />
        <StatCard
          title="Internal Transfers"
          value={dashboardStats.internalTransfers}
          icon={ArrowLeftRight}
        />
      </div>

      <StockAlertsTable alerts={stockAlerts} />
    </div>
  );
};

export default Dashboard;
