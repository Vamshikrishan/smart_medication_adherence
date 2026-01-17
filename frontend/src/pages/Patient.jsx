import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

function Patient() {
  const [prescriptionId, setPrescriptionId] = useState("");
  const [prescription, setPrescription] = useState(null);
  const [error, setError] = useState("");

  const qrCodeRef = useRef(null);
  const isScanningRef = useRef(false);
  const reminderTimers = useRef([]); // ✅ IMPORTANT

  /* ===============================
     FETCH PRESCRIPTION
     =============================== */
  const fetchPrescription = async (id) => {
    try {
      setError("");

      const response = await fetch(
        `https://super-fishstick-7vp6w55xjrx3r6r9-5000.app.github.dev/api/prescriptions/${id}`
      );

      if (!response.ok) {
        throw new Error("Prescription not found");
      }

      const data = await response.json();
      setPrescription(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  /* ===============================
     REMINDER SYSTEM
     =============================== */
  const scheduleReminders = (medicines) => {
    medicines.forEach((med, index) => {
      // ⏱ test delay (5 sec, 8 sec, 11 sec...)
      const delay = 5000 + index * 3000;

      console.log("⏰ Reminder scheduled:", med.name);

      const timer = setTimeout(() => {
        console.log("🔔 Reminder fired:", med.name);

        // Notification
        if (Notification.permission === "granted") {
          new Notification("💊 Medication Reminder", {
            body: `Time to take ${med.name}`,
          });
        } else {
          alert(`Time to take ${med.name}`);
        }

        // Voice
        const speech = new SpeechSynthesisUtterance(
          `Please take your medicine ${med.name}`
        );
        speechSynthesis.speak(speech);

      }, delay);

      reminderTimers.current.push(timer);
    });
  };

  /* ===============================
     NOTIFICATION PERMISSION
     =============================== */
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  /* ===============================
     QR SCANNER
     =============================== */
  useEffect(() => {
    if (isScanningRef.current) return;
    isScanningRef.current = true;

    const html5QrCode = new Html5Qrcode("qr-reader");
    qrCodeRef.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          await html5QrCode.stop();
          await html5QrCode.clear();

          qrCodeRef.current = null;
          isScanningRef.current = false;

          setPrescriptionId(decodedText);

          const data = await fetchPrescription(decodedText);

          if (data?.medicines) {
            scheduleReminders(data.medicines);
          }
        }
      )
      .catch(() => {
        isScanningRef.current = false;
      });

    return () => {
      if (qrCodeRef.current) {
        qrCodeRef.current.stop().catch(() => {});
        qrCodeRef.current.clear().catch(() => {});
      }

      // 🧹 clear timers
      reminderTimers.current.forEach(clearTimeout);
    };
  }, []);

  /* ===============================
     UI
     =============================== */
  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h2>Patient Portal</h2>
      <p>Scan the QR code provided by the pharmacy</p>

      <div
        id="qr-reader"
        style={{ width: "300px", margin: "0 auto" }}
      />

      {prescriptionId && (
        <p>
          <strong>Prescription ID:</strong> {prescriptionId}
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {prescription && (
        <div style={{ marginTop: "20px" }}>
          <h3>Medicines</h3>

          {prescription.medicines.map((med, index) => (
            <p key={index}>
              <strong>{med.name}</strong> — {med.time} —{" "}
              {med.timesPerDay} times/day for {med.duration} days
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default Patient;
