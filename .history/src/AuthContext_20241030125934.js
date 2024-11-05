import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  useEffect(() => {
    if (!token) return;

    const decodedToken = jwtDecode(token);
    const checkTokenExpiration = () => {
      const currentTime = Date.now() / 1000; // Get current time in seconds
      const expired = decodedToken.exp < currentTime;
      setIsTokenExpired(expired);

      if (expired) {
        handleLogout(); // Automatically log out if expired
      }
    };

    // Set an interval to check every 30 seconds
    const intervalId = setInterval(checkTokenExpiration, 30000);

    // Check initially in case of immediate expiration
    checkTokenExpiration();

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    setIsTokenExpired(false); // Reset expiration on login
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
