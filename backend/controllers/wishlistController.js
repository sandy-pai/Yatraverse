import User from '../models/User.js';
import Place from '../models/Place.js';

// @desc    Add a place to wishlist
// @route   POST /api/wishlist/:placeId
// @access  Private
export const addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const { placeId } = req.params;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if place exists
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Add to wishlist if not already present
    if (!user.wishlist.includes(placeId)) {
      user.wishlist.push(placeId);
      await user.save();
    }

    res.status(200).json({ message: 'Place added to wishlist', wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove a place from wishlist
// @route   DELETE /api/wishlist/:placeId
// @access  Private
export const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const { placeId } = req.params;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== placeId
    );
    await user.save();

    res.status(200).json({ message: 'Place removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).populate('wishlist');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
