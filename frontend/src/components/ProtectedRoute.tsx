import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Redirect to login if not authenticated, otherwise return the children
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>
        {children}
    </>;
};

export default ProtectedRoute;