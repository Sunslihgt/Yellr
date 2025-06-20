import { Request, Response } from 'express';
import { JwtUserRequest } from '../@types/jwtRequest';
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
        if (!await userIdExists(userId)) {
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
        if (!await userIdExists(userId)) {
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
        if (!await userIdExists(userId)) {
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
        if (!await userIdExists(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const followingCount = await FollowModel.countDocuments({ follower: userId });
        return res.status(200).json({ followingCount });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching following count', error });
    }
};

export const followUser = async (req: JwtUserRequest, res: Response) => {
    try {
        const userId = req.params.id;
        if (!await userIdExists(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        if (req.jwtUserId === undefined) {
            return res.status(400).json({ message: 'Current user ID is undefined' });
        }
        if (req.jwtUserId === userId) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }
        // Check if the user is already following the user
        const existingFollow = await FollowModel.findOne({
            follower: req.jwtUserId,
            following: userId
        });
        if (existingFollow) {
            return res.status(400).json({ message: 'You are already following this user' });
        }
        // Follow
        const follow = await FollowModel.create({
            follower: req.jwtUserId,
            following: userId
        });
        return res.status(200).json(follow);
    } catch (error) {
        return res.status(500).json({ message: 'Error following user', error });
    }
};

export const unfollowUser = async (req: JwtUserRequest, res: Response) => {
    try {
        const userId = req.params.id;
        if (!await userIdExists(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        if (req.jwtUserId === undefined) {
            return res.status(400).json({ message: 'Current user ID is undefined' });
        }
        if (req.jwtUserId === userId) {
            return res.status(400).json({ message: 'You cannot unfollow yourself' });
        }
        // Check if the user is following the user
        const existingFollow = await FollowModel.findOne({
            follower: req.jwtUserId,
            following: userId
        });
        if (!existingFollow) {
            return res.status(400).json({ message: 'You are not following this user' });
        }
        // Unfollow
        await FollowModel.findOneAndDelete({
            follower: req.jwtUserId,
            following: userId
        });
        return res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error unfollowing user', error });
    }
};

