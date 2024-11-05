import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds
        const expired = decodedToken.exp < currentTime;
        setIsTokenExpired(expired);
        if (expired) {
          handleLogout(); // Trigger logout if expired
        }
      }
    };

    // Check immediately and set up an interval for periodic checks
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000); // Check every 1 minute

    return () => clearInterval(interval); // Clear on unmount
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
