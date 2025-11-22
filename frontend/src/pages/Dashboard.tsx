import { StatCard } from "@/components/dashboard/StatCard";
import { StockAlertsTable } from "@/components/dashboard/StockAlertsTable";
import { Package, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/analytics", {
        withCredentials: true,
      });
      return res.data;
    },
  });

  if (isLoading) return <div>Loading dashboard...</div>;
  if (isError) return <div>Failed to load analytics.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your inventory management system</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Products in Stock"
          value={data.totalProductsInStock}
          icon={Package}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Low Stock / Out of Stock"
          value={data.lowStockCount}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard title="Pending Receipts" value={data.pendingReceipts} icon={ArrowDownToLine} />
        <StatCard title="Pending Deliveries" value={data.pendingDeliveries} icon={ArrowUpFromLine} />
        <StatCard title="Internal Transfers" value={data.pendingInternalTransfers} icon={ArrowLeftRight} />
      </div>

      {/* Stock Alerts */}
      <StockAlertsTable alerts={data.lowStockItems} />
    </div>
  );
};

export default Dashboard;
