import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create AuthContext
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [THEME, setTHEME] = useState("dark"); // default theme
  const navigate = useNavigate();

  // Check if adminInfo is already in localStorage on initial load
  useEffect(() => {
    const storedAdminInfo = localStorage.getItem("adminInfo");
    const storedTheme = localStorage.getItem("adminTheme");
    if (storedAdminInfo) {
      setAdminInfo(JSON.parse(storedAdminInfo));
    }
    if (storedTheme) {
      setTHEME(storedTheme);
    }

    setLoading(false);
  }, []);

  // Login function
  const login = (data) => {
    localStorage.setItem("adminInfo", JSON.stringify(data));
    setAdminInfo(data);
    navigate("/");
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("adminInfo");
    setAdminInfo(null);
    localStorage.removeItem("adminTheme"); // Remove theme preference on logout
    navigate("/auth-login");
  };

  // Toggle theme and store in localStorage
  const toggleTheme = () => {
    const newTheme = THEME === "dark" ? "light" : "dark";
    setTHEME(newTheme);
    localStorage.setItem("adminTheme", newTheme);
  };

  return (
    <AuthContext.Provider value={{ adminInfo, login, logout, THEME, toggleTheme, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
