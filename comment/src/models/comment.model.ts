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
        required: [true, 'Le contenu du commentaire est requis'],
        maxlength: [280, 'Le commentaire ne peut pas dépasser 280 caractères'],
        trim: true
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'L\'ID de l\'auteur est requis']
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
        type: String
    }]
}, {
    timestamps: true
});

CommentSchema.index({ postId: 1, createdAt: -1 });
CommentSchema.index({ parentCommentId: 1, createdAt: 1 });
CommentSchema.index({ authorId: 1 });

export default mongoose.model<IComment>('Comment', CommentSchema);