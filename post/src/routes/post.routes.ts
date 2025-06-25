import { Router } from 'express';
import { createPost, editPost, deletePost, likePost, getUserPosts, getUserLikedPosts, getPosts, getPost, searchPosts } from '../controllers/post.controller';
import { currentUser } from '../middlewares/currentUser.middleware';

const router = Router();

router.post('/search/', currentUser(true), searchPosts);

router.post('/', currentUser(true), createPost);
router.get('/', currentUser(true), getPosts);
router.get('/:id', getPost);
router.put('/:id', currentUser(true), editPost);
router.delete('/:id', currentUser(true), deletePost);

router.get('/user/:id', getUserPosts);
router.get('/user/:id/liked', getUserLikedPosts);
router.post('/:id/like', currentUser(true), likePost);

export default router;