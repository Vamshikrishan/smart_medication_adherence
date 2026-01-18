import { useState } from "react";
import "/workspaces/smart_medication_adherence/frontend/src/styles/Pharmacy.css";

function Pharmacy() {
  const [patientName, setPatientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");

  const [medicines, setMedicines] = useState([
    { name: "", reminderTime: "09:00", duration: "" },
  ]);

  /* ===============================
     VALIDATION FUNCTIONS
  =============================== */

  const isValidName = (value) => {
    const regex = /^[A-Za-z ]+(\.[A-Za-z ]+)?$/;
    return regex.test(value);
  };

  const isValidMobile = (value) => {
    return /^\d{10}$/.test(value);
  };

  const isValidDays = (value) => {
    const num = Number(value);
    return num >= 1 && num <= 99;
  };

  /* ===============================
     GENERATE BILL
  =============================== */
  const handleGenerateBill = async () => {
    setError("");

    // -------- Empty checks ----------
    if (!patientName.trim()) {
      return setError("❌ Patient name cannot be empty");
    }

    if (!isValidName(patientName.trim())) {
      return setError(
        "❌ Patient name must contain only alphabets and a single dot"
      );
    }

    if (!isValidMobile(mobile)) {
      return setError("❌ Mobile number must be exactly 10 digits");
    }

    for (let i = 0; i < medicines.length; i++) {
      const med = medicines[i];

      if (!med.name.trim()) {
        return setError(`❌ Medicine ${i + 1} name cannot be empty`);
      }

      if (!isValidName(med.name.trim())) {
        return setError(
          `❌ Medicine ${i + 1} name must contain only alphabets and one dot`
        );
      }

      if (!med.duration) {
        return setError(`❌ Medicine ${i + 1} duration is required`);
      }

      if (!isValidDays(med.duration)) {
        return setError(
          `❌ Medicine ${i + 1} days must be between 1 and 99`
        );
      }
    }

    // -------- API CALL ----------
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
    setQrCode(data.qrCode);

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 300);
  };

  /* ===============================
     ADD / REMOVE MEDICINE
  =============================== */
  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", reminderTime: "09:00", duration: "" },
    ]);
  };

  const removeMedicine = () => {
    if (medicines.length > 1) {
      setMedicines(medicines.slice(0, -1));
    }
  };

  return (
    <div className="pharmacy-wrapper">
      <div className="pharmacy-card">

        <h1 className="title">💊 Pharmacy Portal</h1>

        <h3 className="section-title">Patient Details</h3>

        <div className="patient-row">
          <input
            className="input"
            placeholder="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />

          <input
            className="input"
            placeholder="Mobile Number"
            value={mobile}
            maxLength={10}
            onChange={(e) =>
              setMobile(e.target.value.replace(/\D/g, ""))
            }
          />
        </div>

        <h3 className="section-title">Medicines</h3>

        {medicines.map((med, index) => (
          <div className="medicine-row" key={index}>
            <input
              className="input"
              placeholder="Medicine Name"
              value={med.name}
              onChange={(e) => {
                const m = [...medicines];
                m[index].name = e.target.value;
                setMedicines(m);
              }}
            />

            <input
              type="time"
              className="input time-input"
              value={med.reminderTime}
              onChange={(e) => {
                const m = [...medicines];
                m[index].reminderTime = e.target.value;
                setMedicines(m);
              }}
            />

            <input
              className="input"
              type="number"
              placeholder="Days"
              value={med.duration}
              min="1"
              max="99"
              onChange={(e) => {
                const m = [...medicines];
                m[index].duration = e.target.value;
                setMedicines(m);
              }}
            />
          </div>
        ))}

        {/* Buttons */}
        <div className="button-row">
          <button className="btn blue" onClick={addMedicine}>
            + Add Medicine
          </button>

          <button className="btn red" onClick={removeMedicine}>
            − Remove Last
          </button>
        </div>

        <div className="generate-wrapper">
          <button className="btn green big" onClick={handleGenerateBill}>
            Generate Bill
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div
            style={{
              marginTop: 20,
              background: "#fee2e2",
              color: "#991b1b",
              padding: 15,
              borderRadius: 12,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* QR */}
        {qrCode && (
          <div className="qr-box">
            <h3>✅ Prescription Generated</h3>
            <img src={qrCode} alt="QR Code" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Pharmacy;
