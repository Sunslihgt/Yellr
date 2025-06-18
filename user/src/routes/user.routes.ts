import { Router } from 'express';
import { getUserById, updateUser, deleteUser, listUsers } from '../controllers/user.controller';

const router = Router();

router.get('/', listUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
