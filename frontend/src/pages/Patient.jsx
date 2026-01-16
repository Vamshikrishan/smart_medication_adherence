import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

function Patient() {
  const [prescriptionId, setPrescriptionId] = useState("");
  const [prescription, setPrescription] = useState(null);
  const [error, setError] = useState("");

  const qrCodeRef = useRef(null);
  const isScanningRef = useRef(false);

  const fetchPrescription = async (id) => {
    try {
      setError("");
      const response = await fetch(
        `https://super-fishstick-7vp6w55xjrx3r6r9-5000.app.github.dev/api/prescriptions/${id}`
      );

      if (!response.ok) throw new Error("Prescription not found");

      const data = await response.json();
      setPrescription(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    // Prevent duplicate scanner
    if (isScanningRef.current) return;
    isScanningRef.current = true;

    const html5QrCode = new Html5Qrcode("qr-reader");
    qrCodeRef.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          // ✅ STOP CAMERA IMMEDIATELY
          await html5QrCode.stop();
          await html5QrCode.clear();

          isScanningRef.current = false;

          setPrescriptionId(decodedText);
          fetchPrescription(decodedText);
        }
      )
      .catch(() => {
        isScanningRef.current = false;
      });

    return () => {
      if (qrCodeRef.current) {
        qrCodeRef.current.stop().catch(() => {});
        qrCodeRef.current.clear().catch(() => {});
        qrCodeRef.current = null;
        isScanningRef.current = false;
      }
    };
  }, []);

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h2>Patient Portal</h2>
      <p>Scan the QR code provided by the pharmacy</p>

      {/* QR Camera */}
      <div
        id="qr-reader"
        style={{ width: "300px", margin: "0 auto" }}
      ></div>

      {prescriptionId && (
        <p style={{ marginTop: "15px" }}>
          <strong>Prescription ID:</strong> {prescriptionId}
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

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
