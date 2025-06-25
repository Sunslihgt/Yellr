import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const [imageError, setImageError] = useState(false);
    const handleImageError = () => {
        setImageError(true);
    };

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    // Close user menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // Check if the click target is the button itself
            const target = event.target as HTMLElement;
            const button = document.getElementById('user-menu-button');
            
            if (button && button.contains(target)) {
                return; // Don't close if clicking on the button
            }
            
            if (userMenuRef.current && !userMenuRef.current.contains(target)) {
                setUserMenuOpen(false);
            }
        }

        if (userMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [userMenuOpen]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        setUserMenuOpen(false);
    };

    if (!isAuthenticated) {
        return null; // Don't show navbar for unauthenticated users
    }

    return (
        <nav className="sticky top-0 z-50 bg-white border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img className="h-8 " src="/logos/PRIDELogoWithoutTagline.svg" alt="Yellr Logo"/>
                </Link>

                <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <div className="relative">
                        <button
                            type="button"
                            className="flex items-center space-x-2 text-sm rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 md:bg-gray-300 md:dark:bg-gray-800 md:pr-2 hover:bg-gray-700 transition-colors"
                            id="user-menu-button"
                            aria-expanded="false"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                        >
                            <div>
                                <span className="sr-only">Open user menu</span>
                                <img
                                    className="w-8 h-8 rounded-full object-cover object-center"
                                    src={imageError || !user?.profilePictureUrl ? '/assets/default-avatar.jpg' : user?.profilePictureUrl}
                                    alt="user photo"
                                    onError={handleImageError}
                                />
                            </div>
                            <span className="text-gray-900 dark:text-white font-medium hidden md:block text-sm font-semibold">
                                {user?.username || 'User'}
                            </span>
                        </button>

                        {userMenuOpen && (
                            <div
                                className="absolute right-0 mt-2 z-50 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600"
                                ref={userMenuRef}
                            >
                                <div className="px-4 py-3">
                                    <span className="block text-sm text-gray-900 dark:text-white">
                                        {user?.username || ''}
                                    </span>
                                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                                        {user?.email || ''}
                                    </span>
                                </div>
                                <ul className="py-2">
                                    <li>
                                        <Link
                                            to="/user"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                        >
                                            Sign out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;