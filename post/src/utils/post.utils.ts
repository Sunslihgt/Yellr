import mongoose from 'mongoose';
import PostModel from '../models/post.model';

export const postIdExists = async (postId: string | undefined) => {
    if (postId && mongoose.Types.ObjectId.isValid(postId)) {
        const postExists = await PostModel.exists({ _id: postId });
        return postExists !== null;
    }
    return false;
};