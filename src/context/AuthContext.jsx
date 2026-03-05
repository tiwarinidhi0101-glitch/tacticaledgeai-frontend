import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Check both localStorage and sessionStorage for existing login data
  const storedData = JSON.parse(localStorage.getItem("loginData")) || JSON.parse(sessionStorage.getItem("loginData"));
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(storedData?.token) || false);
  const [user, setUser] = useState(storedData?.user || null);
  const [token, setToken] = useState(storedData?.token || null);

  // Login function: save to localStorage or sessionStorage based on rememberMe
  const login = ({ token, user }, rememberMe = false) => {
    const storageData = { token, user };
    if (rememberMe) {
      localStorage.setItem("loginData", JSON.stringify(storageData));
      sessionStorage.removeItem("loginData");
    } else {
      sessionStorage.setItem("loginData", JSON.stringify(storageData));
      localStorage.removeItem("loginData");
    }
    setIsAuthenticated(true);
    setUser(user);
    setToken(token);
  };

  // Logout: clear both storages
  const logout = () => {
    localStorage.removeItem("loginData");
    sessionStorage.removeItem("loginData");
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming AuthContext
export const useAuth = () => useContext(AuthContext);
