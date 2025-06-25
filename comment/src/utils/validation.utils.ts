// Validation and sanitization utilities

export const sanitizeString = (input: string): string => {
    if (!input || typeof input !== 'string') {
        return '';
    }

    const withoutHtml = input.replace(/<[^>]*>/g, '');

    const withoutScript = withoutHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    const withoutDangerous = withoutScript.replace(/[<>'"&]/g, '');

    return withoutDangerous.trim();
};

export const isValidUsername = (username: string): { isValid: boolean; error?: string } => {
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
        return { isValid: false, error: 'Username can only contain letters, numbers, and the following characters: ! - _ .' };
    }

    return { isValid: true };
};

export const isValidEmail = (email: string): boolean => {
    if (!email || typeof email !== 'string') {
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};

export const sanitizeContent = (content: string): string => {
    if (!content || typeof content !== 'string') {
        return '';
    }

    const sanitized = content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
        .replace(/<iframe[^>]*>/gi, '')
        .replace(/<object[^>]*>/gi, '')
        .replace(/<embed[^>]*>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');

    return sanitized.trim();
};