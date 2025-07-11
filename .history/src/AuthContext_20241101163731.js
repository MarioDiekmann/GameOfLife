import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const tokenRef = useRef(token); // Ref to hold the latest token
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
        tokenRef.current = newToken; // Update the ref with the new token

        if (isTokenExpired(newToken)) {
            handleExpirationAlert();
        } else {
            startExpirationCheck();
        }
    };

    const handleLogout = () => {
        console.log('Logging out, clearing token');
        localStorage.removeItem('authToken');
        setToken(null);
        tokenRef.current = null; // Clear the ref
        clearInterval(expirationCheckInterval.current);
    };

    const startExpirationCheck = useCallback(() => {
        console.log('Starting expiration check interval');
        clearInterval(expirationCheckInterval.current);
        expirationCheckInterval.current = setInterval(() => {
            console.log('Interval tick, checking token expiration');
            if (isTokenExpired(tokenRef.current)) {
                handleExpirationAlert();
            }
        }, 1000);
    }, [handleExpirationAlert]);

    useEffect(() => {
        tokenRef.current = token; // Keep the ref updated with the latest token
        if (token) {
            console.log('Token is set, starting expiration check');
            startExpirationCheck();
        }

        return () => clearInterval(expirationCheckInterval.current);
    }, [token, startExpirationCheck]);

    return (
        <AuthContext.Provider value={{ token, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
