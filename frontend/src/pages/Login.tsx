import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateUsername, isAllowedUsernameChar } from '../utils/validation';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState<string>('');

    const { login, isLoading, error, isAuthenticated, clearError } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        return () => {
            clearError();
        };
    }, [clearError]);

    // Real-time validation for username
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const filteredValue = value.split('').filter(char => isAllowedUsernameChar(char)).join('');

        setUsername(filteredValue);

        if (filteredValue.trim()) {
            const validation = validateUsername(filteredValue);
            setUsernameError(validation.isValid ? '' : 'Invalid username format');
        } else {
            setUsernameError('');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const usernameValidation = validateUsername(username);
        if (!usernameValidation.isValid) {
            setUsernameError('Invalid username format');
            return;
        }

        await login({ username: username.trim(), password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Welcome back to Yellr
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className={`mt-1 appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    usernameError ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Enter your username"
                                value={username}
                                onChange={handleUsernameChange}
                            />
                            {usernameError && (
                                <p className="mt-1 text-xs text-red-600">{usernameError}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="mt-1 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-md p-3">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading || !!usernameError}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="text-indigo-600 hover:text-indigo-500 text-sm"
                        >
                            Don&apos;t have an account? Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;