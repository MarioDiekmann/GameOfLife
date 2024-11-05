// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000 - Date.now(); // Time left in ms

      if (expirationTime <= 0) {
        handleLogout(); // Token is expired, log out
      } else {
        setIsTokenExpired(false);
        const timer = setTimeout(() => {
          setIsTokenExpired(true);
          handleLogout(); // Automatically logout
        }, expirationTime);

        // Clear timeout if token changes
        return () => clearTimeout(timer);
      }
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    setIsTokenExpired(false);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
    setIsTokenExpired(true);
    alert("Your session has expired. Please log in again.");
  };

  return (
    <AuthContext.Provider value={{ token, isTokenExpired, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
