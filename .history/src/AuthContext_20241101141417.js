import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [sessionExpired, setSessionExpired] = useState(false);

  const isTokenExpired = (token) => {
    const expirationTime = JSON.parse(atob(token.split('.')[1])).exp * 1000;
    return Date.now() >= expirationTime;
  };

  const handleExpirationAlert = () => {
    if (!sessionExpired) {
      alert('Session expired. Please log in again.');
      setSessionExpired(true); // Prevent further alerts
      handleLogout();
    }
  };

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    setSessionExpired(false); // Reset for new session
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
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
