import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtUserRequest } from '../@types/jwtRequest';

export const currentUser = (requireAuth: boolean) => {
    return (
        req: JwtUserRequest,
        res: Response,
        next: NextFunction
    ) => {
        let foundUserId = false;
        if (!req.headers.authorization) {
            if (requireAuth) {
                return res.status(401).json({ message: 'No authorization header' });
            } else {
                next();
            }
        } else {
            try {
                const token = req.headers.authorization.replace('Bearer ', '');
                console.log(token);
                if (token) {
                    const payload = jwt.decode(token) as { userId?: string, exp?: number } | null;
                    if (payload && payload.userId) {
                        // You have the userId from the token payload
                        req.jwtUserId = payload.userId;
                        foundUserId = true;
                    }
                }
            } catch (error) {
                return res.status(401).json({ message: 'Invalid token' });
            }
        }

        if (!foundUserId && requireAuth) {
            return res.status(401).json({ message: 'No user ID found' });
        }

        next();
    }
};