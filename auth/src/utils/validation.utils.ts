// Validation and sanitization utilities for auth service

export const isValidUsername = (username: string): { isValid: boolean; error?: string } => {
    if (!username || typeof username !== 'string') {
        return { isValid: false, error: 'Username is required' };
    }

    // Trim whitespace
    const trimmedUsername = username.trim();

    // Check length (3-30 characters)
    if (trimmedUsername.length < 3) {
        return { isValid: false, error: 'Username must be at least 3 characters long' };
    }

    if (trimmedUsername.length > 30) {
        return { isValid: false, error: 'Username cannot exceed 30 characters' };
    }

    // Only allow: a-z, A-Z, 0-9, !, -, _, .
    const validPattern = /^[a-zA-Z0-9!\-_.]+$/;

    if (!validPattern.test(trimmedUsername)) {
        return { isValid: false, error: 'Username can only contain letters, numbers, and the following characters: ! - _ .' };
    }


    return { isValid: true };
};

export const isValidEmail = (email: string): { isValid: boolean; error?: string } => {
    if (!email || typeof email !== 'string') {
        return { isValid: false, error: 'Email is required' };
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return { isValid: false, error: 'Invalid email format' };
    }

    return { isValid: true };
};

export const isValidPassword = (password: string): { isValid: boolean; error?: string } => {
    if (!password || typeof password !== 'string') {
        return { isValid: false, error: 'Password is required' };
    }

    if (password.length < 8) {
        return { isValid: false, error: 'Password must be at least 8 characters long' };
    }

    if (password.length > 128) {
        return { isValid: false, error: 'Password cannot exceed 128 characters' };
    }

    return { isValid: true };
};