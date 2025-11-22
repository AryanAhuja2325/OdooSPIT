import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Operation, OperationStatus, OperationType, UserRole } from "@/types";
import { Plus, Filter, Info } from "lucide-react";

// Status Badge
const getStatusBadge = (status: OperationStatus) => {
  const mapping = {
    WAITING: { variant: "secondary", label: "Waiting" },
    DONE: { variant: "default", label: "Completed", className: "bg-success text-success-foreground" },
    CANCELED: { variant: "destructive", label: "Cancelled" },
  };
  const config = mapping[status];
  return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
};

// Type Badge
const getTypeBadge = (type: OperationType) => {
  const label = {
    RECEIPT: "Receipt",
    DELIVERY: "Delivery",
    INTERNAL_TRANSFER: "Internal Transfer",
    ADJUSTMENT: "Adjustment",
  }[type];
  return <Badge variant="outline">{label}</Badge>;
};

const Operations = () => {
  const { user } = useAuth();
  const userRole = user?.role as UserRole;

  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newOperation, setNewOperation] = useState({
    type: "RECEIPT",
    product: "",
    quantity: 1,
    warehouse: "",
    location: "",
    sourceWarehouse: "",
    sourceLocation: "",
    destinationWarehouse: "",
    destinationLocation: "",
    supplier: "",
    customer: "",
  });

  // Fetch DB Data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["operations"],
    queryFn: async () => (await axios.get("http://localhost:8000/api/operations", { withCredentials: true })).data,
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => (await axios.get("http://localhost:8000/api/product", { withCredentials: true })).data,
  });

  const { data: warehouses } = useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => (await axios.get("http://localhost:8000/api/warehouse", { withCredentials: true })).data,
  });

  const { data: suppliers } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => (await axios.get("http://localhost:8000/api/admin/supplier", { withCredentials: true })).data,
  });

  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => (await axios.get("http://localhost:8000/api/admin/customer", { withCredentials: true })).data,
  });

  if (isLoading) return <div>Loading operations...</div>;
  if (isError) return <div>Failed to load operations</div>;

  const filteredOperations = data.filter((op: Operation) => {
    if (filterType !== "all" && op.type !== filterType) return false;
    if (filterStatus !== "all" && op.status !== filterStatus) return false;
    return true;
  });

  const handleProcess = async (id: string) => {
    try {
      await axios.put(`http://localhost:8000/api/operations/${id}/process`, {}, { withCredentials: true });
      alert("Operation processed successfully");
      window.location.reload();
    } catch {
      alert("Failed to process operation");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await axios.put(`http://localhost:8000/api/operations/${id}/cancel`, {}, { withCredentials: true });
      alert("Operation cancelled");
      window.location.reload();
    } catch {
      alert("Failed to cancel operation");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Operations</h1>
          <p className="text-muted-foreground">Manage and track inventory operations efficiently</p>
        </div>
        {["ADMIN", "INVENTORY_MANAGER"].includes(userRole) && (
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Operation
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="border-b pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl font-semibold">All Operations</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="RECEIPT">Receipt</SelectItem>
                  <SelectItem value="DELIVERY">Delivery</SelectItem>
                  <SelectItem value="INTERNAL_TRANSFER">Transfer</SelectItem>
                  <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="WAITING">Waiting</SelectItem>
                  <SelectItem value="DONE">Completed</SelectItem>
                  <SelectItem value="CANCELED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        {/* Table */}
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOperations.map((op: Operation) => (
                <TableRow key={op._id} className="hover:bg-muted/40 transition">
                  <TableCell>{getTypeBadge(op.type)}</TableCell>
                  <TableCell>{getStatusBadge(op.status)}</TableCell>
                  <TableCell>{op.user?.name || "N/A"}</TableCell>
                  <TableCell>{new Date(op.createdAt).toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedOperation(op)}>
                        <Info className="h-4 w-4" />
                      </Button>
                      {["ADMIN", "INVENTORY_MANAGER"].includes(userRole) && op.status === "WAITING" && (
                        <>
                          <Button size="sm" onClick={() => handleProcess(op._id)}>Process</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleCancel(op._id)}>Cancel</Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Operation Details Modal */}
      {selectedOperation && (
        <Dialog open onOpenChange={() => setSelectedOperation(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Operation Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>ID:</span><span>{selectedOperation._id}</span></div>
              <div className="flex justify-between"><span>Type:</span><span>{selectedOperation.type}</span></div>
              <div className="flex justify-between"><span>Status:</span><span>{selectedOperation.status}</span></div>
              <div className="flex justify-between"><span>Created By:</span><span>{selectedOperation.user?.name}</span></div>

              {selectedOperation.supplier && (
                <div className="flex justify-between">
                  <span>Supplier:</span>
                  <span>{selectedOperation.supplier.name} ({selectedOperation.supplier.email})</span>
                </div>
              )}

              {selectedOperation.customer && (
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span>{selectedOperation.customer.name} ({selectedOperation.customer.email})</span>
                </div>
              )}

              {(selectedOperation.sourceWarehouse || selectedOperation.sourceLocation) && (
                <div className="flex justify-between">
                  <span>Source:</span>
                  <span>{selectedOperation.sourceWarehouse.name} → {selectedOperation.sourceLocation}</span>
                </div>
              )}

              {(selectedOperation.destinationWarehouse || selectedOperation.destinationLocation) && (
                <div className="flex justify-between">
                  <span>Destination:</span>
                  <span>{selectedOperation.destinationWarehouse.name} → {selectedOperation.destinationLocation}</span>
                </div>
              )}

              <div>
                <span className="font-medium">Items:</span>
                <ul className="ml-5 list-disc">
                  {selectedOperation.items.map((item, index) => (
                    <li key={index}>
                      {item.product?.name ?? "N/A"}
                      {item.product?.sku ? ` (${item.product.sku})` : ""} — Qty: {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between">
                <span>Created At:</span><span>{new Date(selectedOperation.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Updated At:</span><span>{new Date(selectedOperation.updatedAt).toLocaleString()}</span>
              </div>
            </div>

            <DialogFooter>
              <Button variant="secondary" onClick={() => setSelectedOperation(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Operation Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Operation</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Select value={newOperation.type} onValueChange={(value) => setNewOperation({ ...newOperation, type: value })}>
              <SelectTrigger><SelectValue placeholder="Select Operation Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="RECEIPT">Receipt</SelectItem>
                <SelectItem value="DELIVERY">Delivery</SelectItem>
                <SelectItem value="INTERNAL_TRANSFER">Internal Transfer</SelectItem>
                <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
              </SelectContent>
            </Select>

            <Select value={newOperation.product} onValueChange={(value) => setNewOperation({ ...newOperation, product: value })}>
              <SelectTrigger><SelectValue placeholder="Select Product" /></SelectTrigger>
              <SelectContent>
                {products?.map((p) => (
                  <SelectItem key={p._id} value={p._id}>{p.name} ({p.sku})</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <input
              type="number"
              min={1}
              className="border rounded px-3 py-2 w-full"
              value={newOperation.quantity}
              onChange={(e) => setNewOperation({ ...newOperation, quantity: Number(e.target.value) })}
            />

            {newOperation.type === "INTERNAL_TRANSFER" ? (
              <>
                <Select value={newOperation.sourceWarehouse} onValueChange={(value) => setNewOperation({ ...newOperation, sourceWarehouse: value })}>
                  <SelectTrigger><SelectValue placeholder="Select Source Warehouse" /></SelectTrigger>
                  <SelectContent>
                    {warehouses?.map((w) => <SelectItem key={w._id} value={w._id}>{w.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <input
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Source Location"
                  value={newOperation.sourceLocation}
                  onChange={(e) => setNewOperation({ ...newOperation, sourceLocation: e.target.value })}
                />

                <Select value={newOperation.destinationWarehouse} onValueChange={(value) => setNewOperation({ ...newOperation, destinationWarehouse: value })}>
                  <SelectTrigger><SelectValue placeholder="Select Destination Warehouse" /></SelectTrigger>
                  <SelectContent>
                    {warehouses?.map((w) => <SelectItem key={w._id} value={w._id}>{w.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <input
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Destination Location"
                  value={newOperation.destinationLocation}
                  onChange={(e) => setNewOperation({ ...newOperation, destinationLocation: e.target.value })}
                />
              </>
            ) : (
              <>
                <Select value={newOperation.warehouse} onValueChange={(value) => setNewOperation({ ...newOperation, warehouse: value })}>
                  <SelectTrigger><SelectValue placeholder="Select Warehouse" /></SelectTrigger>
                  <SelectContent>
                    {warehouses?.map((w) => <SelectItem key={w._id} value={w._id}>{w.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <input
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Location"
                  value={newOperation.location}
                  onChange={(e) => setNewOperation({ ...newOperation, location: e.target.value })}
                />
              </>
            )}

            {newOperation.type === "RECEIPT" && (
              <Select value={newOperation.supplier} onValueChange={(value) => setNewOperation({ ...newOperation, supplier: value })}>
                <SelectTrigger><SelectValue placeholder="Select Supplier" /></SelectTrigger>
                <SelectContent>
                  {suppliers?.map((s) => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}

            {newOperation.type === "DELIVERY" && (
              <Select value={newOperation.customer} onValueChange={(value) => setNewOperation({ ...newOperation, customer: value })}>
                <SelectTrigger><SelectValue placeholder="Select Customer" /></SelectTrigger>
                <SelectContent>
                  {customers?.map((c) => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button
              onClick={async () => {
                try {
                  await axios.post("http://localhost:8000/api/operations", {
                    type: newOperation.type,
                    sourceWarehouse: newOperation.type === "INTERNAL_TRANSFER" || newOperation.type === "DELIVERY" ? newOperation.sourceWarehouse : undefined,
                    destinationWarehouse: newOperation.type === "INTERNAL_TRANSFER" || newOperation.type === "RECEIPT" ? newOperation.destinationWarehouse : undefined,
                    sourceLocation: newOperation.sourceLocation,
                    destinationLocation: newOperation.destinationLocation,
                    supplier: newOperation.type === "RECEIPT" ? newOperation.supplier : undefined,
                    customer: newOperation.type === "DELIVERY" ? newOperation.customer : undefined,
                    items: [{ product: newOperation.product, quantity: newOperation.quantity }],
                  }, { withCredentials: true });

                  alert("Operation created successfully");
                  window.location.reload();
                } catch (err) {
                  console.error(err);
                  alert("Failed to create operation");
                }
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Operations;
