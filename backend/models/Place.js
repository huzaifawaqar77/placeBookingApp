const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  address: String,
  description: String,
  photos: [String],
  extraInfo: String,
  checkIn: Number,
  checkOut: Number,
  perks: [String],
  maxGuests: Number,
  price: Number,
});

module.exports = mongoose.model("Place", placeSchema);
