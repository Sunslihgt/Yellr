import React, { useState, useEffect } from 'react';

function ProfileWithSkeleton() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <main className="place-items-center bg-gray-100 dark:bg-gray-800 px-6 py-24">
            <div className="text-center">
                <h1 className="mt-4 text-5xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                Work in Progress.
                </h1>
            </div>
        </main>
    );
}

export default ProfileWithSkeleton;