import { Request, Response } from 'express';
import { hashSync } from 'bcrypt';
import dotenv from 'dotenv';
import UserModel from '../models/user.model';

dotenv.config({ path: './.env' });

export const listUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find({}, '-passwordHash'); // Exclude passwordHash
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users', error });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findById(req.params.id, '-passwordHash');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching user', error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { username, bio, profilePictureUrl, password, role } = req.body;
    try {
        const updateData: any = { username, bio, profilePictureUrl, role };
        if (password) {
            updateData.passwordHash = hashSync(password, 10);
        }
        // Remove undefined fields
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
        if(Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No fields to update, please provide either username, bio, profilePictureUrl, role or password' });
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, select: '-passwordHash' }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating user', error });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting user', error });
    }
};
