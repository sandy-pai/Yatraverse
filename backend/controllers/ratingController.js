import Place from '../models/Place.js';

// @desc    Rate a place (add or update user rating)
// @route   POST /api/places/:id/rate
// @access  Protected (any logged-in user)
export const ratePlace = async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    const { value } = req.body;
    const ratingVal = Number(value);
    if (!ratingVal || ratingVal < 1 || ratingVal > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
    }

    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    // Find existing rating by this user
    const existing = place.ratings.find((r) => r.user.toString() === userId);
    if (existing) {
      existing.value = ratingVal;
    } else {
      place.ratings.push({ user: userId, value: ratingVal });
    }

    await place.save();
    // Return the new average rating
    res.json({ averageRating: place.averageRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
