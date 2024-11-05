// AuthContext.js
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
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          setIsTokenExpired(true);
          handleLogout();
        } else {
          setIsTokenExpired(false);
        }
      }
    };
  
    // Set a timer to check expiration every minute (or a shorter interval if preferred)
    const intervalId = setInterval(checkTokenExpiration, 60000); 
  
    // Run the check immediately when AuthProvider mounts
    checkTokenExpiration();
  
    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
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
