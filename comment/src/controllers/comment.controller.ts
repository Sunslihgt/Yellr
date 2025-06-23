import { Request, Response } from 'express';
import Comment, { IComment } from '../models/comment.model';

export interface CreateCommentBody {
    content: string;
    authorEmail: string;
    authorUsername: string;
    postId: string;
}

export interface ReplyToCommentBody {
    content: string;
    authorEmail: string;
    authorUsername: string;
}

export const createComment = async (req: Request, res: Response) => {
    try {
        const { content, authorEmail, authorUsername, postId }: CreateCommentBody = req.body;

        if (!content || !authorEmail || !authorUsername || !postId) {
            return res.status(400).json({
                error: 'All fields are required (content, authorEmail, authorUsername, postId)'
            });
        }

        if (content.length > 280) {
            return res.status(400).json({
                error: 'Comment cannot exceed 280 characters'
            });
        }

        const newComment = new Comment({
            content,
            authorEmail,
            authorUsername,
            postId,
            parentCommentId: null,
            likes: []
        });

        const savedComment = await newComment.save();

        return res.status(201).json({
            message: 'Comment created successfully!',
            comment: savedComment
        });

    } catch (error) {
        console.error('Error creating comment:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const replyToComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const { content, authorEmail, authorUsername }: ReplyToCommentBody = req.body;

        if (!commentId) {
            return res.status(400).json({
                error: 'Comment ID required'
            });
        }

        if (!content || !authorEmail || !authorUsername) {
            return res.status(400).json({
                error: 'All fields are required (content, authorEmail, authorUsername)'
            });
        }

        if (content.length > 280) {
            return res.status(400).json({
                error: 'Reply cannot exceed 280 characters'
            });
        }

        const parentComment = await Comment.findById(commentId);
        if (!parentComment) {
            return res.status(404).json({
                error: 'Comment not found'
            });
        }

        const newReply = new Comment({
            content,
            authorEmail,
            authorUsername,
            postId: parentComment.postId,
            parentCommentId: commentId,
            likes: []
        });

        const savedReply = await newReply.save();

        return res.status(201).json({
            message: 'Reply to comment created successfully!',
            reply: savedReply
        });

    } catch (error) {
        console.error('Error creating reply to comment:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getPostComments = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        if (!postId) {
            return res.status(400).json({
                error: 'Post ID required'
            });
        }

        const comments = await Comment.find({ postId })
            .sort({ createdAt: 1 });

        const commentsTree = buildCommentsTree(comments);

        return res.status(200).json({
            message: 'Comments retrieved successfully',
            postId: postId,
            count: comments.length,
            comments: commentsTree
        });

    } catch (error) {
        console.error('Error retrieving comments:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

const buildCommentsTree = (comments: any[]) => {
    const commentsMap = new Map();
    const rootComments: any[] = [];

    comments.forEach(comment => {
        const commentObj = {
            ...comment.toObject(),
            replies: []
        };
        commentsMap.set(comment._id.toString(), commentObj);
    });

    comments.forEach(comment => {
        const commentObj = commentsMap.get(comment._id.toString());

        if (comment.parentCommentId) {
            const parentComment = commentsMap.get(comment.parentCommentId.toString());
            if (parentComment) {
                parentComment.replies.push(commentObj);
            }
        } else {
            rootComments.push(commentObj);
        }
    });

    return rootComments;
};