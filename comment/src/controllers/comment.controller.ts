import { Request, Response } from 'express';
import Comment, { IComment } from '../models/comment.model';
import { JwtUserRequest } from '../@types/jwtRequest';
import { userIdExists } from '../utils/user.utils';
import { commentIdExists } from '../utils/comment.utils';
import { postIdExists } from '../utils/post.utils';

export interface CreateCommentBody {
    content: string;
}

export interface ReplyToCommentBody {
    content: string;
}

export interface EditCommentBody {
    content: string;
}

export const createCommentOnPost = async (req: JwtUserRequest, res: Response) => {
    try {
        const { postId } = req.params;
        const { content }: CreateCommentBody = req.body;
        const authorId = req.jwtUserId;

        console.log('DEBUG - Creating comment on post:', {
            postId,
            content,
            authorId,
            jwtUserId: req.jwtUserId
        });

        if (!content || !postId || !authorId) {
            return res.status(400).json({
                error: 'Content, postId and authorId are required',
                debug: {
                    content: !!content,
                    postId: !!postId,
                    authorId: !!authorId,
                    jwtUserId: req.jwtUserId
                }
            });
        }

        if (!await postIdExists(postId)) {
            return res.status(400).json({
                error: 'Post not found'
            });
        }

        if (!await userIdExists(authorId)) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        if (content.length > 280) {
            return res.status(400).json({
                error: 'Comment cannot exceed 280 characters'
            });
        }

        const newComment = new Comment({
            content,
            authorId,
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

export const replyToComment = async (req: JwtUserRequest, res: Response) => {
    try {
        const { commentId } = req.params;
        const { content }: ReplyToCommentBody = req.body;
        const authorId = req.jwtUserId;

        console.log('DEBUG - Replying to comment:', {
            commentId,
            content,
            authorId,
            jwtUserId: req.jwtUserId
        });

        if (!commentId || !await commentIdExists(commentId)) {
            return res.status(400).json({
                error: 'Valid comment ID required'
            });
        }

        if (!content || !authorId) {
            return res.status(400).json({
                error: 'Content and authorId are required'
            });
        }

        if (!await userIdExists(authorId)) {
            return res.status(400).json({
                error: 'User not found'
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
                error: 'Parent comment not found'
            });
        }

        if (!await postIdExists(parentComment.postId.toString())) {
            return res.status(400).json({
                error: 'Associated post not found'
            });
        }

        const newReply = new Comment({
            content,
            authorId,
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
        console.error('Error creating reply:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const editComment = async (req: JwtUserRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { content }: EditCommentBody = req.body;
        const userId = req.jwtUserId;

        console.log('DEBUG - Editing comment:', {
            commentId: id,
            content,
            userId,
            jwtUserId: req.jwtUserId
        });

        if (!id || !await commentIdExists(id)) {
            return res.status(400).json({
                error: 'Valid comment ID required'
            });
        }

        if (!content) {
            return res.status(400).json({
                error: 'Content is required'
            });
        }

        if (!userId || !await userIdExists(userId)) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        if (content.length > 280) {
            return res.status(400).json({
                error: 'Comment cannot exceed 280 characters'
            });
        }

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                error: 'Comment not found'
            });
        }

        if (!await postIdExists(comment.postId.toString())) {
            return res.status(400).json({
                error: 'Associated post not found'
            });
        }

        // Check if the user is the author of the comment
        if (comment.authorId.toString() !== userId) {
            return res.status(403).json({
                error: 'You can only edit your own comments'
            });
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { content },
            { new: true, runValidators: true }
        );

        if (!updatedComment) {
            return res.status(404).json({
                error: 'Comment not found'
            });
        }

        return res.status(200).json({
            message: 'Comment updated successfully!',
            comment: updatedComment
        });

    } catch (error) {
        console.error('Error editing comment:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const likeComment = async (req: JwtUserRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.jwtUserId;

        if (!id || !await commentIdExists(id)) {
            return res.status(400).json({
                error: 'Valid comment ID required'
            });
        }

        if (!userId || !await userIdExists(userId)) {
            return res.status(400).json({
                error: 'User required'
            });
        }

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                error: 'Comment not found'
            });
        }

        if (!await postIdExists(comment.postId.toString())) {
            return res.status(400).json({
                error: 'Associated post not found'
            });
        }

        const hasLiked = comment.likes.includes(userId);
        const updatedComment = hasLiked ? await Comment.findByIdAndUpdate(
            id,
            { $pull: { likes: userId } },
            { new: true }
        ) : await Comment.findByIdAndUpdate(
            id,
            { $addToSet: { likes: userId } },
            { new: true }
        );

        if (!updatedComment) {
            return res.status(404).json({
                error: 'Comment not found'
            });
        }

        return res.status(200).json({
            message: `Comment ${hasLiked ? 'unliked' : 'liked'} successfully!`,
            comment: updatedComment,
            likesCount: updatedComment?.likes.length || 0,
            userHasLiked: !hasLiked
        });

    } catch (error) {
        console.error('Error liking comment:', error);
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

        if (!await postIdExists(postId)) {
            return res.status(400).json({
                error: 'Post not found'
            });
        }

        const comments = await Comment.find({ postId })
            .populate('authorId', 'username email bio profilePictureUrl')
            .sort({ createdAt: 1 });

        // Transform the data to match the expected format with author information
        const commentsWithAuthor = comments.map(comment => {
            const commentObj = comment.toObject();
            const author = commentObj.authorId as any;

            // Handle case where author might be null (user was deleted)
            if (!author) {
                return {
                    ...commentObj,
                    author: {
                        _id: commentObj.authorId,
                        username: 'Deleted User',
                        email: 'deleted@example.com',
                        bio: '',
                        profilePictureUrl: null
                    },
                    authorId: commentObj.authorId
                };
            }

            return {
                ...commentObj,
                author: author,
                authorId: author._id || author
            };
        });

        const commentsTree = buildCommentsTree(commentsWithAuthor);

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
            ...comment,
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