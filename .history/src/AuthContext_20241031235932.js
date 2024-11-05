import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isExpired, setIsExpired] = useState(false);

  const handleLogin = (newToken) => {
    console.log("handleLogin executed"); 
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setIsExpired(false); // Reset expiration state on login
  };

  const handleLogout = () => {
    console.log("Handling logout, clearing token...");
    localStorage.removeItem('authToken');
    setToken(null);
    setIsExpired(false); // Reset expiration state on logout
  };

  const checkTokenExpiration = () => {
    console.log("Checking token expiration...");
    const savedToken = localStorage.getItem('authToken');
    if (!savedToken) {
      console.log("No token found");
      return;
    }

    try {
      const payload = JSON.parse(atob(savedToken.split('.')[1]));
      const expirationTime = payload.exp;
      const currentTime = Date.now() / 1000;
      
      console.log("Token Expiration Time:", expirationTime, "Current Time:", currentTime);
      if (currentTime >= expirationTime) {
        console.log("Token has expired");
        setIsExpired(true);
        handleLogout();
      }
    } catch (error) {
      console.error("Error parsing token:", error);
      handleLogout();
    }
  };

  useEffect(() => {
    console.log("Setting up interval to check token expiration...");
    const intervalId = setInterval(checkTokenExpiration, 5000);

    return () => {
      console.log("Clearing interval...");
      clearInterval(intervalId);
    };
  }, []);

  // Watch for isExpired changes and trigger alert
  useEffect(() => {
    if (isExpired) {
      alert("Session has expired. Please log in again.");
    }
  }, [isExpired]);

  return (
    <AuthContext.Provider value={{ token, handleLogin, handleLogout, isExpired }}>
      {children}
    </AuthContext.Provider>
  );
}
