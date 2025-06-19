import { Request, Response } from 'express';
import dotenv from 'dotenv';
import FollowModel from '../models/follow.model';
import mongoose from 'mongoose';
import UserModel from '../models/user.model';

dotenv.config({ path: './.env' });

const userIdExists = async (userId: string) => {
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        const userExists = await UserModel.exists({ _id: userId });
        return userExists !== null;
    }
    return false;
};

export const getFollowers = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        if (!userId || !mongoose.Types.ObjectId.isValid(userId) || !await userIdExists(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const followers = await FollowModel.find({ following: userId }).populate('follower', '-passwordHash').lean();
        return res.status(200).json(followers);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching followers', error });
    }
};

export const getFollowing = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        if (!userId || !mongoose.Types.ObjectId.isValid(userId) || !await userIdExists(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const following = await FollowModel.find({ follower: userId }).populate('following', '-passwordHash').lean();
        return res.status(200).json(following);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching following', error });
    }
};

export const getFollowersCount = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        if (!userId || !mongoose.Types.ObjectId.isValid(userId) || !await userIdExists(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const followersCount = await FollowModel.countDocuments({ following: userId });
        return res.status(200).json({ followersCount });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching followers count', error });
    }
};

export const getFollowingCount = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        if (!userId || !mongoose.Types.ObjectId.isValid(userId) || !await userIdExists(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const followingCount = await FollowModel.countDocuments({ follower: userId });
        return res.status(200).json({ followingCount });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching following count', error });
    }
};

