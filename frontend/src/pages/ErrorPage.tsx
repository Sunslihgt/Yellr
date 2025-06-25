import React from 'react';

const ERROR_DESCRIPTIONS = {
    400: 'Bad request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Page not found',
    500: 'Internal server error',
};

interface ErrorPageProps {
    errorCode: number;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ errorCode }) => {
    return (
        <div className="flex-1 flex flex-col justify-center bg-gray-100 dark:bg-gray-800">
            <div className="text-center">
                <p className="text-4xl font-bold text-gray-900 dark:text-white">{errorCode}</p>
                <h1 className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">
                    {errorCode in ERROR_DESCRIPTIONS ? ERROR_DESCRIPTIONS[errorCode as keyof typeof ERROR_DESCRIPTIONS] : 'Unknown error'}
                </h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                    Sorry, we couldn&apos;t find the page you&apos;re looking for.
                </p>
                <a
                    href="/"
                    className="mt-8 inline-block rounded-md bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow"
                >
                    Go back home
                </a>
            </div>
        </div>
    );
};

export default ErrorPage;
