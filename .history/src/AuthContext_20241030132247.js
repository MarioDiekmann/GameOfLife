import React, { createContext, useState, useEffect, useCallback } from 'react';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  const checkTokenExpiration = useCallback(() => {
    if (!token) return;

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      console.log("Checking token expiration:", decodedToken.exp, currentTime);

      if (decodedToken.exp < currentTime) {
        if (!isTokenExpired) {
          console.log("Token has expired");
          setIsTokenExpired(true);
          handleLogout();
        }
      } else if (isTokenExpired) {
        setIsTokenExpired(false);
      }
    } catch (error) {
      console.error("Token decode error:", error);
      handleLogout();
    }
  }, [token, isTokenExpired]);

  useEffect(() => {
    const intervalId = setInterval(checkTokenExpiration, 5000); // Check every 5 seconds
    return () => clearInterval(intervalId);
  }, [checkTokenExpiration]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    setIsTokenExpired(false);
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
