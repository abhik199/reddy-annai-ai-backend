const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // To automatically add createdAt and updatedAt fields to the schema
  }
);

// Exporting the model
const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
