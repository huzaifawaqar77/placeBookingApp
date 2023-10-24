const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  place: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Place",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  checkIn: {
    type: String,
    required: true,
  },
  checkOut: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  guests: {
    type: String,
    required: true,
  },
  price: String,
});

module.exports = mongoose.model("Booking", BookingSchema);
