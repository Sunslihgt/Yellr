import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import './main.css';

import { store } from './store';
import { AppProvider } from './contexts/AppContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import PostsWithSkeleton from './pages/Posts';
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from './components/ProtectedRoute';

import Layout from './Layout';
import { initializeFavicon } from './utils/favicon';

const container = document.getElementById('root');
if (container === null) {
    throw new Error('Something went wrong!');
}

const root = createRoot(container);

// Initialize favicon management
initializeFavicon();

root.render(
    <StrictMode>
        <Provider store={store}>
            <AppProvider>
                <BrowserRouter>
                    <Layout>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/logout" element={<Logout />} />
                            <Route path="/" element={<ProtectedRoute><PostsWithSkeleton /></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                            <Route path="/user/:username" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                            <Route path="/posts" element={<ProtectedRoute><PostsWithSkeleton /></ProtectedRoute>} />
                            {/* Fallback route for any unmatched paths */}
                            <Route path="*" element={<ErrorPage errorCode={404} />} />
                        </Routes>
                    </Layout>
                </BrowserRouter>
            </AppProvider>
        </Provider>
    </StrictMode>
);