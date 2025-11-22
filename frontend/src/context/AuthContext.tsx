import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

interface User {
    id: string;
    name: string;
    email: string;
    role: "WAREHOUSE_STAFF" | "INVENTORY_MANAGER" | "ADMIN";
}

interface AuthContextProps {
    isAuthenticated: boolean;
    user: User | null;
    login: (token: string, userData?: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Restore authentication state
    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");

            if (
                token &&
                storedUser &&
                storedUser !== "undefined" &&
                storedUser !== "null"
            ) {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Error restoring user from localStorage:", error);
            localStorage.removeItem("user");
        } finally {
            setLoading(false);
        }
    }, []);

    // Login handler
    const login = (token: string, userData?: User) => {
        localStorage.setItem("token", token);
        if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
        } else {
            console.warn("⚠ No user data provided during login");
        }
        setIsAuthenticated(true);
    };

    // Logout handler
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setUser(null);
    };

    // 🔁 Show loading only during restore (not on login/signout)
    if (loading) return <div>Loading authentication...</div>;

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
