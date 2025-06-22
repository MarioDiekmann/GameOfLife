import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';

// Create a context for authentication
export const AuthContext = createContext();

// AuthProvider component that supplies authentication state and functions to its children
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('authToken')); // Initialize token from localStorage
    const tokenRef = useRef(token); // Store token in a ref to persist across renders
    const expirationCheckInterval = useRef(null); // Ref for the interval timer

    // Check if a given token is expired
    const isTokenExpired = (token) => {
        if (!token) return true;
        try {
            const { exp } = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
            return Date.now() >= exp * 1000; // Convert to milliseconds and compare
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true; // Treat decoding errors as expiration
        }
    };

    // Logout function: clears token from state, localStorage, and stops expiration checks
    const handleLogout = useCallback(() => {
        console.log('Logging out, clearing token');
        localStorage.removeItem('authToken');
        setToken(null);
        tokenRef.current = null;
        clearInterval(expirationCheckInterval.current);
    }, []);

    // Called when token is found to be expired
    const handleExpirationAlert = useCallback(() => {
        console.log('Session expired, alerting user');
        alert('Your session has expired. Please log in again.');
        handleLogout();
    }, [handleLogout]);

    // Login function: saves token and starts expiration check
    const handleLogin = (newToken) => {
        console.log('Logging in with new token:', newToken);
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
        tokenRef.current = newToken;

        // Check token immediately upon login
        if (isTokenExpired(newToken)) {
            handleExpirationAlert();
        } else {
            startExpirationCheck();
        }
    };

    // Starts a timer to check token expiration every second
    const startExpirationCheck = useCallback(() => {
        console.log('Starting expiration check interval');
        clearInterval(expirationCheckInterval.current); // Clear any existing interval

        expirationCheckInterval.current = setInterval(() => {
            console.log('Interval tick, checking token expiration');
            if (isTokenExpired(tokenRef.current)) {
                handleExpirationAlert();
            }
        }, 1000);
    }, [handleExpirationAlert]);

    // On token changes, update ref and manage expiration checks
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

    // Provide token and auth handlers to consuming components
    return (
        <AuthContext.Provider value={{ token, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
