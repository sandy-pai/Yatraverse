import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import axios from "axios";
import Place from "./models/Place.js";

await mongoose.connect(process.env.MONGO_URI);

const places = await Place.find();

for (const place of places) {
  try {
    const query = `${place.name} ${place.state} India`;

    const response = await axios.get(
      "https://api.pexels.com/v1/search",
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY,
        },
        params: {
          query,
          per_page: 1,
        },
      }
    );

    if (response.data.photos.length > 0) {
      place.image = response.data.photos[0].src.large;
      await place.save();
      console.log(`✔ ${place.name}`);
    } else {
      console.log(`❌ No image found for ${place.name}`);
    }
  } catch (err) {
    console.log(`Error for ${place.name}`);
  }
}

console.log("Finished!");

await mongoose.disconnect();