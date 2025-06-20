import { Request, Response } from 'express';
import PostModel from '../models/post.model';
import { JwtUserRequest } from '../@types/jwtRequest';
import { userIdExists } from '../utils/user.utils';
import { postIdExists } from '../utils/post.utils';

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
                error: 'Le contenu et l\'id de l\'auteur sont requis'
            });
        }
        if (content.length > POST_MAX_LENGTH) {
            return res.status(400).json({
                error: `Le contenu ne peut pas dépasser ${POST_MAX_LENGTH} caractères`
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
            message: 'Post créé avec succès !',
            post: savedPost
        });
    } catch (error) {
        console.error('Erreur lors de la création du post:', error);
        return res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
};

export const editPost = async (req: JwtUserRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { content, tags, imageUrl, videoUrl }: EditPostBody = req.body;

        if (!id || !await postIdExists(id)) {
            return res.status(400).json({
                error: 'ID du post requis'
            });
        }
        if (!content && !tags && !imageUrl && !videoUrl) {
            return res.status(400).json({
                error: 'Au moins un champ à modifier doit être fourni'
            });
        }
        if (content && content.length > POST_MAX_LENGTH) {
            return res.status(400).json({ 
                error: `Le contenu ne peut pas dépasser ${POST_MAX_LENGTH} caractères`
            });
        }

        const updateData: any = {};
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
                error: 'Post non trouvé'
            });
        }

        return res.status(200).json({
            message: 'Post modifié avec succès !',
            post: updatedPost
        });
    } catch (error) {
        console.error('Erreur lors de la modification du post:', error);
        return res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
};

export const deletePost = async (req: JwtUserRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || !await postIdExists(id)) {
            return res.status(400).json({
                error: 'ID du post requis'
            });
        }

        const deletedPost = await PostModel.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).json({
                error: 'Post non trouvé'
            });
        }

        return res.status(200).json({
            message: 'Post supprimé avec succès !',
            deletedPost: {
                id: deletedPost._id,
                content: deletedPost.content,
                authorId: deletedPost.authorId
            }
        });
    } catch (error) {
        console.error('Erreur lors de la suppression du post:', error);
        return res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
};

export const likePost = async (req: JwtUserRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.jwtUserId;

        if (!id || !await postIdExists(id)) {
            return res.status(400).json({
                error: 'ID du post requis'
            });
        }

        if (!userId || !await userIdExists(userId)) {
            return res.status(400).json({
                error: 'Id de l\'utilisateur requis'
            });
        }

        const post = await PostModel.findById(id);
        if (!post) {
            return res.status(404).json({
                error: 'Post non trouvé'
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
            message: `Post ${hasLiked ? 'déliké' : 'liké'} avec succès !`,
            post: updatedPost,
            likesCount: updatedPost?.likes.length || 0,
            userHasLiked: !hasLiked
        });

    } catch (error) {
        console.error('Erreur lors du like du post:', error);
        return res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
};

export const getUserPosts = async (req: Request, res: Response) => {
    try {
        const { id: userId } = req.params;

        if (!userId || !await userIdExists(userId)) {
            return res.status(400).json({
                error: 'Id de l\'utilisateur requis'
            });
        }

        const userPosts = await PostModel.find({ authorId: userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'Posts de l\'utilisateur récupérés avec succès',
            userId: userId,
            count: userPosts.length,
            posts: userPosts
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des posts utilisateur:', error);
        return res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
};

export const getPosts = async (req: JwtUserRequest, res: Response) => {
    try {
        const postsLimit = req.query.limit ? Math.min(parseInt(req.query.limit as string), MAX_POST_LIMIT) : DEFAULT_POST_LIMIT;
        const postsOffset = req.query.offset ? parseInt(req.query.offset as string) : 0;

        const posts = await PostModel.find().sort({ createdAt: -1 }).limit(postsLimit).skip(postsOffset);

        return res.status(200).json({
            message: 'Posts récupérés avec succès',
            count: posts.length,
            limit: postsLimit,
            offset: postsOffset,
            posts: posts
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des posts:', error);
        return res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
};

export const getPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || !await postIdExists(id)) {
            return res.status(400).json({
                error: 'ID du post requis'
            });
        }

        const post = await PostModel.findById(id);
        if (!post) {
            return res.status(404).json({
                error: 'Post non trouvé'
            });
        }

        return res.status(200).json({
            message: 'Post récupéré avec succès',
            post: post
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du post:', error);
        return res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
};
