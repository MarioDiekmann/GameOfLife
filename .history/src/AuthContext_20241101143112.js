import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [sessionExpired, setSessionExpired] = useState(false);

  const isTokenExpired = (token) => {
    if (!token) return true;
    const expirationTime = JSON.parse(atob(token.split('.')[1])).exp * 1000;
    console.log("Token expiration time:", new Date(expirationTime).toISOString());
    console.log("Current time:", new Date().toISOString());
    return Date.now() >= expirationTime;
  };

  const handleExpirationAlert = useCallback(() => {
    if (!sessionExpired) {
      console.log("Session expired. Triggering alert.");
      alert('Session expired. Please log in again.');
      setSessionExpired(true);
      handleLogout();
    }
  }, [sessionExpired]);

  const handleLogin = (newToken) => {
    console.log("Logging in with token:", newToken);
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    setSessionExpired(false);
  };

  const handleLogout = () => {
    console.log("Logging out. Clearing token.");
    setToken(null);
    localStorage.removeItem('authToken');
    setSessionExpired(false);
  };

  useEffect(() => {
    console.log("Starting token expiration interval");
    if (token) {
      const interval = setInterval(() => {
        console.log("Checking if token is expired");
        if (isTokenExpired(token)) {
          handleExpirationAlert();
        }
      }, 5000);

      return () => {
        console.log("Clearing interval");
        clearInterval(interval);
      };
    }
  }, [token, handleExpirationAlert]);

  return (
    <AuthContext.Provider value={{ token, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
