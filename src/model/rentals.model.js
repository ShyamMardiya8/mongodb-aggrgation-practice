const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  bookId: {
    type: Number,
    required: true,
    trim: true,
  },
  rentedAt: {
    type: String,
    required: true,
    trim: true,
  },
  returnedAt: {
    type: Number,
    required: true,
    trim: true,
  },
  rentalPrice: {
    type: Number,
    required: true,
    trim: true,
  },
});

const Rental = mongoose.model("books", rentalSchema);

module.exports = Rental;
