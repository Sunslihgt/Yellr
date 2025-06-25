import mongoose from 'mongoose';
import Comment from '../models/comment.model';

export const commentIdExists = async (commentId: string | undefined) => {
    if (commentId && mongoose.Types.ObjectId.isValid(commentId)) {
        const commentExists = await Comment.exists({ _id: commentId });
        return commentExists !== null;
    }
    return false;
};