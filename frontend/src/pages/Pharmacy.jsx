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
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" />
      <h2>Pharmacy Portal</h2>

      {/* Patient Details */}
        <h3>Patient Details</h3>
        <input
          type="text"
          placeholder="Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          style={{display: "block",
                  margin: "0 auto 10px",
                  width: "300px",
                  fontFamily: "Arial, sans-serif",
                  border: "1px solid #8b8686a7",
                  borderRadius: "5px",
                  padding: "4px"}}/>

        <input
          type="number"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          style={{display: "block",
                  margin: "0 auto 10px",
                  width: "300px",
                  fontFamily: "Arial, sans-serif",
                  border: "1px solid #8b8686a7",
                  borderRadius: "5px",
                  padding: "4px" }}/>

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
            width: "600px",
            margin: "0 auto 20px",
            borderRadius: "5px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
          <input
            type="text"
            placeholder="Medicine Name"
            value={med.name}
            onChange={(e) => {
              const updated = [...medicines];
              updated[index].name = e.target.value;
              setMedicines(updated);
            }}
            style={{margin: "0 15px 5px",
                  fontFamily: "Arial, sans-serif",
                  border: "1px solid #8b8686a7",
                  borderRadius: "5px",
                  padding: "4px"}}/>

          <select
            value={med.time}
            style={{margin: "0 15px 5px",
                  fontFamily: "Arial, sans-serif",
                  border: "1px solid #8b8686a7",
                  borderRadius: "5px",
                  padding: "6px",
                  width: "140px"}}
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
            style={{margin: "0 15px 5px",
                  fontFamily: "Arial, sans-serif",
                  border: "1px solid #8b8686a7",
                  borderRadius: "5px",
                  padding: "4px",
                  width: "70px"}}/>

          <input
            type="number"
            placeholder="Days"
            value={med.duration}
            onChange={(e) => {
              const updated = [...medicines];
              updated[index].duration = e.target.value;
              setMedicines(updated);
            }}
            style={{margin: "0 15px 5px",
                  fontFamily: "Arial, sans-serif",
                  border: "1px solid #8b8686a7",
                  borderRadius: "5px",
                  padding: "4px",
                  width: "70px"}}
          />
        </div>
      ))}
      {/* STEP 4 ENDS HERE */}

      {/* Step 5: Add / Remove */}
      <button className="btn btn-primary" type="submit"
        onClick={() =>
          setMedicines([
            ...medicines,
            { name: "", time: "Morning", timesPerDay: 1, duration: "" },
          ])
        }
        style={{ marginRight: "10px" }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
      </svg> Add Medicine
      </button>

      <button className="btn btn-primary" type="submit"
        onClick={() => {
          if (medicines.length > 1) {
            setMedicines(medicines.slice(0, -1));
          }
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash" viewBox="0 0 16 16">
        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
        </svg>
        Remove Last
      </button>

            {/* Step 6 */}
      <button
  onClick={async () => {
    const response = await fetch("https://super-fishstick-7vp6w55xjrx3r6r9-5000.app.github.dev/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientName,
        mobile,
        medicines,
      }),
    });

    const data = await response.json();
    console.log(data);
    alert("Prescription ID: " + data.prescriptionId);
  }}
>
  Generate Bill
</button>

    </div>
  );
}

export default Pharmacy;
