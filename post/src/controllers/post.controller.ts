import { Request, Response } from 'express';
import PostModel from '../models/post.model';
import { JwtUserRequest } from '../@types/jwtRequest';
import { userIdExists } from '../utils/user.utils';
import { postIdExists } from '../utils/post.utils';
import { IPost } from '../models/post.model';

export interface CreatePostBody {
    content: string;
    authorId?: string;
    tags?: string[];
    imageUrl?: string;
    videoUrl?: string;
}

export interface EditPostBody {
    content?: string;
    tags?: string[];
    imageUrl?: string;
    videoUrl?: string;
}

const POST_MAX_LENGTH = 280;
const DEFAULT_POST_LIMIT = 5; // Amount of posts to return by default
const MAX_POST_LIMIT = 30; // Maximum amount of posts to return

export const createPost = async (req: JwtUserRequest, res: Response) => {
    try {
        const { content, tags, imageUrl, videoUrl }: CreatePostBody = req.body;
        const authorId = req.jwtUserId;

        if (!content || !await userIdExists(authorId)) {
            console.log(content, authorId, await userIdExists(authorId || ''));
            return res.status(400).json({
                error: 'Content and author id are required'
            });
        }
        if (content.length > POST_MAX_LENGTH) {
            return res.status(400).json({
                error: `Content cannot exceed ${POST_MAX_LENGTH} characters`
            });
        }

        const newPost = new PostModel({
            content,
            authorId,
            tags: tags || [],
            likes: [],
            imageUrl: imageUrl || null,
            videoUrl: videoUrl || null
        });
        const savedPost = await newPost.save();

        return res.status(201).json({
            message: 'Post created successfully!',
            post: savedPost
        });
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const editPost = async (req: JwtUserRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { content, tags, imageUrl, videoUrl }: EditPostBody = req.body;

        if (!id || !await postIdExists(id)) {
            return res.status(400).json({
                error: 'Post ID required'
            });
        }
        if (!content && !tags && !imageUrl && !videoUrl) {
            return res.status(400).json({
                error: 'At least one field to update must be provided'
            });
        }
        if (content && content.length > POST_MAX_LENGTH) {
            return res.status(400).json({
                error: `Content cannot exceed ${POST_MAX_LENGTH} characters`
            });
        }

        const updateData: Partial<IPost> = {};
        if (content) updateData.content = content;
        if (tags) updateData.tags = tags;
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
        if (videoUrl !== undefined) updateData.videoUrl = videoUrl;

        const updatedPost = await PostModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).json({
                error: 'Post not found'
            });
        }

        return res.status(200).json({
            message: 'Post updated successfully!',
            post: updatedPost
        });
    } catch (error) {
        console.error('Error updating post:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const deletePost = async (req: JwtUserRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || !await postIdExists(id)) {
            return res.status(400).json({
                error: 'Post ID required'
            });
        }

        const deletedPost = await PostModel.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).json({
                error: 'Post not found'
            });
        }

        return res.status(200).json({
            message: 'Post deleted successfully!',
            deletedPost: {
                id: deletedPost._id,
                content: deletedPost.content,
                authorId: deletedPost.authorId
            }
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const likePost = async (req: JwtUserRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.jwtUserId;

        if (!id || !await postIdExists(id)) {
            return res.status(400).json({
                error: 'Post ID required'
            });
        }

        if (!userId || !await userIdExists(userId)) {
            return res.status(400).json({
                error: 'User email required'
            });
        }

        const post = await PostModel.findById(id);
        if (!post) {
            return res.status(404).json({
                error: 'Post not found'
            });
        }

        const hasLiked = post.likes.includes(userId);
        const updatedPost = hasLiked ? await PostModel.findByIdAndUpdate(
            id,
            { $pull: { likes: userId } },
            { new: true }
        ) : await PostModel.findByIdAndUpdate(
            id,
            { $addToSet: { likes: userId } },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({
                error: 'Post not found'
            });
        }

        return res.status(200).json({
            message: `Post ${hasLiked ? 'unliked' : 'liked'} avec succès !`,
            post: updatedPost,
            likesCount: updatedPost?.likes.length || 0,
            userHasLiked: !hasLiked
        });

    } catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getUserPosts = async (req: Request, res: Response) => {
    try {
        const { id: userId } = req.params;

        if (!userId || !await userIdExists(userId)) {
            return res.status(400).json({
                error: 'User email required'
            });
        }

        const userPosts = await PostModel.find({ authorId: userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'User posts retrieved successfully',
            userId: userId,
            count: userPosts.length,
            posts: userPosts
        });
    } catch (error) {
        console.error('Error retrieving user posts:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getPosts = async (req: JwtUserRequest, res: Response) => {
    try {
        const postsLimit = req.query.limit ? Math.min(parseInt(req.query.limit as string), MAX_POST_LIMIT) : DEFAULT_POST_LIMIT;
        const postsOffset = req.query.offset ? parseInt(req.query.offset as string) : 0;

        const posts = await PostModel.find()
            .populate('authorId', 'username email bio profilePictureUrl')
            .sort({ createdAt: -1 })
            .limit(postsLimit)
            .skip(postsOffset);

        // Transform the data to match the expected frontend format
        const postsWithAuthor = posts.map(post => {
            const postObj = post.toObject();
            const author = postObj.authorId as any; // Type assertion for populated field

            // Handle case where author might be null (user was deleted)
            if (!author) {
                return {
                    ...postObj,
                    author: {
                        _id: postObj.authorId,
                        username: 'Deleted User',
                        email: 'deleted@example.com',
                        bio: '',
                        profilePictureUrl: null
                    },
                    authorId: postObj.authorId
                };
            }

            return {
                ...postObj,
                author: author,
                authorId: author._id || author
            };
        });

        const totalCount = await PostModel.countDocuments();

        return res.status(200).json({
            message: 'Posts retrieved successfully',
            count: posts.length,
            totalCount: totalCount,
            limit: postsLimit,
            offset: postsOffset,
            posts: postsWithAuthor
        });
    } catch (error) {
        console.error('Error retrieving posts:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || !await postIdExists(id)) {
            return res.status(400).json({
                error: 'Post id required'
            });
        }

        const post = await PostModel.findById(id);
        if (!post) {
            return res.status(404).json({
                error: 'Post not found'
            });
        }

        return res.status(200).json({
            message: 'Post retrieved successfully',
            post: post
        });
    } catch (error) {
        console.error('Error retrieving post:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};
