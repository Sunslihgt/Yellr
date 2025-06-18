import { Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { compareSync, hashSync } from 'bcrypt';
import dotenv from 'dotenv';
import UserModel from '../models/user.model';

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

export const register = async (
    req: Request,
    res: Response
) => {
    if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).json({ msg: 'Email and password are required.' });
    }
    try {
        // Check if user already exists
        const existingUser = await UserModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ msg: 'User already exists.' });
        }
        // Create new user
        const hashedPassword = hashSync(req.body.password, 10);
        const newUser = new UserModel({
            email: req.body.email,
            passwordHash: hashedPassword,
        });
        await newUser.save();
        return res.status(201).json({
            msg: 'New User created !'
        });
    } catch (error) {
        return res.status(500).json({ msg: 'Error creating user', error });
    }
};

export const login = async (
    req: Request,
    res: Response
) => {
    const { email, password } = req.body;
    try {
        // Get user from database
        const user = await UserModel.findOne({ email });
        if (!user?.email || !user.passwordHash) {
            return res.status(401).json({ message: 'Invalid credentials : user not found' });
        }
        if (!compareSync(password, user.passwordHash)) {
            return res.status(401).json({ message: 'Invalid credentials : password does not match' });
        }
        
        // JWT token generation
        const jwtKey = process.env.ACCESS_JWT_KEY;
        if (!jwtKey) {
            return res.status(401).json({ message: 'Application JWT key is not set' });
        }
        const payload: JwtAuthPayload = {
            email: user.email,
            exp: Math.floor(Date.now() / 1000) + JWT_LENGTH
        };
        const accessToken = sign(
            payload,
            jwtKey
        );
        return res.status(200).json({
            message: 'You are now connected',
            token: accessToken
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error during login', error });
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
    const jwtKey = process.env.ACCESS_JWT_KEY;
    if (!jwtKey) {
        return res.status(401).json({ message: 'Invalid JWT key' });
    }
    verify(
        token,
        jwtKey,
        async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token' });
            }
            const typedDecoded = decoded as JwtAuthPayload;
            const now = Math.floor(Date.now() / 1000);
            if (typedDecoded.exp < now) {
                return res.status(403).json({ message: 'Token expired' });
            }
            try {
                const user = await UserModel.findOne({ email: typedDecoded.email });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                return res.status(200).json({
                    message: 'Token is valid',
                    email: typedDecoded.email,
                    exp: typedDecoded.exp
                });
            } catch (error) {
                return res.status(500).json({ message: 'Error during authentication', error });
            }
        }
    );
};
