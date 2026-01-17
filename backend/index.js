const QRCode = require("qrcode");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 5000;

/* ======================
   Middleware
====================== */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

/* ======================
   MongoDB Schema
====================== */

const MedicineSchema = new mongoose.Schema({
  name: String,
  reminderTime: String, // "14:01"
  duration: Number, // days
  startDate: String,
  endDate: String,
});

const PrescriptionSchema = new mongoose.Schema({
  prescriptionId: String,
  patientName: String,
  mobile: String,
  medicines: [MedicineSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Prescription = mongoose.model(
  "Prescription",
  PrescriptionSchema
);

/* ======================
   Routes
====================== */

app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* ======================
   CREATE PRESCRIPTION
====================== */

app.post("/api/prescriptions", async (req, res) => {
  try {
    const { patientName, mobile, medicines } = req.body;

    const prescriptionId = uuidv4();

    const today = new Date();

    const processedMedicines = medicines.map((med) => {
      const start = new Date(today);
      const end = new Date(today);
      end.setDate(end.getDate() + Number(med.duration));

      return {
        name: med.name,
        reminderTime: med.reminderTime,
        duration: med.duration,
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
      };
    });

    const prescription = new Prescription({
      prescriptionId,
      patientName,
      mobile,
      medicines: processedMedicines,
    });

    await prescription.save();

    const qrCode = await QRCode.toDataURL(prescriptionId);

    res.json({
      message: "Prescription saved successfully",
      prescriptionId,
      qrCode,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create prescription",
    });
  }
});

/* ======================
   GET PRESCRIPTION
====================== */

app.get("/api/prescriptions/:id", async (req, res) => {
  try {
    const prescription = await Prescription.findOne({
      prescriptionId: req.params.id,
    });

    if (!prescription) {
      return res.status(404).json({
        error: "Prescription not found",
      });
    }

    res.json(prescription);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch prescription",
    });
  }
});

/* ======================
   START SERVER
====================== */

async function startServer() {
  try {
    console.log("⏳ Connecting to MongoDB...");

    await mongoose.connect(
      "mongodb+srv://vamship250106_db_user:aUQob0DczLPN5gdr@cluster0.jzucuh6.mongodb.net/medicationDB",
      {
        serverSelectionTimeoutMS: 5000,
      }
    );

    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();
