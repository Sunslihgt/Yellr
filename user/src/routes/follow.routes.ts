import { Router } from 'express';
import { getFollowers, getFollowing, getFollowersCount, getFollowingCount } from '../controllers/follow.controller';

const router = Router();

// Follow routes
// router.delete('/:id', deleteFollower); // TODO: Implement delete follower
router.get('/followers/:id', getFollowers);
router.get('/following/:id', getFollowing);
router.get('/followers/:id/count', getFollowersCount);
router.get('/following/:id/count', getFollowingCount);

export default router;
