import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { getUserProfile, updateUserProfile } from '../controllers/userController';

const router = Router();

// All user routes require authentication
router.use(verifyToken);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

export default router;