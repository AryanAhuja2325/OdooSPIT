import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";
import { Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  userRole: UserRole;
  onMenuClick: () => void;
}

export const Header = ({ userRole, onMenuClick }: HeaderProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear auth
    navigate("/login"); // Redirect
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      {/* Mobile menu toggle */}
      <button
        className="lg:hidden p-2 rounded-md hover:bg-muted"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-4 ml-auto">
        {/* Display role */}
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <Badge variant="outline">{userRole.toUpperCase()}</Badge>
        </div>

        {/* Logout button */}
        <Button
          variant="destructive"
          size="sm"
          onClick={handleLogout}
          className="ml-4"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};
