import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { validateToken } from '../store/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Redirect to login if not authenticated, otherwise return the children
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const dispatch = useAppDispatch();
    const { isAuthenticated, token, isLoading, error } = useAppSelector((state) => state.auth);

    useEffect(() => {
        // If we have a token, validate it
        if (token) {
            dispatch(validateToken());
        }
    }, [token, isAuthenticated, dispatch]);

    // Show loading state while validating token
    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>;
    }

    // If token validation failed, redirect to logout
    if (error && !isAuthenticated) {
        return <Navigate to="/logout" replace />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>
        {children}
    </>;
};

export default ProtectedRoute;