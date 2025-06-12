import { Router } from 'express';
import { register, login, authenticate } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
// router.post('/register', register);
// router.post('/authenticate', authenticate);

export default router;