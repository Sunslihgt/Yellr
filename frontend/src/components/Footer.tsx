import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <>
            <div className="h-16 hidden md:block"></div>
            <footer className="hidden md:block bg-white shadow-sm dark:bg-gray-900 fixed bottom-0 left-0 w-full z-50 hidden md:block">
                <div className="w-full mx-auto max-w-screen p-4 md:flex md:items-center md:justify-between">
                    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                        <a href="/">
                            <img src="/logos/PRIDELogoWithoutTagline.svg" alt="Yeller™" className="inline-block h-6 mr-1" />
                        </a>
                        All Rights Reserved.
                    </span>
                    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                        <li>
                            <Link to="/about" className="hover:underline me-4 md:me-6">About</Link>
                        </li>
                        <li>
                            <Link to="/privacy" className="hover:underline me-4 md:me-6">Privacy Policy</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:underline">Contact</Link>
                        </li>
                    </ul>
                </div>
            </footer>
        </>
    );
}

export default Footer;