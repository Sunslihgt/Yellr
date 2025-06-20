import { Router } from 'express';
import { getFollowers, getFollowing, getFollowersCount, getFollowingCount, followUser, unfollowUser } from '../controllers/follow.controller';
import { currentUser as getCurrentUser } from '../middlewares/currentUser.middleware';

const router = Router();

// Follow routes
router.get('/followers/:id', getFollowers);
router.get('/following/:id', getFollowing);
router.get('/followers/:id/count', getFollowersCount);
router.get('/following/:id/count', getFollowingCount);

router.post('/:id', getCurrentUser(true), followUser);
router.delete('/:id', getCurrentUser(true), unfollowUser);

export default router;
