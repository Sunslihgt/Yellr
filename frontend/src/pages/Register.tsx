import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateUsername, validateEmail, validatePassword, getUsernameRules, isAllowedUsernameChar } from '../utils/validation';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const [bio, setBio] = useState('');

    // Validation states
    const [usernameError, setUsernameError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [showUsernameRules, setShowUsernameRules] = useState(false);

    const { register, isLoading, error, isAuthenticated, clearError } = useAuth();
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
        
        const validation = validateUsername(filteredValue);
        setUsernameError(validation.isValid ? '' : validation.error || '');
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        
        if (value.trim()) {
            const validation = validateEmail(value);
            setEmailError(validation.isValid ? '' : validation.error || '');
        } else {
            setEmailError('');
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        
        if (value.trim()) {
            const validation = validatePassword(value);
            setPasswordError(validation.isValid ? '' : validation.error || '');
        } else {
            setPasswordError('');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const usernameValidation = validateUsername(username);
        const emailValidation = validateEmail(email);
        const passwordValidation = validatePassword(password);
        
        setUsernameError(usernameValidation.isValid ? '' : usernameValidation.error || '');
        setEmailError(emailValidation.isValid ? '' : emailValidation.error || '');
        setPasswordError(passwordValidation.isValid ? '' : passwordValidation.error || '');
        
        if (!usernameValidation.isValid || !emailValidation.isValid || !passwordValidation.isValid) {
            return;
        }
        
        await register({
            email: email.trim(),
            password,
            username: username.trim(),
            profilePictureUrl: profilePictureUrl || undefined,
            bio: bio || undefined
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join Yellr and start sharing your thoughts
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="space-y-4">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username *
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                maxLength={30}
                                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                                    usernameError ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Enter your username"
                                value={username}
                                onChange={handleUsernameChange}
                                onFocus={() => setShowUsernameRules(true)}
                                onBlur={() => setShowUsernameRules(false)}
                            />
                            {usernameError && (
                                <p className="mt-1 text-xs text-red-600">{usernameError}</p>
                            )}
                            {(showUsernameRules || usernameError) && (
                                <p className="mt-1 text-xs text-gray-500">
                                    {getUsernameRules()}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address *
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                maxLength={254}
                                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                                    emailError ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Enter your email address"
                                value={email}
                                onChange={handleEmailChange}
                            />
                            {emailError && (
                                <p className="mt-1 text-xs text-red-600">{emailError}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password *
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                minLength={6}
                                maxLength={128}
                                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                                    passwordError ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Enter your password"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            {passwordError && (
                                <p className="mt-1 text-xs text-red-600">{passwordError}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Password must be at least 6 characters long
                            </p>
                        </div>

                        {/* Profile Picture URL */}
                        <div>
                            <label htmlFor="profilePictureUrl" className="block text-sm font-medium text-gray-700">
                                Profile Picture URL
                            </label>
                            <input
                                id="profilePictureUrl"
                                name="profilePictureUrl"
                                type="url"
                                maxLength={500}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="https://example.com/your-photo.jpg"
                                value={profilePictureUrl}
                                onChange={(e) => setProfilePictureUrl(e.target.value)}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Optional: Add a URL to your profile picture
                            </p>
                        </div>

                        {/* Bio */}
                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                rows={4}
                                maxLength={200}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Tell us a bit about yourself..."
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Optional: Share a short bio about yourself (max 200 characters)
                            </p>
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
                            disabled={isLoading || !!usernameError || !!emailError || !!passwordError}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Creating account...' : 'Create account'}
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-indigo-600 hover:text-indigo-500 text-sm"
                        >
                            Already have an account? Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;