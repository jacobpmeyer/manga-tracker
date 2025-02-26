import { Router } from 'express';
import {
  getUserManga,
  addManga,
  updateMangaStatus,
  updateMangaOwnership,
  deleteManga,
  searchManga,
  getMangaByMalId
} from '../controllers/mangaController';
import auth from '../middleware/auth';

const router = Router();

// Protected routes (require authentication)
router.get('/', auth, getUserManga);
router.post('/', auth, addManga);
router.put('/:mangaId/status', auth, updateMangaStatus);
router.put('/:mangaId/ownership', auth, updateMangaOwnership);
router.delete('/:mangaId', auth, deleteManga);

// Public routes
router.get('/search', searchManga);
router.get('/mal/:malId', getMangaByMalId);

export default router;
