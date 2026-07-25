import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from '../controllers/wishlistController.js';

const router = express.Router();

router.route('/')
  .get(protect, getWishlist);

router.route('/:placeId')
  .post(protect, addToWishlist)
  .delete(protect, removeFromWishlist);

export default router;
