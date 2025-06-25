import { Router } from 'express';
import { getFollowers, getFollowing, getFollowersCurrentUser, getFollowingCurrentUser, isFollowedByCurrentUser, getFollowersCount, getFollowingCount, followUser, unfollowUser } from '../controllers/follow.controller';
import { currentUser as getCurrentUser } from '../middlewares/currentUser.middleware';

const router = Router();

// Following/followers for current user
router.get('/followers', getCurrentUser(true), getFollowersCurrentUser);
router.get('/following', getCurrentUser(true), getFollowingCurrentUser);

// Following/followers for other users
router.get('/followers/:id', getFollowers);
router.get('/following/:id', getFollowing);

// Is followed by current user
router.get('/followed/:id', getCurrentUser(true), isFollowedByCurrentUser);

// Following/followers count for other users
router.get('/followers/:id/count', getFollowersCount);
router.get('/following/:id/count', getFollowingCount);

// Follow/unfollow for current user
router.post('/:id', getCurrentUser(true), followUser);
router.delete('/:id', getCurrentUser(true), unfollowUser);

export default router;
