// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextProps {
    isAuthenticated: boolean;
    user: any;
    login: (token: string, userData?: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    // Check auth when app loads
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
            // Optionally get user profile from API
        }
    }, []);

    // Login handler
    const login = (token: string, userData?: any) => {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
        if (userData) setUser(userData);
        navigate("/"); // Redirect to dashboard after login
    };

    // Logout handler
    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
