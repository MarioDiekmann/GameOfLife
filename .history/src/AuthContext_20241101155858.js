import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [sessionExpired, setSessionExpired] = useState(false);
    const expirationCheckInterval = useRef(null);

    const isTokenExpired = (token) => {
        try {
            const { exp } = JSON.parse(atob(token.split('.')[1]));
            return Date.now() >= exp * 1000;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    };

    const handleExpirationAlert = useCallback(() => {
        setSessionExpired(true);
        handleLogout();
        alert('Your session has expired. Please log in again.');
    }, []);

    const handleLogin = (newToken) => {
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
        setSessionExpired(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        setSessionExpired(true);
    };

    useEffect(() => {
        if (token && !sessionExpired) {
            if (isTokenExpired(token)) {
                handleExpirationAlert();
            } else {
                expirationCheckInterval.current = setInterval(() => {
                    if (isTokenExpired(token)) handleExpirationAlert();
                }, 5000);
            }
        }

        return () => clearInterval(expirationCheckInterval.current);
    }, [token, sessionExpired, handleExpirationAlert]);

    return (
        <AuthContext.Provider value={{ token, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
