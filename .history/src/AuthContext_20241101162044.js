import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const expirationCheckInterval = useRef(null);

    const isTokenExpired = (token) => {
        if (!token) return true;
        try {
            const { exp } = JSON.parse(atob(token.split('.')[1]));
            const expired = Date.now() >= exp * 1000;
            console.log('Checking if token is expired:', expired);
            return expired;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    };

    const handleExpirationAlert = useCallback(() => {
        console.log('Session expired, alerting user');
        alert('Your session has expired. Please log in again.');
        handleLogout();
    }, []);

    const handleLogin = (newToken) => {
        console.log('Logging in with new token:', newToken);
        localStorage.setItem('authToken', newToken);
        setToken(newToken);

        if (isTokenExpired(newToken)) {
            handleExpirationAlert();
        } else {
            startExpirationCheck(newToken);
        }
    };

    const handleLogout = () => {
        console.log('Logging out, clearing token');
        localStorage.removeItem('authToken');
        setToken(null);
        clearInterval(expirationCheckInterval.current);
    };

    const startExpirationCheck = useCallback((token) => {
        console.log('Starting expiration check interval');
        clearInterval(expirationCheckInterval.current);
        expirationCheckInterval.current = setInterval(() => {
            console.log('Interval tick, checking token expiration');
            if (isTokenExpired(token)) {
                handleExpirationAlert();
            }
        }, 1000);
    }, [handleExpirationAlert]);

    useEffect(() => {
        if (token) {
            console.log('Token is set, starting expiration check');
            startExpirationCheck(token);
        }

        return () => clearInterval(expirationCheckInterval.current);
    }, [token, startExpirationCheck]);

    return (
        <AuthContext.Provider value={{ token, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
