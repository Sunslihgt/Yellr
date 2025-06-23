import React from 'react';

function Footer() {
    return (
        <footer className="bg-white shadow-sm dark:bg-gray-800 fixed bottom-0 left-0 w-full z-50">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
                        <img src="logos/PRIDELogoWithoutTagline.svg" alt="Yeller™" className="inline-block h-6 mr-1" />
                    </a>
                    All Rights Reserved.
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="hover:underline me-4 md:me-6">About</a>
                    </li>
                    <li>
                        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="hover:underline me-4 md:me-6">Privacy Policy</a>
                    </li>
                    <li>
                        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="hover:underline">Contact</a>
                    </li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer;