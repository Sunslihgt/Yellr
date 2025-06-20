import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    content: string;
    authorEmail: string;
    authorUsername: string;
    postId: mongoose.Types.ObjectId;
    parentCommentId?: mongoose.Types.ObjectId;
    likes: string[];
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
    content: {
        type: String,
        required: [true, 'Le contenu du commentaire est requis'],
        maxlength: [280, 'Le commentaire ne peut pas dépasser 280 caractères'],
        trim: true
    },
    authorEmail: {
        type: String,
        required: [true, 'L\'email de l\'auteur est requis'],
        trim: true,
        lowercase: true
    },
    authorUsername: {
        type: String,
        required: [true, 'Le nom d\'utilisateur est requis'],
        trim: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'L\'ID du post est requis'],
        ref: 'Post'
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    likes: [{
        type: String,
        trim: true,
        lowercase: true
    }]
}, {
    timestamps: true
});

CommentSchema.index({ postId: 1, createdAt: -1 });
CommentSchema.index({ parentCommentId: 1, createdAt: 1 });
CommentSchema.index({ authorEmail: 1 });

export default mongoose.model<IComment>('Comment', CommentSchema); 