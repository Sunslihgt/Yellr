import mongoose from 'mongoose';

// Simple Post model for validation (without importing the full post service model)
const postSchema = new mongoose.Schema({
    content: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String }],
    likes: [{ type: String }],
    imageUrl: { type: String, default: null },
    videoUrl: { type: String, default: null }
}, { timestamps: true });

const PostModel = mongoose.model('Post', postSchema);

export const postIdExists = async (postId: string | undefined) => {
    if (postId && mongoose.Types.ObjectId.isValid(postId)) {
        const postExists = await PostModel.exists({ _id: postId });
        return postExists !== null;
    }
    return false;
};