import { Router } from 'express';
import { createPost, editPost, deletePost, likePost, getUserPosts, getPostsTest } from '../controllers/post.controller';

const router = Router();

router.post('/posts', createPost);

router.get('/posts', getPostsTest);

router.get('/posts/user/:email', getUserPosts);

router.put('/posts/:id', editPost);

router.delete('/posts/:id', deletePost);

router.post('/posts/:id/like', likePost);

router.get('/posts/test', getPostsTest);

export default router;