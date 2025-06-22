import { Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { compareSync, hashSync } from 'bcrypt';
import dotenv from 'dotenv';
import UserModel from '../models/user.model';

dotenv.config({ path: './src/.env' });

const JWT_EXPIRATION = 60 * 60 * 24; // 1 day in seconds

export interface JwtAuthPayload {
    userId: string;
    exp: number;
}

export const register = async (
    req: Request,
    res: Response
) => {
    try {
        const { username, email, password, bio, profilePictureUrl } = req.body;
        if (!req.body || !req.body.username || !req.body.email || !req.body.password) {
            return res.status(400).json({ msg: 'Username, email and password are required.' });
        }

        // Check if user already exists
        const existingUsername = await UserModel.findOne({ username: username });
        if (existingUsername) {
            return res.status(409).json({ msg: 'Username already used.' });
        }
        const existingEmail = await UserModel.findOne({ email: email });
        if (existingEmail) {
            return res.status(409).json({ msg: 'Email already used.' });
        }

        // Create new user
        const hashedPassword = hashSync(password, 10);
        const newUser = new UserModel({
            username,
            email,
            passwordHash: hashedPassword,
            bio: bio || '',
            profilePictureUrl: profilePictureUrl || ''
        });
        await newUser.save();

        // JWT token generation
        const jwtKey = process.env.ACCESS_JWT_KEY;
        if (!jwtKey) {
            return res.status(401).json({ message: 'Application JWT key is not set' });
        }
        const payload: JwtAuthPayload = {
            userId: newUser._id.toString(),
            exp: Math.floor(Date.now() / 1000) + JWT_EXPIRATION
        };
        const accessToken = sign(
            payload,
            jwtKey
        );

        return res.status(200).json({
            message: 'You are now registered',
            token: accessToken,
            user: newUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error creating user', error });
    }
};

export const login = async (
    req: Request,
    res: Response
) => {
    const { username, password } = req.body;
    try {
        // Get user from database
        const user = await UserModel.findOne({ username });
        if (!user?.username || !user.passwordHash) {
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
            userId: user._id.toString(),
            exp: Math.floor(Date.now() / 1000) + JWT_EXPIRATION
        };
        const accessToken = sign(
            payload,
            jwtKey
        );

        return res.status(200).json({
            message: 'You are now connected',
            token: accessToken,
            user: user
        });
    } catch (error) {
        console.error(error);
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
                const user = await UserModel.findOne({ _id: typedDecoded.userId });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                return res.status(200).json({
                    message: 'Token is valid',
                    userId: typedDecoded.userId,
                    exp: typedDecoded.exp
                });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error during authentication', error });
            }
        }
    );
};
