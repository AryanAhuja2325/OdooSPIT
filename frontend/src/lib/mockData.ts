import { DashboardStats, StockAlert, Operation, Product, Warehouse, Customer, Supplier } from "@/types";

export const dashboardStats: DashboardStats = {
  totalProducts: 1248,
  lowStock: 23,
  pendingReceipts: 12,
  pendingDeliveries: 8,
  internalTransfers: 5,
};

export const stockAlerts: StockAlert[] = [
  {
    id: "1",
    productName: "Laptop Dell XPS 15",
    sku: "LAP-001",
    currentStock: 2,
    reorderLevel: 10,
    warehouse: "Main Warehouse",
    severity: "critical",
  },
  {
    id: "2",
    productName: "Wireless Mouse Logitech",
    sku: "MOU-023",
    currentStock: 5,
    reorderLevel: 15,
    warehouse: "Branch A",
    severity: "critical",
  },
  {
    id: "3",
    productName: "USB-C Cable 2m",
    sku: "CAB-045",
    currentStock: 18,
    reorderLevel: 25,
    warehouse: "Main Warehouse",
    severity: "warning",
  },
  {
    id: "4",
    productName: "Keyboard Mechanical RGB",
    sku: "KEY-012",
    currentStock: 8,
    reorderLevel: 12,
    warehouse: "Branch B",
    severity: "warning",
  },
  {
    id: "5",
    productName: "Monitor 27 inch",
    sku: "MON-034",
    currentStock: 22,
    reorderLevel: 30,
    warehouse: "Main Warehouse",
    severity: "low",
  },
];

export const operations: Operation[] = [
  {
    id: "OP-001",
    type: "receipt",
    status: "pending",
    warehouse: "Main Warehouse",
    productName: "Laptop Dell XPS 15",
    quantity: 50,
    date: "2025-11-22",
    reference: "PO-2024-001",
  },
  {
    id: "OP-002",
    type: "delivery",
    status: "in_progress",
    warehouse: "Branch A",
    productName: "Wireless Mouse Logitech",
    quantity: 100,
    date: "2025-11-21",
    reference: "SO-2024-045",
  },
  {
    id: "OP-003",
    type: "internal_transfer",
    status: "pending",
    warehouse: "Main Warehouse → Branch B",
    productName: "USB-C Cable 2m",
    quantity: 75,
    date: "2025-11-23",
    reference: "TR-2024-012",
  },
  {
    id: "OP-004",
    type: "adjustment",
    status: "completed",
    warehouse: "Branch A",
    productName: "Keyboard Mechanical RGB",
    quantity: -5,
    date: "2025-11-20",
    reference: "ADJ-2024-003",
  },
  {
    id: "OP-005",
    type: "receipt",
    status: "completed",
    warehouse: "Main Warehouse",
    productName: "Monitor 27 inch",
    quantity: 30,
    date: "2025-11-19",
    reference: "PO-2024-002",
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Laptop Dell XPS 15",
    sku: "LAP-001",
    category: "Electronics",
    quantity: 2,
    reorderLevel: 10,
    unitPrice: 1299.99,
    warehouse: "Main Warehouse",
  },
  {
    id: "2",
    name: "Wireless Mouse Logitech",
    sku: "MOU-023",
    category: "Electronics",
    quantity: 5,
    reorderLevel: 15,
    unitPrice: 29.99,
    warehouse: "Branch A",
  },
  {
    id: "3",
    name: "USB-C Cable 2m",
    sku: "CAB-045",
    category: "Accessories",
    quantity: 150,
    reorderLevel: 25,
    unitPrice: 12.99,
    warehouse: "Main Warehouse",
  },
  {
    id: "4",
    name: "Keyboard Mechanical RGB",
    sku: "KEY-012",
    category: "Electronics",
    quantity: 8,
    reorderLevel: 12,
    unitPrice: 89.99,
    warehouse: "Branch B",
  },
];

export const warehouses: Warehouse[] = [
  {
    id: "1",
    name: "Main Warehouse",
    location: "New York, NY",
    capacity: 10000,
    currentStock: 7842,
  },
  {
    id: "2",
    name: "Branch A",
    location: "Los Angeles, CA",
    capacity: 5000,
    currentStock: 3215,
  },
  {
    id: "3",
    name: "Branch B",
    location: "Chicago, IL",
    capacity: 7500,
    currentStock: 4891,
  },
];

export const customers: Customer[] = [
  {
    id: "1",
    name: "Tech Solutions Inc",
    email: "contact@techsolutions.com",
    phone: "+1 555-0100",
    address: "123 Business Ave, New York, NY 10001",
  },
  {
    id: "2",
    name: "Digital Innovations Ltd",
    email: "info@digitalinnov.com",
    phone: "+1 555-0200",
    address: "456 Commerce St, Los Angeles, CA 90001",
  },
];

export const suppliers: Supplier[] = [
  {
    id: "1",
    name: "Global Tech Supplies",
    email: "orders@globaltech.com",
    phone: "+1 555-0300",
    products: ["Laptops", "Monitors", "Accessories"],
  },
  {
    id: "2",
    name: "Office Equipment Pro",
    email: "sales@officeequip.com",
    phone: "+1 555-0400",
    products: ["Keyboards", "Mice", "Cables"],
  },
];
