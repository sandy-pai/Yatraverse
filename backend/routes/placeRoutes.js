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

const router = express.Router();

router.route('/').get(getPlaces).post(createPlace);
router.route('/search').get(searchPlaces);
router.route('/state/:state').get(getPlacesByState);
router.route('/states').get(getStates);
router.route('/:id').get(getPlaceById).put(updatePlace).delete(deletePlace);

export default router;