import Place from '../models/Place.js';

// @desc    Get all tourist places with search and filter
// @route   GET /api/places
// @access  Public
export const getPlaces = async (req, res) => {
  try {
    const { search, state } = req.query;
  // We will sort by averageRating after fetching
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (state && state !== 'All') {
      query.state = state;
    }

    const places = await Place.find(query).sort({ createdAt: -1 });
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single tourist place by ID
// @route   GET /api/places/:id
// @access  Public
export const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: 'Tourist Place Not Found' });
    }

    res.json(place);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Tourist Place Not Found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a tourist place
// @route   POST /api/places
// @access  Public (Admin)
export const createPlace = async (req, res) => {
  try {
    const {
      name,
      state,
      city,
      description,
      bestTime,
      entryFee,
      location,
    } = req.body;

    // Prefer an uploaded file (converted to Base64 data URI); fall back to a
    // plain URL string submitted in the request body.
    const image = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
      : req.body.image;

    const place = await Place.create({
      name,
      state,
      city,
      image,
      description,
      bestTime,
      entryFee,
      location,
    });

    res.status(201).json(place);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a tourist place
// @route   PUT /api/places/:id
// @access  Public (Admin)
export const updatePlace = async (req, res) => {
  try {
    const {
      name,
      state,
      city,
      description,
      bestTime,
      entryFee,
      rating,
      location,
    } = req.body;

    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: 'Tourist Place Not Found' });
    }

    // Resolve image: uploaded file → Base64 data URI, body string → URL,
    // nothing provided → keep the existing stored value.
    let image = place.image;
    if (req.file) {
      image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    } else if (req.body.image) {
      image = req.body.image;
    }

    place.name = name || place.name;
    place.state = state || place.state;
    place.city = city || place.city;
    place.image = image;
    place.description = description || place.description;
    place.bestTime = bestTime || place.bestTime;
    place.entryFee = entryFee !== undefined ? entryFee : place.entryFee;
    // rating field removed; keep existing ratings array unchanged
    place.location = location || place.location;

    const updatedPlace = await place.save();
    res.json(updatedPlace);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Tourist Place Not Found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a tourist place
// @route   DELETE /api/places/:id
// @access  Public (Admin)
export const deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: 'Tourist Place Not Found' });
    }

    await place.deleteOne();
    res.json({ message: 'Tourist Place Removed' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Tourist Place Not Found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Search tourist places by name (case-insensitive regex)
// @route   GET /api/places/search?name=
// @access  Public
export const searchPlaces = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    const places = await Place.find({
      name: { $regex: name, $options: 'i' },
    }).sort({ createdAt: -1 });
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get tourist places by state
// @route   GET /api/places/state/:state
// @access  Public
export const getPlacesByState = async (req, res) => {
  try {
    const { state } = req.params;
    const places = await Place.find({ state }).sort({ createdAt: -1 });
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all unique states for filter dropdown
// @route   GET /api/places/states
// @access  Public
export const getStates = async (req, res) => {
  try {
    const states = await Place.distinct('state');
    res.json(states.sort());
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};