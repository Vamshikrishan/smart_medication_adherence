import { useState } from "react";
import styles from "/workspaces/smart_medication_adherence/frontend/src/styles/Pharmacy.module.css";

function Pharmacy() {
  const [patientName, setPatientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [qrCode, setQrCode] = useState("");

  const [medicines, setMedicines] = useState([
    { name: "", reminderTime: "09:00", duration: "" },
  ]);

  const handleGenerateBill = async () => {
    const response = await fetch(
      "https://super-fishstick-7vp6w55xjrx3r6r9-5000.app.github.dev/api/prescriptions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientName, mobile, medicines }),
      }
    );

    const data = await response.json();
    alert("Prescription ID: " + data.prescriptionId);
    setQrCode(data.qrCode);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>💊 Pharmacy Portal</h1>

        <h3 className={styles.section}>Patient Details</h3>

        <input
          className={styles.input}
          placeholder="Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />

        <input
          className={styles.input}
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <h3 className={styles.section}>Medicines</h3>

        {medicines.map((med, index) => (
          <div key={index} className={styles.medicineRow}>
            <input
              className={styles.input}
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
              className={styles.input}
              value={med.reminderTime}
              onChange={(e) => {
                const m = [...medicines];
                m[index].reminderTime = e.target.value;
                setMedicines(m);
              }}
            />

            <input
              type="number"
              placeholder="Days"
              className={styles.input}
              value={med.duration}
              onChange={(e) => {
                const m = [...medicines];
                m[index].duration = e.target.value;
                setMedicines(m);
              }}
            />
          </div>
        ))}

        <div className={styles.btnRow}>
          <button
            className={`${styles.btn} ${styles.add}`}
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
            className={`${styles.btn} ${styles.remove}`}
            onClick={() =>
              medicines.length > 1 &&
              setMedicines(medicines.slice(0, -1))
            }
          >
            − Remove Last
          </button>
        </div>

        <button
          className={`${styles.btn} ${styles.generate}`}
          onClick={handleGenerateBill}
        >
          Generate Bill
        </button>

        {qrCode && (
          <div className={styles.qrBox}>
            <h3>Prescription Generated</h3>
            <img src={qrCode} alt="QR" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Pharmacy;
