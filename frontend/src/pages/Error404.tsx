import React, { useState, useEffect } from 'react';

function Error() {
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
                Page not found
                </h1>
                <p className="mt-6 text-lg font-medium text-gray-600 dark:text-gray-300 sm:text-xl/8">
                Sorry, we couldn’t find the page you’re looking for.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                    href="/"
                    className="rounded-md bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    Go back home
                </a>
                </div>
            </div>
        </main>

    );
}

export default Error;