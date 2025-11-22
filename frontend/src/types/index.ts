// User roles exactly as used in backend
export type UserRole = "ADMIN" | "INVENTORY_MANAGER" | "WAREHOUSE_STAFF";

// Operation type based on backend model (uppercase)
export type OperationType = "RECEIPT" | "DELIVERY" | "INTERNAL_TRANSFER" | "ADJUSTMENT";

// Operation status based on backend (only 3 statuses)
export type OperationStatus = "WAITING" | "DONE" | "CANCELED";

// Product Interface
export interface Product {
  id: string;
  name: string;
  sku: string;
  category?: string;
  uom: string;
  reorderLevel: number;
  currentStock?: number; // Calculated from Stock model
}

// Warehouse Interface
export interface Warehouse {
  id: string;
  name: string;
  code: string;
  locations?: string[];
}

// Stock Movement for Operations
export interface Operation {
  id: string;
  type: OperationType;
  status: OperationStatus;
  user?: string; // Performed by user
  supplier?: string; // For RECEIPT
  customer?: string; // For DELIVERY
  sourceWarehouse?: string;
  destinationWarehouse?: string;
  sourceLocation?: string;
  destinationLocation?: string;
  items: {
    product: string;
    quantity: number;
  }[];
  date: string;
}

// Dashboard Analytics
export interface DashboardStats {
  totalProductsInStock: number;
  lowStockCount: number;
  pendingReceipts: number;
  pendingDeliveries: number;
  pendingInternalTransfers: number;
}

// Stock Alert Table
export interface StockAlert {
  id: string;
  product: string;
  sku: string;
  currentStock: number;
  reorderLevel: number;
  warehouse?: string;
  severity: "critical" | "warning" | "low";
}

// Customer Interface
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

// Supplier Interface
export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  products?: string[];
}
