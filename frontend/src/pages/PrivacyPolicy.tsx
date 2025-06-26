import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-8">
            <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-lg shadow-md p-8">
                <h1 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">Privacy Policy</h1>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                    <strong>Welcome to YELLR!</strong> This platform is a student project, built for fun and learning. Please do not share any sensitive or real personal information here.
                </p>
                <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">What We Collect</h2>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
                    <li>Username, email, and password (for demo purposes only)</li>
                    <li>Posts, comments, and likes you create</li>
                </ul>
                <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">How We Use It</h2>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
                    <li>To let you yell into the void (and see others do the same)</li>
                    <li>To provide basic social features (posts, likes, comments)</li>
                </ul>
                <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">Your Data</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                    We do <strong>not</strong> sell, share, or use your data for any commercial purpose. This site is not intended for real use. All data may be deleted at any time, and there is no guarantee of privacy or security.
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                    By using YELLR, you acknowledge that this is a demo project and agree not to upload any real or sensitive information.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">&copy; {new Date().getFullYear()} YELLR. No Rights Reserved.</p>
            </div>
        </div>
    );
}