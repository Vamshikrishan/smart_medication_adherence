import { useState } from "react";

function Patient() {
  const [prescriptionId, setPrescriptionId] = useState("");

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h2>Patient Portal</h2>

      <p>Scan the QR code provided by the pharmacy</p>

      <input
        type="text"
        placeholder="Prescription ID (for now)"
        value={prescriptionId}
        onChange={(e) => setPrescriptionId(e.target.value)}
        style={{ width: "400px", padding: "8px" }}
      />
    </div>
  );
}

export default Patient;
