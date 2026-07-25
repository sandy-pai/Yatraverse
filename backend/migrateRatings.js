// migrateRatings.js
// One‑time script to migrate legacy `rating` field to the new `ratings` array.
// Uses placeholder user ObjectId "000000000000000000000000" for the original rating.

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Place from './models/Place.js';
import connectDB from './config/db.js';

dotenv.config();

const placeholderUserId = new mongoose.Types.ObjectId('000000000000000000000000');

const migrate = async () => {
  try {
    await connectDB();
    const collection = mongoose.connection.db.collection('places');
    const cursor = collection.find({});
    let migratedCount = 0;
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      if (doc.rating != null && (!doc.ratings || doc.ratings.length === 0)) {
        const newRating = { user: placeholderUserId, value: doc.rating };
        await collection.updateOne(
          { _id: doc._id },
          {
            $set: { ratings: [newRating] },
            $unset: { rating: '' },
          }
        );
        migratedCount++;
      }
    }
    console.log(`Migration completed. ${migratedCount} place(s) updated.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
