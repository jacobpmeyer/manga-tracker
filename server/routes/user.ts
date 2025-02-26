import { Router } from 'express';
import auth from '../middleware/auth';

const router = Router();

// Example route for getting user profile
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
