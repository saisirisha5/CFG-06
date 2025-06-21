import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if admin is logged in on app start
        const token = localStorage.getItem("adminToken");
        const adminData = localStorage.getItem("adminData");
        
        if (token && adminData) {
            setAdmin(JSON.parse(adminData));
        }
        setLoading(false);
    }, []);

    const login = (adminData, token) => {
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminData", JSON.stringify(adminData));
        setAdmin(adminData);
    };

    const logout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        setAdmin(null);
    };

    const isAuthenticated = () => {
        return !!admin;
    };

    const getToken = () => {
        return localStorage.getItem("adminToken");
    };

    const value = {
        admin,
        login,
        logout,
        isAuthenticated,
        getToken,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 