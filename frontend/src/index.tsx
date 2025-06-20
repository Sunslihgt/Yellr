import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './main.css';

import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import PostsWithSkeleton from './pages/Posts';
import Error404 from './pages/Error404';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
// import App from './App';

const container = document.getElementById('root');
if (container === null) {
    throw new Error('Something went wrong!');
}

const root = createRoot(container)

function AppWithSkeleton() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Error404 />
    );
}

root.render(
    <>
        <Navbar />
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PostsWithSkeleton />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/posts" element={<PostsWithSkeleton />} />
                {/* Fallback route for any unmatched paths */}
                <Route path="*" element={<AppWithSkeleton />} />
            </Routes>
        </BrowserRouter>
        <Footer />
    </>
);