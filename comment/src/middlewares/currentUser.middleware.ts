import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtUserRequest } from '../@types/jwtRequest';

export const currentUserMiddleware = (req: JwtUserRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    
    console.log('Token reçu:', token);
    
    if (!token) {
        res.status(401).json({ error: 'Token manquant' });
        return;
    }

    try {
        const decoded = jwt.decode(token) as { userId?: string, exp?: number } | null;
        console.log('Token décodé avec succès:', decoded);
        
        if (decoded && decoded.userId) {
            req.jwtUserId = decoded.userId;
            next();
        } else {
            res.status(401).json({ error: 'Token invalide - pas d\'userId trouvé' });
            return;
        }
    } catch (error) {
        console.error('Erreur de décodage JWT:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(401).json({ error: 'Token invalide', details: errorMessage });
        return;
    }
}; 