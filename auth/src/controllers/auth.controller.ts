import { Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { compareSync, hashSync } from 'bcrypt';
import dotenv from 'dotenv';
import Auth from '../models/auth.model';
// import User from '../models/user.model';

dotenv.config({ path: './src/.env' });

export interface AuthBody {
    email: string;
    password: string;
}

const User_DB: Auth[] = [];


export const register = async (
    req: Request<{}, {}, AuthBody>,
    res: Response
) => {
    // if (!req.body || !req.body.email || !req.body.password) {
    //     return res.status(400).json({ msg: 'Email and password are required.' });
    // }
    // const newUserAuth = new Auth(
    //     req.body.email,
    //     hashSync(req.body.password, 10)
    // );
    // User_DB.push(newUserAuth);
    // return res.status(201).json({
    //     msg: 'New User created !'
    // });
    return res.status(201).json({
        msg: 'Register route is working'
    });
};

export const login = async (
    req: Request<{}, {}, AuthBody>,
    res: Response
) => {
    console.log(process.env.ACCESS_JWT_KEY);
    const { email, password } = req.body;

    const authUser = User_DB.find(
        (u) => u.email === email && compareSync(password, u.passwordHash)
    );


    if (authUser && process.env.ACCESS_JWT_KEY) {
        const accessToken = sign({
            email: authUser.email,
            exp: Math.floor(Date.now() / 1000) + 120
        },
            process.env.ACCESS_JWT_KEY
        );

        return res.status(200).json({ message: `You are now connected, token: ${accessToken}` });
    } else if (!process.env.ACCESS_JWT_KEY) {
        return res.status(401).json({ message: "Invalid JWT key" });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
};

export const authenticate = async (
    req: Request<{}, {}, AuthBody>,
    res: Response
) => {
    console.log('In authenticate');
    let tokenString = req.headers["authorization"];

    if (!tokenString?.startsWith('Bearer ') || tokenString.split('Bearer ').length < 2) {
        return res.status(401).json({ message: "Token absent or malformed" });
    }

    const token = tokenString.split('Bearer ')[1];

    if (!process.env.ACCESS_JWT_KEY) {
        return res.status(401).json({ message: "Invalid JWT key" });
    }

    verify(
        token,
        process.env.ACCESS_JWT_KEY,
        (err: any, decoded: any) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token" });
            }

            // Vérification si l’utilisateur décodé existe
            const user = User_DB.find(u => u.email === decoded.email);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Renvoyer une réponse adaptée
            return res.status(200).json({ message: "Token is valid", user: decoded.email });
        }
    );
};
