import React from 'react';

export default function About() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-8">
            <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-lg shadow-md p-8">
                <img src="/logos/PRIDELogoWithoutTagline.svg" alt="YELLR Logo" className="h-12 mx-auto mb-4" />
                <h1 className="text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white">About YELLR</h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 text-center italic">Where Everyone&apos;s Loud... and nobody listens.</p>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                    <strong>YELLR</strong> is the world&apos;s most <span className="font-semibold">unapologetically chaotic</span> microblogging platform. We believe in <span className="font-semibold">free</span> speech, especially the kind that involves shouting into the void while everyone else is doing the same. Built for those who want to be heard—but never want to listen.
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                    YELLR is a <span className="font-semibold">Twitter/X clone</span> made by three students at CESI Graduate School of Engineering (Saint-Nazaire, 2024-2027). The project was built in a few weeks as a fun, modern take on social microblogging.
                </p>
                <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">Tech Stack</h2>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
                    <li>MERN: MongoDB, Express, React, Node.js</li>
                    <li>TypeScript & Tailwind CSS</li>
                    <li>Microservices architecture</li>
                    <li>NGINX for deployment</li>
                </ul>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">&copy; {new Date().getFullYear()} YELLR. No Rights Reserved.</p>
            </div>
        </div>
    );
}