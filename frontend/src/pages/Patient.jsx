import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

function Patient() {
  const [prescriptionId, setPrescriptionId] = useState("");
  const [prescription, setPrescription] = useState(null);
  const [error, setError] = useState("");

  const qrCodeRef = useRef(null);
  const isScanningRef = useRef(false);

  /* ===============================
     FETCH PRESCRIPTION FROM BACKEND
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

      return data; // ✅ VERY IMPORTANT
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  /* ===============================
     REMINDER LOGIC
     =============================== */
  const scheduleReminders = (medicines) => {
    medicines.forEach((med) => {
      const timeMap = {
        Morning: 8,
        Afternoon: 13,
        Night: 20,
      };

      const hour = timeMap[med.time];
      const now = new Date();

      const reminder = new Date();
      reminder.setHours(hour, 0, 0, 0);

      if (reminder < now) {
        reminder.setDate(reminder.getDate() + 1);
      }

      const delay = reminder - now;

      setTimeout(() => {
        // 🔔 Notification
        if (Notification.permission === "granted") {
          new Notification("💊 Medication Reminder", {
            body: `Time to take ${med.name}`,
          });
        }

        // 🔊 Voice alert
        const speech = new SpeechSynthesisUtterance(
          `Please take your medicine ${med.name}`
        );
        speechSynthesis.speak(speech);
      }, delay);
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
          // 🛑 stop camera immediately
          await html5QrCode.stop();
          await html5QrCode.clear();

          qrCodeRef.current = null;
          isScanningRef.current = false;

          setPrescriptionId(decodedText);

          const data = await fetchPrescription(decodedText);

          if (data && data.medicines) {
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
        qrCodeRef.current = null;
        isScanningRef.current = false;
      }
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
