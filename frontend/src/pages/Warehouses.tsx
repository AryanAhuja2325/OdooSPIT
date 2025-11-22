import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, MapPin, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

const Warehouses = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editWarehouseId, setEditWarehouseId] = useState<string | null>(null);

  const [warehouseForm, setWarehouseForm] = useState({
    name: "",
    code: "",
    locations: "", // comma separated
  });

  // Fetch warehouses
  const { data: warehouses, isLoading, isError } = useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/warehouse", { withCredentials: true });
      return res.data;
    },
  });

  if (isLoading) return <div>Loading warehouses...</div>;
  if (isError) return <div>Failed to load warehouses.</div>;

  // Open Add Modal
  const openAddModal = () => {
    setModalMode("add");
    setEditWarehouseId(null);
    setWarehouseForm({ name: "", code: "", locations: "" });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (warehouse: any) => {
    setModalMode("edit");
    setEditWarehouseId(warehouse._id);
    setWarehouseForm({
      name: warehouse.name,
      code: warehouse.code,
      locations: warehouse.locations?.join(", ") || "",
    });
    setIsModalOpen(true);
  };

  // Add / Edit handler
  const handleSubmit = async () => {
    if (!warehouseForm.name || !warehouseForm.code || !warehouseForm.locations) {
      alert("Name, Code and at least one Location are required!");
      return;
    }

    const payload = {
      name: warehouseForm.name,
      code: warehouseForm.code,
      locations: warehouseForm.locations.split(",").map((loc) => loc.trim()),
    };

    try {
      if (modalMode === "add") {
        await axios.post("http://localhost:8000/api/warehouse", payload, { withCredentials: true });
        alert("Warehouse added successfully");
      } else {
        await axios.put(`http://localhost:8000/api/warehouse/${editWarehouseId}`, payload, { withCredentials: true });
        alert("Warehouse updated successfully");
      }

      setIsModalOpen(false);
      queryClient.invalidateQueries(["warehouses"]);
    } catch (err: any) {
      alert(err.response?.data?.error || "Error occurred");
    }
  };

  // Delete warehouse
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this warehouse?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/warehouse/${id}`, { withCredentials: true });
      alert("Warehouse deleted");
      queryClient.invalidateQueries(["warehouses"]);
    } catch {
      alert("Failed to delete warehouse");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Warehouses</h1>
          <p className="text-muted-foreground">Manage warehouse locations</p>
        </div>

        {["ADMIN", "INVENTORY_MANAGER"].includes(user?.role ?? "") && (
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Warehouse
          </Button>
        )}
      </div>

      {/* Warehouse Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {warehouses.map((warehouse: any) => {
          const totalStock = warehouse.stockSum ?? 0;
          const capacity = totalStock + 1000; // assumed capacity
          const utilizationPercent = capacity > 0 ? (totalStock / capacity) * 100 : 0;

          return (
            <Card key={warehouse._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {warehouse.name}{" "}
                      <span className="text-sm text-muted-foreground">
                        ({warehouse.code})
                      </span>
                    </CardTitle>

                    {/* Display warehouse locations */}
                    <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {warehouse.locations.length
                        ? warehouse.locations.join(", ")
                        : "No locations added"}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {["ADMIN", "INVENTORY_MANAGER"].includes(user?.role ?? "") && (
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(warehouse)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}

                    {user?.role === "ADMIN" && (
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(warehouse._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Capacity Utilization</span>
                    <span className="font-medium">{utilizationPercent.toFixed(1)}%</span>
                  </div>
                  <Progress value={utilizationPercent} />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Current Stock</div>
                    <div className="text-2xl font-bold">{totalStock}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Capacity</div>
                    <div className="text-2xl font-bold">{capacity}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modalMode === "add" ? "Add Warehouse" : "Edit Warehouse"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Warehouse Name *"
              value={warehouseForm.name}
              onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
            />

            <Input
              placeholder="Warehouse Code *"
              value={warehouseForm.code}
              onChange={(e) => setWarehouseForm({ ...warehouseForm, code: e.target.value })}
            />

            <Input
              placeholder="Locations (comma separated) *"
              value={warehouseForm.locations}
              onChange={(e) => setWarehouseForm({ ...warehouseForm, locations: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{modalMode === "add" ? "Add" : "Update"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Warehouses;
