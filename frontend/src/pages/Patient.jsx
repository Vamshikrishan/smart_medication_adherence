import { useState } from "react";

function Patient() {
  const [prescriptionId, setPrescriptionId] = useState("");
  const [prescription, setPrescription] = useState(null);
  const [error, setError] = useState("");

  // ✅ Fetch prescription from backend
  const fetchPrescription = async () => {
    try {
      setError("");
      setPrescription(null);

      const response = await fetch(
        `https://super-fishstick-7vp6w55xjrx3r6r9-5000.app.github.dev/api/prescriptions/${prescriptionId}`
      );

      if (!response.ok) {
        throw new Error("Prescription not found");
      }

      const data = await response.json();
      setPrescription(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h2>Patient Portal</h2>

      <p>Scan the QR code provided by the pharmacy</p>

      <input
        type="text"
        placeholder="Prescription ID"
        value={prescriptionId}
        onChange={(e) => setPrescriptionId(e.target.value)}
        style={{ width: "400px", padding: "8px" }}
      />

      <br />
      <br />

      <button onClick={fetchPrescription}>
        Load Prescription
      </button>

      {/* Error message */}
      {error && (
        <p style={{ color: "red", marginTop: "15px" }}>
          {error}
        </p>
      )}

      {/* Prescription display */}
      {prescription && (
        <div style={{ marginTop: "20px" }}>
          <h3>Medicines</h3>
          {prescription.medicines.map((med, index) => (
            <p key={index}>
              <strong>{med.name}</strong> – {med.time} –{" "}
              {med.timesPerDay} times/day for {med.duration} days
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default Patient;
