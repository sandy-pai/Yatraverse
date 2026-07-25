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
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        value: { type: Number, min: [1, 'Rating must be at least 1'], max: [5, 'Rating cannot exceed 5'], required: true },
      },
    ],
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to compute average rating (rounded to one decimal, 0 if none)
placeSchema.virtual('averageRating').get(function () {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, cur) => acc + cur.value, 0);
  return Math.round((sum / this.ratings.length) * 10) / 10;
});

const Place = mongoose.model('Place', placeSchema);

export default Place;