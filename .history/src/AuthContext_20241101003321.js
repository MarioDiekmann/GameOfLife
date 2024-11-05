// AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Checking token expiration...");
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        setIsTokenExpired(true);
        return;
      }

      const decodedToken = jwt_decode(token);
      const expirationTime = decodedToken.exp;
      const currentTime = Math.floor(Date.now() / 1000);

      console.log(`Token Expiration Time: ${expirationTime}, Current Time: ${currentTime}`);

      if (currentTime >= expirationTime) {
        console.log("Token has expired");
        setIsTokenExpired(true);
      } else {
        console.log("Token is still valid");
        setIsTokenExpired(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setIsTokenExpired(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsTokenExpired(true);
  };

  return (
    <AuthContext.Provider value={{ isTokenExpired, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
