import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    content: string;
    authorId: string;
    postId: mongoose.Types.ObjectId;
    parentCommentId?: mongoose.Types.ObjectId;
    likes: string[];
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        maxlength: [280, 'Comment cannot exceed 280 characters'],
        trim: true
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author ID is required']
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Post ID is required'],
        ref: 'Post'
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    likes: [{
        type: String
    }]
}, {
    timestamps: true
});

CommentSchema.index({ postId: 1, createdAt: -1 });
CommentSchema.index({ parentCommentId: 1, createdAt: 1 });
CommentSchema.index({ authorId: 1 });

export default mongoose.model<IComment>('Comment', CommentSchema);