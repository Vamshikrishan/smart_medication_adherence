import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function Patient() {
  const [prescriptionId, setPrescriptionId] = useState("");
  const [prescription, setPrescription] = useState(null);
  const [error, setError] = useState("");

  const fetchPrescription = async (id) => {
    try {
      setError("");
      setPrescription(null);

      const response = await fetch(
        `https://super-fishstick-7vp6w55xjrx3r6r9-5000.app.github.dev/api/prescriptions/${id}`
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

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear();
        setPrescriptionId(decodedText);
        fetchPrescription(decodedText);
      },
      (err) => {
        // ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h2>Patient Portal</h2>
      <p>Scan the QR code provided by the pharmacy</p>

      {/* QR Scanner */}
      <div
        id="qr-reader"
        style={{ width: "300px", margin: "0 auto" }}
      ></div>

      {prescriptionId && (
        <p style={{ marginTop: "15px" }}>
          <strong>Prescription ID:</strong> {prescriptionId}
        </p>
      )}

      {error && (
        <p style={{ color: "red", marginTop: "15px" }}>
          {error}
        </p>
      )}

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
