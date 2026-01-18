import { useState } from "react";

function Pharmacy() {
  const [patientName, setPatientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [qrCode, setQrCode] = useState("");

  const [medicines, setMedicines] = useState([
    {
      name: "",
      reminderTime: "09:00",
      duration: "",
    },
  ]);

  /* ===============================
     GENERATE BILL
     =============================== */
  const handleGenerateBill = async () => {
    const response = await fetch(
      "https://super-fishstick-7vp6w55xjrx3r6r9-5000.app.github.dev/api/prescriptions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName,
          mobile,
          medicines,
        }),
      }
    );

    const data = await response.json();

    alert("Prescription ID: " + data.prescriptionId);
    setQrCode(data.qrCode);
  };

  return (
    <div style={page}>
      <div style={glassCard}>
        <h1 style={title}>💊 Pharmacy Portal</h1>

        {/* ================= PATIENT ================= */}
        <h4 style={sectionTitle}>Patient Details</h4>

        <input
          style={input}
          placeholder="Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />

        <input
          style={input}
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        {/* ================= MEDICINES ================= */}
        <h4 style={sectionTitle}>Medicines</h4>

        {medicines.map((med, index) => (
          <div key={index} style={medicineRow}>
            <input
              style={input}
              placeholder="Medicine Name"
              value={med.name}
              onChange={(e) => {
                const updated = [...medicines];
                updated[index].name = e.target.value;
                setMedicines(updated);
              }}
            />

            <input
              style={input}
              type="time"
              value={med.reminderTime}
              onChange={(e) => {
                const updated = [...medicines];
                updated[index].reminderTime = e.target.value;
                setMedicines(updated);
              }}
            />

            <input
              style={{ ...input, width: 90 }}
              type="number"
              placeholder="Days"
              value={med.duration}
              onChange={(e) => {
                const updated = [...medicines];
                updated[index].duration = e.target.value;
                setMedicines(updated);
              }}
            />
          </div>
        ))}

        {/* ================= BUTTONS ================= */}
        <div style={{ textAlign: "center", marginTop: 25 }}>
          <button
            style={addBtn}
            onClick={() =>
              setMedicines([
                ...medicines,
                { name: "", reminderTime: "09:00", duration: "" },
              ])
            }
          >
            + Add Medicine
          </button>

          <button
            style={removeBtn}
            onClick={() =>
              medicines.length > 1 &&
              setMedicines(medicines.slice(0, -1))
            }
          >
            − Remove Last
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 30 }}>
          <button style={generateBtn} onClick={handleGenerateBill}>
            Generate Bill
          </button>
        </div>

        {/* ================= QR CODE ================= */}
        {qrCode && (
          <div style={qrBox}>
            <h3>✅ Prescription Generated</h3>
            <img src={qrCode} alt="QR Code" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Pharmacy;

/* ===============================
   STYLES
   =============================== */

const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#4f46e5,#6366f1,#818cf8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const glassCard = {
  background: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(15px)",
  borderRadius: "25px",
  padding: "45px",
  width: "900px",
  boxShadow: "0 40px 90px rgba(0,0,0,0.25)",
};

const title = {
  textAlign: "center",
  marginBottom: 30,
};

const sectionTitle = {
  textAlign: "center",
  marginTop: 20,
  marginBottom: 15,
};

const input = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #c7d2fe",
  marginBottom: 15,
  fontSize: "16px",
  outline: "none",
};

const medicineRow = {
  display: "flex",
  gap: 15,
  marginBottom: 10,
};

const addBtn = {
  padding: "12px 24px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "12px",
  marginRight: 10,
  cursor: "pointer",
};

const removeBtn = {
  padding: "12px 24px",
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
};

const generateBtn = {
  padding: "16px 50px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "18px",
  fontSize: "18px",
  cursor: "pointer",
};

const qrBox = {
  marginTop: 40,
  textAlign: "center",
  padding: 25,
  borderRadius: 18,
  background: "linear-gradient(135deg,#22c55e,#4ade80)",
  color: "white",
};
