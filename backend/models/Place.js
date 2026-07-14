import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Place name is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    image:String,
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    bestTime: {
      type: String,
      required: [true, 'Best time to visit is required'],
    },
    entryFee: {
      type: Number,
      required: [true, 'Entry fee is required'],
      min: [0, 'Entry fee cannot be negative'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Place = mongoose.model('Place', placeSchema);

export default Place;