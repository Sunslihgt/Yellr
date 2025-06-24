import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtUserRequest } from '../@types/jwtRequest';

export const currentUserMiddleware = (req: JwtUserRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    
    console.log('Token received:', token);
    
    if (!token) {
        res.status(401).json({ error: 'Token missing' });
        return;
    }

    try {
        const decoded = jwt.decode(token) as { userId?: string, exp?: number } | null;
        console.log('Token decoded successfully:', decoded);
        
        if (decoded && decoded.userId) {
            req.jwtUserId = decoded.userId;
            next();
        } else {
            res.status(401).json({ error: 'Invalid token - no userId found' });
            return;
        }
    } catch (error) {
        console.error('JWT decoding error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(401).json({ error: 'Invalid token', details: errorMessage });
        return;
    }
}; 