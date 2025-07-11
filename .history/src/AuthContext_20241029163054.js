// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Get current time in seconds
      setIsTokenExpired(decodedToken.exp < currentTime);

      if (decodedToken.exp < currentTime) {
        handleLogout(); // Automatically logout if expired
      }
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
    setIsTokenExpired(true);
  };

  return (
    <AuthContext.Provider value={{ token, isTokenExpired, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
