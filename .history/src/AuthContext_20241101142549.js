// AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [sessionExpired, setSessionExpired] = useState(false);

  const isTokenExpired = (token) => {
    const expirationTime = JSON.parse(atob(token.split('.')[1])).exp * 1000;
    return Date.now() >= expirationTime;
  };

  // Using useCallback to avoid redefining handleExpirationAlert on every render
  const handleExpirationAlert = useCallback(() => {
    if (!sessionExpired) {
      alert('Session expired. Please log in again.');
      setSessionExpired(true); // Prevent further alerts
      handleLogout();
    }
  }, [sessionExpired]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    setSessionExpired(false); // Reset for new session

    // Check for immediate expiration after setting token
    if (isTokenExpired(newToken)) {
      handleExpirationAlert();
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
    setSessionExpired(false); // Reset the alert flag
  };

  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        if (isTokenExpired(token)) {
          handleExpirationAlert();
        }
      }, 5000); // Adjust as needed

      return () => clearInterval(interval);
    }
  }, [token, handleExpirationAlert]);

  return (
    <AuthContext.Provider value={{ token, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
