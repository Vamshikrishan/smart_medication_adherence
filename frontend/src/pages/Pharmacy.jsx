import { useState } from "react";

function Pharmacy() {
  // Patient state
  const [patientName, setPatientName] = useState("");
  const [mobile, setMobile] = useState("");

  // Medicines state
  const [medicines, setMedicines] = useState([
    { name: "", time: "Morning", timesPerDay: 1, duration: "" },
  ]);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Pharmacy Portal</h2>

      {/* Patient Details */}
      <h3>Patient Details</h3>
      <input
        type="text"
        placeholder="Patient Name"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "300px" }}
      />

      <input
        type="text"
        placeholder="Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        style={{ display: "block", marginBottom: "20px", width: "300px" }}
      />

      {/* Medicines Section */}
      <h3>Medicines</h3>

      {/* STEP 4 STARTS HERE */}
      {medicines.map((med, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "10px",
            width: "500px",
          }}
        >
          <input
            type="text"
            placeholder="Medicine Name"
            value={med.name}
            onChange={(e) => {
              const updated = [...medicines];
              updated[index].name = e.target.value;
              setMedicines(updated);
            }}
            style={{ marginRight: "10px" }}
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
            style={{ marginLeft: "10px", width: "90px" }}
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
            style={{ marginLeft: "10px", width: "80px" }}
          />
        </div>
      ))}
      {/* STEP 4 ENDS HERE */}

      {/* Step 5: Add / Remove */}
      <button
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
        onClick={() => {
          if (medicines.length > 1) {
            setMedicines(medicines.slice(0, -1));
          }
        }}
      >
        − Remove Last
      </button>

      {/* Step 6 */}
      <div style={{ marginTop: "30px" }}>
        <button onClick={() => console.log(patientName, mobile, medicines)}>
          Generate Bill
        </button>
      </div>
    </div>
  );
}

export default Pharmacy;
