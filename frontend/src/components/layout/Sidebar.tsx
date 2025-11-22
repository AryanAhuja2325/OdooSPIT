import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import { 
  LayoutDashboard, 
  Package, 
  ArrowLeftRight, 
  Warehouse, 
  Users, 
  TruckIcon,
  X
} from "lucide-react";

interface SidebarProps {
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

const getNavItems = (role: UserRole) => {
  const baseItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "inventory_manager", "warehouse_staff"] },
    { to: "/operations", label: "Operations", icon: ArrowLeftRight, roles: ["admin", "inventory_manager", "warehouse_staff"] },
  ];

  const managementItems = [
    { to: "/products", label: "Products", icon: Package, roles: ["admin", "inventory_manager"] },
    { to: "/warehouses", label: "Warehouses", icon: Warehouse, roles: ["admin", "inventory_manager"] },
    { to: "/customers", label: "Customers", icon: Users, roles: ["admin", "inventory_manager"] },
    { to: "/suppliers", label: "Suppliers", icon: TruckIcon, roles: ["admin", "inventory_manager"] },
  ];

  return [...baseItems, ...managementItems].filter(item => 
    item.roles.includes(role)
  );
};

export const Sidebar = ({ userRole, isOpen, onClose }: SidebarProps) => {
  const navItems = getNavItems(userRole);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-sidebar transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-sidebar-primary" />
              <span className="text-lg font-semibold text-sidebar-foreground">IMS</span>
            </div>
            <button
              onClick={onClose}
              className="text-sidebar-foreground lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <div className="text-xs text-sidebar-foreground/70">
              Role: <span className="font-medium text-sidebar-foreground capitalize">{userRole.replace("_", " ")}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
