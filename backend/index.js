const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 5000;

// CORS (FIXED)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.options("/*", cors());

// Middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Create prescription API
app.post("/api/prescriptions", (req, res) => {
  const prescriptionData = req.body;
  const prescriptionId = uuidv4();

  res.json({
    message: "Prescription created successfully",
    prescriptionId,
    data: prescriptionData,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
