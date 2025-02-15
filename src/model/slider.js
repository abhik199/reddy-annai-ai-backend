const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Slider = mongoose.model("Slider", sliderSchema);
module.exports = Slider;
