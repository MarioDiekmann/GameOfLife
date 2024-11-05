// AuthContext.js

import React, { createContext, useState, useEffect, useCallback } from 'react';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  const checkTokenExpiration = useCallback(() => {
    console.log("Checking token expiration...");
    if (!token) {
      console.log("No token found");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      console.log("Token Expiration Time:", decodedToken.exp, "Current Time:", currentTime);

      if (decodedToken.exp < currentTime) {
        console.log("Token has expired");

        if (!isTokenExpired) {
          console.log("Updating expired state and logging out");
          setIsTokenExpired(true);
          handleLogout();
        }
      } else if (isTokenExpired) {
        console.log("Token is valid but expired state was true, resetting it.");
        setIsTokenExpired(false);
      }
    } catch (error) {
      console.error("Token decode error:", error);
      handleLogout();
    }
  }, [token, isTokenExpired]);

  useEffect(() => {
    console.log("Setting up interval to check token expiration...");
    const intervalId = setInterval(checkTokenExpiration, 5000); // Check every 5 seconds

    return () => {
      console.log("Clearing interval...");
      clearInterval(intervalId);
    };
  }, [checkTokenExpiration]);

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('authToken');
      if (newToken !== token) {
        console.log("Token updated in localStorage, setting new token in state...");
        setToken(newToken);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [token]);

  const handleLogin = (newToken) => {
    console.log("Login successful, setting token...");
    localStorage.setItem('authToken', newToken);
    setToken(newToken);  // Ensure state immediately reflects the new token
    setIsTokenExpired(false);
  };

  const handleLogout = () => {
    console.log("Handling logout, clearing token...");
    localStorage.removeItem('authToken');
    setToken(null);
    setIsTokenExpired(true);
  };

  return (
    <AuthContext.Provider value={{ token, isTokenExpired, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
