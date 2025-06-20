import React, { useState, useEffect } from 'react';

function NotificationsWithSkeleton() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <main className="place-items-center bg-gray-100 dark:bg-gray-800 px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-base font-semibold text-gray-900 dark:text-white">404</p>
                <h1 className="mt-4 text-5xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                Work in Progress.
                </h1>
            </div>
        </main>
    );
}

export default NotificationsWithSkeleton;