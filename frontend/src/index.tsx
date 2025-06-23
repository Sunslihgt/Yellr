import React, { useState, useEffect, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import './main.css';

import { store } from './store';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import PostsWithSkeleton from './pages/Posts';
import Error404 from './pages/Error404';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
// import App from './App';

const container = document.getElementById('root');
if (container === null) {
    throw new Error('Something went wrong!');
}

const root = createRoot(container);

function AppWithSkeleton() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Error404 />
    );
}

root.render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/" element={<ProtectedRoute><PostsWithSkeleton /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/user/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                    <Route path="/posts" element={<ProtectedRoute><PostsWithSkeleton /></ProtectedRoute>} />
                    {/* Fallback route for any unmatched paths */}
                    <Route path="*" element={<AppWithSkeleton />} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </Provider>
    </StrictMode>
);