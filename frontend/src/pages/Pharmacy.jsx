import { useState } from "react";

function Pharmacy() {
  // Patient state
  const [patientName, setPatientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [qrCode, setQrCode] = useState("");

  // Medicines state
  const [medicines, setMedicines] = useState([
    { name: "", time: "Morning", timesPerDay: 1, duration: "" },
  ]);

  // ✅ Generate Bill handler
  const handleGenerateBill = async () => {
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
          medicines,
        }),
      }
    );

    const data = await response.json();
    console.log(data);

    alert("Prescription ID: " + data.prescriptionId);

    // 🔥 THIS WAS MISSING
    setQrCode(data.qrCode);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", textAlign: "center" }}>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      />

      <h2>Pharmacy Portal</h2>

      <h3>Patient Details</h3>
      <input
        type="text"
        placeholder="Patient Name"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
        style={{ display: "block", margin: "0 auto 10px", width: "300px" }}
      />

      <input
        type="number"
        placeholder="Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        style={{ display: "block", margin: "0 auto 20px", width: "300px" }}
      />

      <h3>Medicines</h3>

      {medicines.map((med, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            margin: "0 auto 15px",
            width: "600px",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
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

          <select
            value={med.time}
            onChange={(e) => {
              const updated = [...medicines];
              updated[index].time = e.target.value;
              setMedicines(updated);
            }}
          >
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Night</option>
          </select>

          <input
            type="number"
            placeholder="Times/day"
            value={med.timesPerDay}
            onChange={(e) => {
              const updated = [...medicines];
              updated[index].timesPerDay = e.target.value;
              setMedicines(updated);
            }}
            style={{ width: "80px" }}
          />

          <input
            type="number"
            placeholder="Days"
            value={med.duration}
            onChange={(e) => {
              const updated = [...medicines];
              updated[index].duration = e.target.value;
              setMedicines(updated);
            }}
            style={{ width: "80px" }}
          />
        </div>
      ))}

      <button
        type="button"
        className="btn btn-primary"
        onClick={() =>
          setMedicines([
            ...medicines,
            { name: "", time: "Morning", timesPerDay: 1, duration: "" },
          ])
        }
        style={{ marginRight: "10px" }}
      >
        + Add Medicine
      </button>

      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          if (medicines.length > 1) {
            setMedicines(medicines.slice(0, -1));
          }
        }}
        style={{ marginRight: "10px" }}
      >
        − Remove Last
      </button>

      <br />
      <br />

      <button
        type="button"
        className="btn btn-success"
        onClick={handleGenerateBill}
      >
        Generate Bill
      </button>

      {/* ✅ QR CODE DISPLAY */}
      {qrCode && (
        <div style={{ marginTop: "25px" }}>
          <h4>Scan this QR Code</h4>
          <img src={qrCode} alt="Prescription QR" />
        </div>
      )}
    </div>
  );
}

export default Pharmacy;
