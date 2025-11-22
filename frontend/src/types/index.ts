export type UserRole = "admin" | "inventory_manager" | "warehouse_staff" | "assistant";

export type OperationType = "receipt" | "delivery" | "internal_transfer" | "adjustment";

export type OperationStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  unitPrice: number;
  warehouse: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentStock: number;
}

export interface Operation {
  id: string;
  type: OperationType;
  status: OperationStatus;
  warehouse: string;
  productName: string;
  quantity: number;
  date: string;
  reference?: string;
}

export interface DashboardStats {
  totalProducts: number;
  lowStock: number;
  pendingReceipts: number;
  pendingDeliveries: number;
  internalTransfers: number;
}

export interface StockAlert {
  id: string;
  productName: string;
  sku: string;
  currentStock: number;
  reorderLevel: number;
  warehouse: string;
  severity: "critical" | "warning" | "low";
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  products: string[];
}
