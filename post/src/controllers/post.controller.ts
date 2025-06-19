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
                error: 'Le contenu et l\'email de l\'auteur sont requis' 
            });
        }

        if (content.length > 280) {
            return res.status(400).json({ 
                error: 'Le contenu ne peut pas dépasser 280 caractères' 
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

export const editPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { content, tags, imageUrl, videoUrl }: EditPostBody = req.body;

        if (!id) {
            return res.status(400).json({ 
                error: 'ID du post requis' 
            });
        }

        if (!content && !tags && !imageUrl && !videoUrl) {
            return res.status(400).json({ 
                error: 'Au moins un champ à modifier doit être fourni' 
            });
        }

        if (content && content.length > 280) {
            return res.status(400).json({ 
                error: 'Le contenu ne peut pas dépasser 280 caractères' 
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

export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ 
                error: 'ID du post requis' 
            });
        }

        const deletedPost = await Post.findByIdAndDelete(id);

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
                authorEmail: deletedPost.authorEmail
            }
        });

    } catch (error) {
        console.error('Erreur lors de la suppression du post:', error);
        return res.status(500).json({ 
            error: 'Erreur interne du serveur' 
        });
    }
};

export const likePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userEmail } = req.body;

        if (!id) {
            return res.status(400).json({ 
                error: 'ID du post requis' 
            });
        }

        if (!userEmail) {
            return res.status(400).json({ 
                error: 'Email de l\'utilisateur requis' 
            });
        }

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ 
                error: 'Post non trouvé' 
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
            action = 'déliké';
        } else {
            updatedPost = await Post.findByIdAndUpdate(
                id,
                { $addToSet: { likes: userEmail } },
                { new: true }
            );
            action = 'liké';
        }

        return res.status(200).json({
            message: `Post ${action} avec succès !`,
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
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ 
                error: 'Email de l\'utilisateur requis' 
            });
        }

        const userPosts = await Post.find({ authorEmail: email })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'Posts de l\'utilisateur récupérés avec succès',
            userEmail: email,
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

export const getPostsTest = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).limit(5);
        return res.status(200).json({
            message: 'Posts récupérés avec succès',
            count: posts.length,
            posts
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des posts:', error);
        return res.status(500).json({ 
            error: 'Erreur interne du serveur' 
        });
    }
}; 