// AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  const checkTokenExpiration = useCallback(() => {
    console.log("Checking token expiration...");
    if (!token) {
      console.log("No token found");
      setIsTokenExpired(true);
      return;
    }
    
    try {
      const { exp } = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      console.log("Token Expiration Time:", exp, "Current Time:", currentTime);
      setIsTokenExpired(currentTime > exp);
    } catch (error) {
      console.error("Error decoding token:", error);
      setIsTokenExpired(true);
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("authToken", newToken);
    setIsTokenExpired(false); // Set to false immediately on login
    console.log("Token set on login:", newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("authToken");
    setIsTokenExpired(true);
    console.log("Logged out, token cleared");
  };

  useEffect(() => {
    if (token) {
      checkTokenExpiration();
    }
    const interval = setInterval(checkTokenExpiration, 5000);
    return () => clearInterval(interval);
  }, [checkTokenExpiration, token]); // Add token to dependency array

  // Initial check only once when the provider mounts
  useEffect(() => {
    if (token) {
      checkTokenExpiration();
    }
  }, [token, checkTokenExpiration]);

  return (
    <AuthContext.Provider value={{ token, isTokenExpired, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
