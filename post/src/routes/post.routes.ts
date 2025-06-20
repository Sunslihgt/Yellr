import { Router } from 'express';
import { createPost, editPost, deletePost, likePost, getUserPosts, getPosts, getPost } from '../controllers/post.controller';
import { currentUser } from '../middlewares/currentUser.middleware';

const router = Router();

router.post('/', currentUser(true), createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.put('/:id', currentUser(true), editPost);
router.delete('/:id', currentUser(true), deletePost);

router.get('/user/:id', getUserPosts);
router.post('/:id/like', currentUser(true), likePost);

export default router;