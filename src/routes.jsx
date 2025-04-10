import React from 'react';
import { Navigate } from 'react-router-dom';
import Home from './components/admin/Home';
import Schedule from './components/patient/Schedule';
import DentistAppointment from "./components/dentist/DentistAppointment"
import Login from './components/admin/Login';
import Register from './components/admin/Register';
import RegisterDentist from "./components/dentist/RegisterDentist"
import RegisterServices from './components/dentist/RegisterServices';
// import Services from '../components/display/Services';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const routes = [
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/dentists',
        element: (
            <ProtectedRoute>
                <RegisterDentist />
            </ProtectedRoute>
        ),
    },

    {
        path: '/services',
        element: (
            <ProtectedRoute>
                <RegisterServices />
            </ProtectedRoute>
        ),
    },
    {
        path: '/schedule',
        element: (
            <ProtectedRoute>
                <Schedule />
            </ProtectedRoute>
        ),
    },
    {
        path: `/appointments`,
        element: (
            <ProtectedRoute>
                <DentistAppointment />
            </ProtectedRoute>
        ),
    },
];

export default routes; 