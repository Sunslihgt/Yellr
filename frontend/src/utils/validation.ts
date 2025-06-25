export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const validateUsername = (username: string): ValidationResult => {
    if (!username || typeof username !== 'string') {
        return { isValid: false, error: 'Username is required' };
    }
    const trimmedUsername = username.trim();

    if (trimmedUsername.length < 3) {
        return { isValid: false, error: 'Username must be at least 3 characters long' };
    }

    if (trimmedUsername.length > 30) {
        return { isValid: false, error: 'Username cannot exceed 30 characters' };
    }

    const validPattern = /^[a-zA-Z0-9!\-_.]+$/;

    if (!validPattern.test(trimmedUsername)) {
        return {
            isValid: false,
            error: 'Username can only contain letters, numbers, and the following characters: ! - _ .'
        };
    }

    return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
    if (!email || typeof email !== 'string') {
        return { isValid: false, error: 'Email is required' };
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return { isValid: false, error: 'Invalid email format' };
    }

    return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
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

export const validatePasswordConfirmation = (password: string, confirmation: string): ValidationResult => {
    if (password !== confirmation) {
        return { isValid: false, error: 'Passwords do not match' };
    }

    return { isValid: true };
};

export const getUsernameRules = (): string => {
    return 'Allowed characters: letters (a-z, A-Z), numbers (0-9), and special characters ! - _ .';
};

export const isAllowedUsernameChar = (char: string): boolean => {
    return /[a-zA-Z0-9!\-_.]/.test(char);
};