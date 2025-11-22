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
import { Input } from "@/components/ui/input";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const Products = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editProductId, setEditProductId] = useState<string | null>(null);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    sku: "",
    category: "",
    uom: "",
    reorderLevel: 1,
  });

  // Fetch products
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/product", {
        withCredentials: true,
      });
      return res.data;
    },
  });

  if (isLoading) return <div>Loading products...</div>;
  if (isError) return <div>Failed to load products.</div>;

  const filteredProducts = products.filter(
    (product: any) =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockStatus = (product: any) => {
    if (!product.totalStock) return <Badge>Not Available</Badge>;

    if (product.totalStock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (product.totalStock <= product.reorderLevel)
      return <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>;
    return <Badge className="bg-success text-success-foreground">In Stock</Badge>;
  };

  const openEditModal = (product: any) => {
    setModalMode("edit");
    setEditProductId(product._id);
    setProductForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      uom: product.uom,
      reorderLevel: product.reorderLevel,
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setModalMode("add");
    setEditProductId(null);
    setProductForm({
      name: "",
      sku: "",
      category: "",
      uom: "",
      reorderLevel: 1,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!productForm.name || !productForm.sku || !productForm.uom) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      if (modalMode === "add") {
        await axios.post("http://localhost:8000/api/product", productForm, { withCredentials: true });
        alert("Product added successfully!");
      } else {
        await axios.put(`http://localhost:8000/api/product/${editProductId}`, productForm, {
          withCredentials: true,
        });
        alert("Product updated successfully!");
      }

      setIsModalOpen(false);
      queryClient.invalidateQueries(["products"]);
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:8000/api/product/${id}`, { withCredentials: true });
        alert("Product deleted");
        queryClient.invalidateQueries(["products"]);
      } catch {
        alert("Failed to delete product");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>

        {["ADMIN", "INVENTORY_MANAGER"].includes(user?.role ?? "") && (
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        )}
      </div>

      {/* Product Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>All Products</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>UOM</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Total Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredProducts.map((product: any) => (
                <TableRow key={product._id}>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category || "N/A"}</TableCell>
                  <TableCell>{product.uom}</TableCell>
                  <TableCell>{product.reorderLevel}</TableCell>
                  <TableCell>
                    {product.totalStock}
                  </TableCell>
                  <TableCell>{getStockStatus(product)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {["ADMIN", "INVENTORY_MANAGER"].includes(user?.role ?? "") && (
                        <Button variant="ghost" size="icon" onClick={() => openEditModal(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}

                      {["ADMIN"].includes(user?.role ?? "") && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product._id)}>
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

      {/* PRODUCT MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalMode === "add" ? "Add New Product" : "Edit Product"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input placeholder="Product Name *" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
            <Input placeholder="SKU *" value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} disabled={modalMode === "edit"} />
            <Input placeholder="Category" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} />
            <Input placeholder="Unit of Measure (UOM) *" value={productForm.uom} onChange={(e) => setProductForm({ ...productForm, uom: e.target.value })} />
            <Input type="number" placeholder="Reorder Level" value={productForm.reorderLevel} min={1} onChange={(e) => setProductForm({ ...productForm, reorderLevel: Number(e.target.value) })} />
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{modalMode === "add" ? "Create Product" : "Update Product"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
