import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
    const [isTokenExpired, setIsTokenExpired] = useState(false);

    const handleLogin = (token, expirationTime) => {
        setAuthToken(token);
        localStorage.setItem("authToken", token);
        localStorage.setItem("expirationTime", expirationTime);
        setIsTokenExpired(false);
    };

    const handleLogout = () => {
        setAuthToken(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("expirationTime");
        setIsTokenExpired(true);
    };

    useEffect(() => {
        const checkTokenExpiration = () => {
            const expirationTime = localStorage.getItem("expirationTime");
            if (!expirationTime) {
                setIsTokenExpired(true);
                return;
            }
            const currentTime = Math.floor(Date.now() / 1000);
            if (currentTime >= expirationTime) {
                setIsTokenExpired(true);
                handleLogout();
            } else {
                setIsTokenExpired(false);
            }
        };

        const interval = setInterval(checkTokenExpiration, 5000);

        return () => clearInterval(interval);
    }, [authToken]);

    return (
        <AuthContext.Provider value={{ isTokenExpired, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
