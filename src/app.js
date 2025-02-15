const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" })); // Increase limit for JSON payload
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Increase limit for URL-encoded data

app.use(express.static(path.join(__dirname, "../public")));

require("./db.js");

app.use("/", require("./authRoutes.js"));
app.use("/", require("./routes.js"));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
