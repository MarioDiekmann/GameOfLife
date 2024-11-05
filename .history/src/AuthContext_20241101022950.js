// AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("authToken") || null);
  const [isTokenExpired, setIsTokenExpired] = useState(() => {
    const token = localStorage.getItem("authToken");
    return !token; // Set to true if token is not available
  });

  const checkTokenExpiration = useCallback(() => {
    console.log("Checking token expiration...");
    if (!token) {
      console.log("No token found");
      setIsTokenExpired(true);
      return;
    }

    try {
      const { exp } = jwtDecode(token);
      if (!exp) {
        console.error("Token does not contain expiration");
        setIsTokenExpired(true);
        return;
      }
      const currentTime = Math.floor(Date.now() / 1000);
      console.log("Token Expiration Time:", exp, "Current Time:", currentTime);
      setIsTokenExpired(currentTime > exp);
    } catch (error) {
      console.error("Error decoding token:", error);
      setIsTokenExpired(true);
    }
  }, [token]);

  const handleLogin = (newToken) => {
    console.log("Attempting to log in with token:", newToken);
    setToken(newToken);
    localStorage.setItem("authToken", newToken);
    setIsTokenExpired(false); // Set to false immediately on login
    console.log("Token set on login:", newToken);
    checkTokenExpiration(); // Check token expiration immediately after login
  };

  const handleLogout = () => {
    console.log("Logging out...");
    setToken(null);
    localStorage.removeItem("authToken");
    setIsTokenExpired(true);
    console.log("Logged out, token cleared");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    console.log("Stored token on mount:", storedToken);
    if (storedToken) {
      setToken(storedToken);
    } else {
      setIsTokenExpired(true);
    }
    checkTokenExpiration(); // Initial check on mount
  }, []);

  useEffect(() => {
    const interval = setInterval(checkTokenExpiration, 5000);
    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  return (
    <AuthContext.Provider value={{ token, isTokenExpired, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
