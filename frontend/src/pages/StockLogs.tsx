import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
    TableBody,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const StockLogs = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");

    const { data: logs, isLoading, isError } = useQuery({
        queryKey: ["stockLogs"],
        queryFn: async () => {
            const res = await axios.get("http://localhost:8000/api/stock/stock-logs", {
                withCredentials: true,
            });
            return res.data;
        },
    });

    if (!["ADMIN", "INVENTORY_MANAGER", "WAREHOUSE_STAFF"].includes(user?.role ?? "")) {
        return <div>You do not have permission to view stock logs.</div>;
    }

    if (isLoading) return <div>Loading stock logs...</div>;
    if (isError) return <div>Failed to fetch stock logs.</div>;

    // Sort latest first
    const sortedLogs = [...logs].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Filter logs
    const filteredLogs = sortedLogs.filter((log) => {
        const matchesType = filterType === "all" || log.type === filterType;

        const warehouseSearch =
            (log?.fromWarehouse || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (log?.toWarehouse || "").toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSearch =
            log?.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log?.product?.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            warehouseSearch;

        return matchesType && matchesSearch;
    });

    // Badge based on type
    const getTypeBadge = (type) => {
        if (type === "RECEIPT") return <Badge className="bg-success text-success-foreground">RECEIPT</Badge>;
        if (type === "DELIVERY") return <Badge variant="destructive">DELIVERY</Badge>;
        if (type === "INTERNAL_TRANSFER") return <Badge variant="secondary">TRANSFER</Badge>;
        return <Badge>UNKNOWN</Badge>;
    };

    // Get warehouse/location dynamically
    const getWarehouseLocation = (log) => {
        if (log.type === "RECEIPT") return `${log.toWarehouse} (${log.toLocation})`;
        if (log.type === "DELIVERY") return `${log.fromWarehouse} (${log.fromLocation})`;
        if (log.type === "INTERNAL_TRANSFER")
            return `From: ${log.fromWarehouse} (${log.fromLocation}) → To: ${log.toWarehouse} (${log.toLocation})`;
        return "N/A";
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Stock Logs</h1>
            <p className="text-muted-foreground">Track stock movement history</p>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <CardTitle>All Stock Logs</CardTitle>

                        {/* Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="border rounded px-2 py-1"
                            >
                                <option value="all">All Types</option>
                                <option value="RECEIPT">Receipt</option>
                                <option value="DELIVERY">Delivery</option>
                                <option value="INTERNAL_TRANSFER">Internal Transfer</option>
                            </select>
                        </div>

                        {/* Search */}
                        <Input
                            placeholder="Search by product / warehouse..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="sm:w-64"
                        />
                    </div>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Qty</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Operation ID</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredLogs.map((log) => (
                                <TableRow key={log._id}>
                                    <TableCell>{log.product.name} ({log.product.sku})</TableCell>
                                    <TableCell>{log.quantity}</TableCell>
                                    <TableCell>{getTypeBadge(log.type)}</TableCell>
                                    <TableCell>{log.operationId?._id || "N/A"}</TableCell>
                                    <TableCell>{log.user?.name}</TableCell>
                                    <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredLogs.length === 0 && (
                        <div className="py-4 text-center text-muted-foreground">No stock logs found.</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default StockLogs;
