import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    content: string;
    authorEmail: string;
    authorUsername?: string;
    tags: string[];
    likes: string[];
    createdAt: Date;
    updatedAt: Date;
    imageUrl?: string;
    videoUrl?: string;
}

const PostSchema: Schema = new Schema({
    content: {
        type: String,
        required: true,
        maxlength: 280
    },
    authorEmail: {
        type: String,
        required: true
    },
    authorUsername: {
        type: String,
        default: ''
    },
    tags: [{
        type: String,
        trim: true
    }],
    likes: [{
        type: String
    }],
    imageUrl: {
        type: String,
        default: null
    },
    videoUrl: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

PostSchema.index({ authorEmail: 1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ createdAt: -1 });

export default mongoose.model<IPost>('Post', PostSchema); 