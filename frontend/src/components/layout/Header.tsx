import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Menu, User } from "lucide-react";

interface HeaderProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onMenuClick: () => void;
}

export const Header = ({ userRole, onRoleChange, onMenuClick }: HeaderProps) => {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <Select value={userRole} onValueChange={(value) => onRoleChange(value as UserRole)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="inventory_manager">Inventory Manager</SelectItem>
              <SelectItem value="warehouse_staff">Warehouse Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
};
