import express from 'express';
import {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  getStates,
  searchPlaces,
  getPlacesByState,
} from '../controllers/placeController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.route('/').get(getPlaces);
router.route('/search').get(searchPlaces);
router.route('/state/:state').get(getPlacesByState);
router.route('/states').get(getStates);
router.route('/:id').get(getPlaceById);

// Protected routes (require authentication)
router.route('/').post(protect, adminOnly, createPlace);
router.route('/:id').put(protect, adminOnly, updatePlace).delete(protect, adminOnly, deletePlace);

export default router;