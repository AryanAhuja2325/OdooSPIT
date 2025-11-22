import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Mail, Phone, Pencil, Trash2, MapPin } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const Suppliers = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editSupplierId, setEditSupplierId] = useState<string | null>(null);

  // Supplier Form State
  const [supplierForm, setSupplierForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Fetch Suppliers
  const { data: suppliers, isLoading, isError } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/admin/supplier", {
        withCredentials: true,
      });
      return res.data;
    },
  });

  if (isLoading) return <div>Loading suppliers...</div>;
  if (isError) return <div>Failed to load suppliers</div>;

  // Open Add Modal
  const openAddModal = () => {
    setModalMode("add");
    setEditSupplierId(null);
    setSupplierForm({ name: "", email: "", phone: "", address: "" });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (supplier: any) => {
    setModalMode("edit");
    setEditSupplierId(supplier._id);
    setSupplierForm({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address ?? "",
    });
    setIsModalOpen(true);
  };

  // Add / Update Supplier
  const handleSubmit = async () => {
    if (!supplierForm.name || !supplierForm.email) {
      alert("Name and Email are required!");
      return;
    }

    try {
      if (modalMode === "add") {
        await axios.post("http://localhost:8000/api/admin/supplier", supplierForm, {
          withCredentials: true,
        });
        alert("Supplier added successfully");
      } else {
        await axios.put(
          `http://localhost:8000/api/admin/supplier/${editSupplierId}`,
          supplierForm,
          { withCredentials: true }
        );
        alert("Supplier updated successfully");
      }

      setIsModalOpen(false);
      queryClient.invalidateQueries(["suppliers"]);
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  // Delete Supplier
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      try {
        await axios.delete(`http://localhost:8000/api/admin/supplier/${id}`, {
          withCredentials: true,
        });
        alert("Supplier deleted");
        queryClient.invalidateQueries(["suppliers"]);
      } catch {
        alert("Failed to delete supplier");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Suppliers</h1>
          <p className="text-muted-foreground">Manage supplier information</p>
        </div>

        {["ADMIN", "INVENTORY_MANAGER"].includes(user?.role ?? "") && (
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        )}
      </div>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {suppliers.map((supplier: any) => (
                <TableRow key={supplier._id}>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>
                    <Mail className="inline h-4 w-4 mr-2 text-muted-foreground" />
                    {supplier.email}
                  </TableCell>
                  <TableCell>
                    <Phone className="inline h-4 w-4 mr-2 text-muted-foreground" />
                    {supplier.phone}
                  </TableCell>
                  <TableCell>
                    <MapPin className="inline h-4 w-4 mr-2 text-muted-foreground" />
                    {supplier.address || "N/A"}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      {["ADMIN", "INVENTORY_MANAGER"].includes(user?.role ?? "") && (
                        <Button variant="ghost" size="icon" onClick={() => openEditModal(supplier)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}

                      {user?.role === "ADMIN" && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(supplier._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalMode === "add" ? "Add Supplier" : "Edit Supplier"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input placeholder="Supplier Name *" value={supplierForm.name} onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })} />
            <Input placeholder="Email *" value={supplierForm.email} onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })} />
            <Input placeholder="Phone" value={supplierForm.phone} onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })} />
            <Input placeholder="Address" value={supplierForm.address} onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })} />
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {modalMode === "add" ? "Add" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Suppliers;
