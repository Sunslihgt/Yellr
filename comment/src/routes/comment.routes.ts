import { Router } from 'express';
import { createComment, replyToComment, getPostComments } from '../controllers/comment.controller';

const router = Router();

router.post('/comments', createComment);

router.post('/comments/:commentId/reply', replyToComment);

router.get('/comments/post/:postId', getPostComments);

export default router;