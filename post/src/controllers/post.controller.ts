import { Request, Response } from 'express';
import Post, { IPost } from '../models/post.model';

export interface CreatePostBody {
    content: string;
    authorEmail: string;
    authorUsername?: string;
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

export const createPost = async (req: Request, res: Response) => {
    try {
        const { content, authorEmail, authorUsername, tags, imageUrl, videoUrl }: CreatePostBody = req.body;

        if (!content || !authorEmail) {
            return res.status(400).json({ 
                error: 'Content and author email are required' 
            });
        }

        if (content.length > 280) {
            return res.status(400).json({ 
                error: 'Content cannot exceed 280 characters' 
            });
        }

        const newPost = new Post({
            content,
            authorEmail,
            authorUsername: authorUsername || '',
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

export const editPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { content, tags, imageUrl, videoUrl }: EditPostBody = req.body;

        if (!id) {
            return res.status(400).json({ 
                error: 'Post ID required' 
            });
        }

        if (!content && !tags && !imageUrl && !videoUrl) {
            return res.status(400).json({ 
                error: 'At least one field to update must be provided' 
            });
        }

        if (content && content.length > 280) {
            return res.status(400).json({ 
                error: 'Content cannot exceed 280 characters' 
            });
        }

        const updateData: any = {};
        if (content) updateData.content = content;
        if (tags) updateData.tags = tags;
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
        if (videoUrl !== undefined) updateData.videoUrl = videoUrl;

        const updatedPost = await Post.findByIdAndUpdate(
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

export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ 
                error: 'Post ID required' 
            });
        }

        const deletedPost = await Post.findByIdAndDelete(id);

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
                authorEmail: deletedPost.authorEmail
            }
        });

    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
};

export const likePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userEmail } = req.body;

        if (!id) {
            return res.status(400).json({ 
                error: 'Post ID required' 
            });
        }

        if (!userEmail) {
            return res.status(400).json({ 
                error: 'User email required' 
            });
        }

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ 
                error: 'Post not found' 
            });
        }

        const hasLiked = post.likes.includes(userEmail);

        let updatedPost;
        let action;

        if (hasLiked) {
            updatedPost = await Post.findByIdAndUpdate(
                id,
                { $pull: { likes: userEmail } },
                { new: true }
            );
            action = 'unliked';
        } else {
            updatedPost = await Post.findByIdAndUpdate(
                id,
                { $addToSet: { likes: userEmail } },
                { new: true }
            );
            action = 'liked';
        }

        return res.status(200).json({
            message: `Post ${action} successfully!`,
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
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ 
                error: 'User email required' 
            });
        }

        const userPosts = await Post.find({ authorEmail: email })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'User posts retrieved successfully',
            userEmail: email,
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

export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).limit(5);
        return res.status(200).json({
            message: 'Posts retrieved successfully',
            count: posts.length,
            posts
        });
    } catch (error) {
        console.error('Error retrieving posts:', error);
        return res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
}