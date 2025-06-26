import { useCallback } from 'react';
import { useAppSelector } from '../store/hooks';

export const useApi = () => {
    const { token } = useAppSelector((state) => state.auth);

    const apiCall = useCallback(async (url: string, options: RequestInit = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (response.status === 401) {
                // Token expired or invalid - could dispatch logout here
                throw new Error('Unauthorized');
            }

            // Check if response is HTML (error page) instead of JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
                // This is likely an nginx error page
                if (response.status === 413) {
                    throw new Error('Fichier trop volumineux. La taille maximale est de 15MB.');
                } else if (response.status === 408) {
                    throw new Error('Délai d\'attente dépassé. Veuillez réessayer.');
                } else if (response.status === 504) {
                    throw new Error('Délai d\'attente du serveur. Veuillez réessayer.');
                } else {
                    throw new Error(`Erreur du serveur (${response.status}). Veuillez réessayer.`);
                }
            }

            return response;
        } catch (error) {
            // If it's a network error or fetch error
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                throw new Error('Erreur de connexion. Vérifiez votre connexion internet.');
            }
            
            // Re-throw other errors as-is
            throw error;
        }
    }, [token]);

    return { apiCall };
};