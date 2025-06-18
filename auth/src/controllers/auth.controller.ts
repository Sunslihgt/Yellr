import { Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { compareSync, hashSync } from 'bcrypt';
import dotenv from 'dotenv';
import Auth from '../models/auth.model';

dotenv.config({ path: './src/.env' });

const JWT_LENGTH = 60 * 60 * 24; // 1 day in seconds

export interface AuthBody {
    email: string;
    password: string;
}

export interface JwtAuthPayload {
    email: string;
    exp: number;
}

const User_DB: Auth[] = [];


export const register = async (
    req: Request,
    res: Response
) => {
    if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).json({ msg: 'Email and password are required.' });
    }
    const newUserAuth = new Auth(
        req.body.email,
        hashSync(req.body.password, 10)
    );
    User_DB.push(newUserAuth);
    return res.status(201).json({
        msg: 'New User created !'
    });
};

export const login = async (
    req: Request,
    res: Response
) => {
    const { email, password } = req.body;
    
    if (User_DB.length === 0) {
        return res.status(401).json({ message: 'No users in DB' });
    }

    const authUser = User_DB.find(
        (u) => u.email === email && compareSync(password, u.passwordHash)
    );

    if (authUser && process.env.ACCESS_JWT_KEY) {
        const payload: JwtAuthPayload = {
            email: authUser.email,
            exp: Math.floor(Date.now() / 1000) + JWT_LENGTH
        };

        const accessToken = sign(
            payload,
            process.env.ACCESS_JWT_KEY
        );

        return res.status(200).json({
            message: 'You are now connected',
            token: accessToken
        });
    } else if (!process.env.ACCESS_JWT_KEY) {
        return res.status(401).json({ message: 'Application JWT key is not set' });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
};

export const authenticate = async (
    req: Request,
    res: Response
) => {
    const tokenString = req.headers['authorization'];
    if (!tokenString?.startsWith('Bearer ') || tokenString.split('Bearer ').length < 2) {
        return res.status(401).json({ message: 'Token absent or malformed' });
    }

    const token = tokenString.split('Bearer ')[1];
    if (!process.env.ACCESS_JWT_KEY) {
        return res.status(401).json({ message: 'Invalid JWT key' });
    }

    verify(
        token,
        process.env.ACCESS_JWT_KEY,
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token' });
            }

            // Casting the decoded token to a specific type
            const typedDecoded = decoded as JwtAuthPayload;

            // Check if the token is expired
            const now = Math.floor(Date.now() / 1000);
            if (typedDecoded.exp < now) {
                return res.status(403).json({ message: 'Token expired' });
            }

            const user = User_DB.find(u => u.email === typedDecoded.email);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({
                message: 'Token is valid',
                email: typedDecoded.email,
                exp: typedDecoded.exp
            });
        }
    );
};
