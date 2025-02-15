const { Router } = require("express");
const { upload } = require("./img");
const Card = require("./model/card");
const Slider = require("./model/slider");
const path = require("path");
const fs = require("fs");
const { auth } = require("./middleware");
const { log } = require("console");

const router = Router();

router.get("/cards", async function (req, res) {
  try {
    const cards = await Card.find().sort({ date: -1 }); // Get all cards sorted by latest
    res.json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cards" });
  }
});

router.post("/cards", upload.single("card"), async function (req, res) {
  console.log(req.body, req.file);
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const newCard = new Card({
      title,
      description,
      imageUrl: `${req.file.filename}`,
      date: new Date(),
    });
    await newCard.save();

    res
      .status(201)
      .json({ message: "Card uploaded successfully", card: newCard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload card" });
  }
});

router.delete("/cards/:id", async function (req, res) {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    const imagePath = path.join(__dirname, "../public/card", card.imageUrl);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Card.findByIdAndDelete(req.params.id);

    res.json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete card" });
  }
});

// ✅ GET all sliders
router.get("/sliders", async function (req, res) {
  try {
    const sliders = await Slider.find().sort({ date: -1 }); // Fetch all sliders sorted by date
    res.json(sliders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch sliders" });
  }
});

// ✅ POST a new slider (Upload image)
router.post("/sliders", upload.single("slider"), async function (req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const newSlider = new Slider({
      imageUrl: `${req.file.filename}`,
      date: new Date(),
    });

    await newSlider.save();
    res
      .status(201)
      .json({ message: "Slider uploaded successfully", slider: newSlider });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload slider" });
  }
});

// ✅ DELETE a slider by ID (Remove from DB & local storage)
router.delete("/sliders/:id", async function (req, res) {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) {
      return res.status(404).json({ error: "Slider not found" });
    }

    const imagePath = path.join(__dirname, "../public/slider", slider.imageUrl);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete slider from DB
    await Slider.findByIdAndDelete(req.params.id);

    res.json({ message: "Slider deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete slider" });
  }
});

module.exports = router;
