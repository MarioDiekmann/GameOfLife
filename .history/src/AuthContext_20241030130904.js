import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  // Function to check token expiration
  const checkTokenExpiration = () => {
    if (!token) return;
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const expired = decodedToken.exp < currentTime;
    setIsTokenExpired(expired);

    if (expired) {
      handleLogout();
    }
  };

  // Listen to user interactions to check token expiration
  useEffect(() => {
    if (!token) return;

    // Set a fallback interval to check every 10 seconds
    const intervalId = setInterval(checkTokenExpiration, 10000);

    // Event listeners for user interactions
    const handleUserActivity = () => {
      checkTokenExpiration();
    };

    window.addEventListener("click", handleUserActivity);
    window.addEventListener("keypress", handleUserActivity);
    window.addEventListener("mousemove", handleUserActivity);

    // Initial check when token changes
    checkTokenExpiration();

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("keypress", handleUserActivity);
      window.removeEventListener("mousemove", handleUserActivity);
    };
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
  };

  return (
    <AuthContext.Provider value={{ token, isTokenExpired, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
