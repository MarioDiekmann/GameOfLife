import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
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
        handleLogout();
        alert('Your session has expired. Please log in again.');
    }, []);

    const handleLogin = (newToken) => {
        localStorage.setItem('authToken', newToken);
        setToken(newToken);

        if (isTokenExpired(newToken)) {
            handleExpirationAlert();
        } else {
            startExpirationInterval(newToken);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        clearInterval(expirationCheckInterval.current);
    };

    const startExpirationInterval = (token) => {
        clearInterval(expirationCheckInterval.current); // Clear any existing interval
        expirationCheckInterval.current = setInterval(() => {
            if (isTokenExpired(token)) handleExpirationAlert();
        }, 5000);
    };

    useEffect(() => {
        if (token) {
            if (isTokenExpired(token)) {
                handleExpirationAlert();
            } else {
                startExpirationInterval(token);
            }
        }

        return () => clearInterval(expirationCheckInterval.current);
    }, [token, handleExpirationAlert]);

    return (
        <AuthContext.Provider value={{ token, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
