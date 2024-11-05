import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isExpired, setIsExpired] = useState(false);

  // handleLogin: to save token in both state and localStorage
  const handleLogin = (newToken) => {
    console.log("handleLogin executed");  // Log when handleLogin is called
    console.log("New token:", newToken);  // Log the token received in handleLogin

    localStorage.setItem('authToken', newToken);
    console.log("Stored token in localStorage:", localStorage.getItem('authToken'));  // Confirm storage

    setToken(newToken);  // Update React state with the token
    console.log("Setting token state in AuthProvider:", newToken);  // Confirm state update
  };

  const handleLogout = () => {
    console.log("Handling logout, clearing token...");
    localStorage.removeItem('authToken');
    setToken(null);
    setIsExpired(false);
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
      } else {
        setIsExpired(false);
      }
    } catch (error) {
      console.error("Error parsing token:", error);
      handleLogout();
    }
  };

  // useEffect to set up interval
  useEffect(() => {
    console.log("Setting up interval to check token expiration...");
    const intervalId = setInterval(checkTokenExpiration, 5000);  // 5s for testing, adjust as needed

    return () => {
      console.log("Clearing interval...");
      clearInterval(intervalId);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, handleLogin, handleLogout, isExpired }}>
      {children}
    </AuthContext.Provider>
  );
}
