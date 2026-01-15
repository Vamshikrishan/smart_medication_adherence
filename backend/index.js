const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 5000;

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/api/prescriptions", (req, res) => {
  const prescriptionId = uuidv4();
  res.json({
    message: "Prescription created successfully",
    prescriptionId,
  });
});

// 🔥 START SERVER ONLY AFTER DB CONNECTS
async function startServer() {
  try {
    console.log("⏳ Connecting to MongoDB...");

    await mongoose.connect(
      "mongodb+srv://vamship250106_db_user:aUQob0DczLPN5gdr@cluster0.jzucuh6.mongodb.net/medicationDB",
      {
        serverSelectionTimeoutMS: 5000, // IMPORTANT
      }
    );

    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);
    process.exit(1); // stop server if DB fails
  }
}

const PrescriptionSchema = new mongoose.Schema({
  prescriptionId: String,
  patientName: String,
  mobile: String,
  medicines: Array,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Prescription = mongoose.model("Prescription", PrescriptionSchema);

startServer();
