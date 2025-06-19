import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    content: string;
    authorId: string;
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
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

PostSchema.index({ authorId: 1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ createdAt: -1 });

const PostModel = mongoose.model<IPost>('Post', PostSchema);

export default PostModel;
