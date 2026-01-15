const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 5000;

// ✅ MongoDB connection (FIRST)
mongoose
  .connect(
    "mongodb+srv://vamship250106_db_user:aUQob0DczLPN5gdr@cluster0.jzucuh6.mongodb.net/medicationDB"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ✅ Create prescription API
app.post("/api/prescriptions", (req, res) => {
  const prescriptionData = req.body;
  const prescriptionId = uuidv4();

  res.json({
    message: "Prescription created successfully",
    prescriptionId,
    data: prescriptionData,
  });
});

// ✅ Start server (LAST)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
