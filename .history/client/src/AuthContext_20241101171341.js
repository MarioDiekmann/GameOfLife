import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const tokenRef = useRef(token);
    const expirationCheckInterval = useRef(null);

    const isTokenExpired = (token) => {
        if (!token) return true;
        try {
            const { exp } = JSON.parse(atob(token.split('.')[1]));
            return Date.now() >= exp * 1000;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    };

    const handleLogout = useCallback(() => {
        console.log('Logging out, clearing token');
        localStorage.removeItem('authToken');
        setToken(null);
        tokenRef.current = null;
        clearInterval(expirationCheckInterval.current);
    }, []);

    const handleExpirationAlert = useCallback(() => {
        console.log('Session expired, alerting user');
        alert('Your session has expired. Please log in again.');
        handleLogout();
    }, [handleLogout]);

    const handleLogin = (newToken) => {
        console.log('Logging in with new token:', newToken);
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
        tokenRef.current = newToken;

        // Check for expiration immediately
        if (isTokenExpired(newToken)) {
            handleExpirationAlert();
        } else {
            startExpirationCheck();
        }
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
        console.log('useEffect triggered: token is', token);
        tokenRef.current = token;

        if (token) {
            console.log('Token is set, starting expiration check');
            startExpirationCheck();
        } else {
            console.log('No token, clearing interval');
            clearInterval(expirationCheckInterval.current);
        }

        return () => {
            console.log('Clearing interval on unmount or dependency change');
            clearInterval(expirationCheckInterval.current);
        };
    }, [token, startExpirationCheck]);

    return (
        <AuthContext.Provider value={{ token, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
