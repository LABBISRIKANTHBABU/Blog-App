
import { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = localStorage.getItem('auth_token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        };
        checkUserLoggedIn();
    }, []);

    const login = async (username, password) => {
        const { data } = await API.post('/login', { username, password });

        if (!data.accessToken) {
            console.error('Login successful but no accessToken received:', data);
            throw new Error('No access token received from server');
        }

        // Store token and user data
        localStorage.setItem('auth_token', data.accessToken);
        localStorage.setItem('user', JSON.stringify({
            username: data.username,
            name: data.name,
            _id: data._id
        }));

        setUser({
            username: data.username,
            name: data.name,
            _id: data._id
        });
    };

    /**
     * Signup function - NO AUTO-LOGIN per requirements
     * Only returns success message, user must explicitly login
     */
    const signup = async (username, name, email, password) => {
        const { data } = await API.post('/signup', { username, name, email, password });

        // Do NOT auto-login after signup
        // Do NOT store token or set user state
        // Return success message for UI to display
        return data.msg || 'Signup successful! Please login to continue.';
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
