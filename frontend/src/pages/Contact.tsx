import React from 'react';

export default function Contact() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-8">
            <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-lg shadow-md p-8">
                <h1 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">Contact Us</h1>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-center">
                    Want to yell at us? Have feedback, questions, or just want to say hi? <br />
                    <span className="italic">We probably won&apos;t listen, but you can try!</span>
                </p>
                <div className="mb-4 text-gray-700 dark:text-gray-300">
                    <p className="mb-2">Email: <a href="mailto:contact@yellr.fake" className="text-blue-600 hover:underline">contact@yellr.fake</a></p>
                    <p className="mb-2">Twitter/X: <a href="https://twitter.com/intent/tweet?text=@YellrOfficial" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">@YellrOfficial</a></p>
                    <p className="mb-2">Carrier pigeon, smoke signals, or just yell really loud. We might hear you.</p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
                    This is a student project for CESI Graduate School of Engineering. Messages are not monitored. Please do not send real or sensitive information.
                </p>
            </div>
        </div>
    );
}