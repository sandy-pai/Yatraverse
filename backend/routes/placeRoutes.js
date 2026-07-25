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
import { uploadImage } from '../middleware/upload.js';
import { ratePlace } from '../controllers/ratingController.js';

const router = express.Router();

// Public routes
router.route('/').get(getPlaces);
router.route('/search').get(searchPlaces);
router.route('/state/:state').get(getPlacesByState);
router.route('/states').get(getStates);
router.route('/:id').get(getPlaceById);

// Protected routes (require authentication + admin role)
router.route('/').post(protect, adminOnly, uploadImage, createPlace);
router.route('/:id').put(protect, adminOnly, uploadImage, updatePlace);
router.route('/:id').delete(protect, adminOnly, deletePlace);
router.route('/:id/rate').post(protect, ratePlace);

export default router;