import { Router } from 'express';
import { createCommentOnPost, replyToComment, getPostComments, likeComment, editComment } from '../controllers/comment.controller';
import { currentUserMiddleware } from '../middlewares/currentUser.middleware';

const router = Router();

router.post('/comments/post/:postId', currentUserMiddleware, createCommentOnPost);

router.post('/comments/reply/:commentId', currentUserMiddleware, replyToComment);

router.put('/comments/:id/edit', currentUserMiddleware, editComment);

router.put('/comments/:id/like', currentUserMiddleware, likeComment);

router.get('/comments/post/:postId', getPostComments);

export default router;