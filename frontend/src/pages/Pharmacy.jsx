import { useState } from "react";

function Pharmacy() {
  const [patientName, setPatientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [qrCode, setQrCode] = useState("");

  const [medicines, setMedicines] = useState([
    {
      name: "",
      time: "09:00",
      ampm: "AM",
      duration: "",
    },
  ]);

  /* ===============================
     GENERATE BILL
     =============================== */
  const handleGenerateBill = async () => {
    const formattedMedicines = medicines.map((med) => ({
      name: med.name,
      time: `${med.time} ${med.ampm}`, // ✅ FINAL TIME FORMAT
      duration: med.duration,
    }));

    const response = await fetch(
      "https://super-fishstick-7vp6w55xjrx3r6r9-5000.app.github.dev/api/prescriptions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientName,
          mobile,
          medicines: formattedMedicines,
        }),
      }
    );

    const data = await response.json();

    alert("Prescription ID: " + data.prescriptionId);
    setQrCode(data.qrCode);
  };

  return (
    <div style={{ padding: 30, textAlign: "center", fontFamily: "Arial" }}>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      />

      <h2>Pharmacy Portal</h2>

      {/* ================= PATIENT ================= */}
      <h4>Patient Details</h4>

      <input
        placeholder="Patient Name"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
        style={{ width: 300, marginBottom: 10 }}
      />

      <br />

      <input
        placeholder="Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        style={{ width: 300, marginBottom: 25 }}
      />

      {/* ================= MEDICINES ================= */}
      <h4>Medicines</h4>

      {medicines.map((med, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            width: 650,
            margin: "10px auto",
            display: "flex",
            gap: 10,
            justifyContent: "center",
          }}
        >
          <input
            placeholder="Medicine Name"
            value={med.name}
            onChange={(e) => {
              const updated = [...medicines];
              updated[index].name = e.target.value;
              setMedicines(updated);
            }}
          />

          {/* ⏰ TIME */}
          <input
            type="time"
            value={med.time}
            onChange={(e) => {
              const updated = [...medicines];
              updated[index].time = e.target.value;
              setMedicines(updated);
            }}
          />

          {/* AM / PM */}
          <select
            value={med.ampm}
            onChange={(e) => {
              const updated = [...medicines];
              updated[index].ampm = e.target.value;
              setMedicines(updated);
            }}
          >
            <option>AM</option>
            <option>PM</option>
          </select>

          {/* DAYS */}
          <input
            type="number"
            placeholder="Days"
            value={med.duration}
            onChange={(e) => {
              const updated = [...medicines];
              updated[index].duration = e.target.value;
              setMedicines(updated);
            }}
            style={{ width: 80 }}
          />
        </div>
      ))}

      {/* ================= BUTTONS ================= */}
      <button
        className="btn btn-primary"
        onClick={() =>
          setMedicines([
            ...medicines,
            { name: "", time: "09:00", ampm: "AM", duration: "" },
          ])
        }
      >
        + Add Medicine
      </button>

      <button
        className="btn btn-danger"
        style={{ marginLeft: 10 }}
        onClick={() => {
          if (medicines.length > 1)
            setMedicines(medicines.slice(0, -1));
        }}
      >
        − Remove Last
      </button>

      <br />
      <br />

      <button
        className="btn btn-success"
        onClick={handleGenerateBill}
      >
        Generate Bill
      </button>

      {/* ================= QR CODE ================= */}
      {qrCode && (
        <div style={{ marginTop: 30 }}>
          <h4>Scan this QR Code</h4>
          <img src={qrCode} alt="QR Code" />
        </div>
      )}
    </div>
  );
}

export default Pharmacy;
