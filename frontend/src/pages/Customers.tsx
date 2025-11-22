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
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Mail, Phone, MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const Customers = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editCustomerId, setEditCustomerId] = useState<string | null>(null);
  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // 🔹 Fetch customers
  const { data: customers, isLoading, isError } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/admin/customer", {
        withCredentials: true,
      });
      return res.data;
    },
  });

  if (isLoading) return <div>Loading customers...</div>;
  if (isError) return <div>Failed to load customers</div>;

  // 📌 Open Add Modal
  const openAddModal = () => {
    setModalMode("add");
    setEditCustomerId(null);
    setCustomerForm({ name: "", email: "", phone: "", address: "" });
    setIsModalOpen(true);
  };

  // ✏️ Open Edit Modal
  const openEditModal = (customer: any) => {
    setModalMode("edit");
    setEditCustomerId(customer._id);
    setCustomerForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });
    setIsModalOpen(true);
  };

  // 🧾 Add / Edit Handler
  const handleSubmit = async () => {
    if (!customerForm.name || !customerForm.email) {
      alert("Name and email are required!");
      return;
    }

    try {
      if (modalMode === "add") {
        await axios.post("http://localhost:8000/api/admin/customer", customerForm, { withCredentials: true });
        alert("Customer added successfully");
      } else {
        await axios.put(
          `http://localhost:8000/api/admin/customer/${editCustomerId}`,
          customerForm,
          { withCredentials: true }
        );
        alert("Customer updated successfully");
      }
      setIsModalOpen(false);
      queryClient.invalidateQueries(["customers"]);
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  // 🗑 Delete Handler
  const handleDelete = async (id: string) => {
    if (confirm("Delete this customer?")) {
      try {
        await axios.delete(`http://localhost:8000/api/admin/customer/${id}`, {
          withCredentials: true,
        });
        alert("Customer deleted");
        queryClient.invalidateQueries(["customers"]);
      } catch {
        alert("Failed to delete customer");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage customer information</p>
        </div>

        {["ADMIN", "INVENTORY_MANAGER"].includes(user?.role ?? "") && (
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
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
              {customers.map((c: any) => (
                <TableRow key={c._id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell><Mail className="inline h-4 w-4 mr-2" /> {c.email}</TableCell>
                  <TableCell><Phone className="inline h-4 w-4 mr-2" /> {c.phone}</TableCell>
                  <TableCell><MapPin className="inline h-4 w-4 mr-2" /> {c.address}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {["ADMIN", "INVENTORY_MANAGER"].includes(user?.role ?? "") && (
                        <Button variant="ghost" size="icon" onClick={() => openEditModal(c)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}

                      {user?.role === "ADMIN" && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(c._id)}>
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

      {/* Customer Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalMode === "add" ? "Add Customer" : "Edit Customer"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input placeholder="Name *" value={customerForm.name} onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })} />
            <Input placeholder="Email *" value={customerForm.email} onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })} />
            <Input placeholder="Phone" value={customerForm.phone} onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })} />
            <Input placeholder="Address" value={customerForm.address} onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })} />
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

export default Customers;
