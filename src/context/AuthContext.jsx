import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as registerAccount, checkAuth, logout as apiLogout } from '../apis/services';
import Loading from '../components/shared/Loading';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const verifyAuth = async () => {
            try {

                const userData = await checkAuth();
                console.log(userData)
                setUser(userData.data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const userData = await apiLogin(email, password);
            setUser(userData.data.user); // Assuming the API returns { user, token }
            return userData;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await registerAccount(userData);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
            // Clear the cookies manually
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            setUser(null);  // Clear the user state as well
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const getToken = () => {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];
    };


    const value = {
        user,
        login,
        register,
        logout,
        getToken,
        isAuthenticated: !!user,
        loading
    };
    if (loading) {
        return <Loading />
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 